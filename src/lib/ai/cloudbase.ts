'use server'

import { buildNatalSystemPrompt, buildSynastrySystemPrompt, type AIContext } from './prompt'

const CLOUDBASE_AI_BASE_URL = process.env.CLOUDBASE_AI_BASE_URL
const CLOUDBASE_AI_KEY = process.env.CLOUDBASE_AI_KEY

// Default model — uses a general-purpose model via CloudBase
const DEFAULT_MODEL = 'deepseek-v4-flash'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIChatRequest {
  message: string
  context: AIContext
  history: { role: 'user' | 'assistant'; content: string }[]
}

interface AIChatResponse {
  reply: string
  error?: string
}

/**
 * Call CloudBase AI with OpenAI-compatible Chat Completions API
 */
export async function callCloudBaseAI(
  messages: ChatMessage[],
  stream = false,
): Promise<string> {
  if (!CLOUDBASE_AI_BASE_URL || !CLOUDBASE_AI_KEY) {
    throw new Error('CloudBase AI is not configured. Please set CLOUDBASE_AI_BASE_URL and CLOUDBASE_AI_KEY.')
  }

  const url = `${CLOUDBASE_AI_BASE_URL}/chat/completions`

  const body = {
    model: DEFAULT_MODEL,
    stream,
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CLOUDBASE_AI_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`CloudBase AI request failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  // OpenAI Chat Completions response format
  const reply = data?.choices?.[0]?.message?.content
  if (!reply) {
    throw new Error('CloudBase AI returned an empty response.')
  }

  return reply as string
}

/**
 * Build system prompt from context
 */
function buildSystemPrompt(context: AIContext): string {
  if (context.type === 'synastry' && context.synastryData) {
    return buildSynastrySystemPrompt(
      context.synastryData.chartA,
      context.synastryData.chartB,
      context.synastryData.synastry,
    )
  }
  if (context.type === 'natal' && context.chartData) {
    return buildNatalSystemPrompt(context.chartData)
  }
  return 'You are Horoscope SERO AI, an expert Western astrology interpreter. Provide helpful and insightful guidance.'
}

/**
 * Main AI chat handler
 */
export async function handleAIChat(req: AIChatRequest): Promise<AIChatResponse> {
  try {
    const systemPrompt = buildSystemPrompt(req.context)

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...req.history.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: req.message },
    ]

    const reply = await callCloudBaseAI(messages)
    return { reply }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return {
      reply: '',
      error: msg,
    }
  }
}
