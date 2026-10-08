import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function say(text: string) {
  const voice = process.env.TWILIO_VOICE ?? 'Polly.Joanna'
  return `<Say voice="${voice}" language="en-US">${text}</Say>`
}

export async function POST() {
  const answerUrl = '/api/twilio/answer?key=service'
  const prompt = 'Hello. I can help capture your request in just three short questions. What service are you looking for?'
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="speech" action="${answerUrl}" method="POST" speechTimeout="auto" language="en-US" actionOnEmptyResult="true">${say(prompt)}</Gather></Response>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } })
}

export async function GET() {
  return POST()
}
