import { NextRequest, NextResponse } from 'next/server'
import { createBitrixLead, extractLeadFields } from '@/lib/lead-flow'

type QuestionKey = 'service' | 'company' | 'channel'
const order: QuestionKey[] = ['service', 'company', 'channel']
const prompts: Record<QuestionKey, string> = {
  service: 'What service are you looking for?',
  company: 'What is your company name?',
  channel: 'What is the best way for us to contact you: phone, email, or something else?',
}

function say(text: string) {
  const voice = process.env.TWILIO_VOICE ?? 'Polly.Joanna'
  return `<Say voice="${voice}" language="en-US">${text}</Say>`
}
function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' })[character] ?? character)
}

function xml(body: string) {
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } })
}
function actionUrl(request: NextRequest, key: QuestionKey, values: URLSearchParams) {
  const url = new URL('/api/twilio/answer', request.url)
  url.searchParams.set('key', key)
  for (const field of order) {
    const value = values.get(field)
    if (value) url.searchParams.set(field, value)
  }
  return url.toString()
}

export async function POST(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key') as QuestionKey | null
  if (!key || !order.includes(key)) return xml(`${say('Sorry, this call could not be continued. Goodbye.')}<Hangup/>`)

  const form = await request.formData()
  const answer = form.get('SpeechResult')?.toString().trim() || 'Not provided'
  const values = new URLSearchParams(request.nextUrl.searchParams)
  values.set(key, answer)
  const nextKey = order[order.indexOf(key) + 1]

  if (nextKey) {
    const action = actionUrl(request, nextKey, values)
    return xml(`<Gather input="speech" action="${escapeXml(action)}" method="POST" speechTimeout="auto" language="en-US" actionOnEmptyResult="true">${say(prompts[nextKey])}</Gather>`)
  }

  const lead = await extractLeadFields({ service: values.get('service') ?? '', company: values.get('company') ?? '', channel: values.get('channel') ?? '' })
  await createBitrixLead(lead, form.get('From')?.toString() ?? '')
  return xml(`${say('Thank you. We have captured your request and will be in touch soon. Goodbye.')}<Hangup/>`)
}

export async function GET(request: NextRequest) {
  return POST(request)
}
