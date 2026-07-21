'use server'

import { buildNatalSystemPrompt, buildSynastrySystemPrompt, type AIContext } from './prompt'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'

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
 * Call DeepSeek Chat Completions API (OpenAI-compatible).
 * https://api-docs.deepseek.com/zh-cn/
 */
export async function callDeepSeekAI(
  messages: ChatMessage[],
  stream = false,
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek AI is not configured. Please set DEEPSEEK_API_KEY.')
  }

  const body = {
    model: DEEPSEEK_MODEL,
    stream,
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`DeepSeek AI request failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const reply = data?.choices?.[0]?.message?.content
  if (!reply) {
    throw new Error('DeepSeek AI returned an empty response.')
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
 * Main AI chat handler (DeepSeek)
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

    const reply = await callDeepSeekAI(messages)
    return { reply }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return {
      reply: '',
      error: msg,
    }
  }
}
