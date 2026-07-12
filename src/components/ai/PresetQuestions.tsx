'use client'

import { natalPresetQuestions, synastryPresetQuestions } from '@/lib/ai/prompt'
import { useAIChatStore } from '@/stores/ai-chat-store'

interface PresetQuestionsProps {
  contextType: 'natal' | 'synastry'
}

export function PresetQuestions({ contextType }: PresetQuestionsProps) {
  const sendMessage = useAIChatStore((s) => s.sendMessage)
  const messages = useAIChatStore((s) => s.messages)
  const questions = contextType === 'natal' ? natalPresetQuestions : synastryPresetQuestions

  // Hide preset questions once the user has started chatting
  if (messages.length > 0) return null

  return (
    <div className="px-4 py-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6a6865]">
        Suggested Questions
      </p>
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="group flex items-center gap-2 rounded-lg border border-[#2a2a35] bg-[#16161e] px-3 py-2 text-left text-sm text-[#9a9895] transition-colors hover:border-[#c9a96e]/40 hover:bg-[#1f1f2a] hover:text-[#e8e6e3]"
          >
            <span className="text-[#c9a96e] opacity-50 transition-opacity group-hover:opacity-100">
              ✦
            </span>
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
