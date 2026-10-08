import { generateText, Output } from 'ai'
import { z } from 'zod'

const leadSchema = z.object({
  desiredService: z.string().describe('The service the caller wants'),
  companyName: z.string().describe('The caller company name, or empty string if absent'),
  contactChannel: z.string().describe('Preferred contact channel'),
  contactPhone: z.string().describe('Phone number when available, otherwise empty string'),
})

export type LeadFields = z.infer<typeof leadSchema>

export async function extractLeadFields(answers: { service: string; company: string; channel: string }) {
  const { output } = await generateText({
    model: process.env.AI_MODEL ?? 'google/gemini-3-flash',
    output: Output.object({ schema: leadSchema }),
    prompt: `Extract the lead fields from these short phone answers. Do not invent details.\nService: ${answers.service}\nCompany: ${answers.company}\nContact channel: ${answers.channel}`,
  })
  return output
}

export async function createBitrixLead(lead: LeadFields) {
  const webhook = process.env.BITRIX24_WEBHOOK_URL
  if (!webhook) throw new Error('BITRIX24_WEBHOOK_URL is not configured')

  const response = await fetch(`${webhook.replace(/\/$/, '')}/crm.lead.add.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        TITLE: `Inbound call — ${lead.desiredService}`,
        NAME: lead.companyName,
        COMPANY_TITLE: lead.companyName,
        SOURCE_ID: process.env.BITRIX24_SOURCE_ID ?? 'CALL',
        SOURCE_DESCRIPTION: `Contact preference: ${lead.contactChannel}`,
        COMMENTS: JSON.stringify(lead),
      },
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) throw new Error(`Bitrix24 returned ${response.status}`)
  const result = await response.json()
  if (result.error) throw new Error(`Bitrix24 error: ${result.error_description ?? result.error}`)
  return result
}
