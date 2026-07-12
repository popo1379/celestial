import { NextRequest, NextResponse } from 'next/server'
import { handleAIChat } from '@/lib/ai/cloudbase'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { message, context, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      )
    }

    const result = await handleAIChat({
      message,
      context: context || { type: 'natal' },
      history: history || [],
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error, reply: '' },
        { status: 500 },
      )
    }

    return NextResponse.json({ reply: result.reply })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: msg, reply: '' },
      { status: 500 },
    )
  }
}
