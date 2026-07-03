import { useEffect, useRef, useState } from 'react'
import { useApp } from '../app/AppContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextArea } from '../components/TextArea'
import { mockCoachProvider, summarizeEntryForCoach } from '../lib/coach'

export function CoachPage() {
  const { data, addCoachMessage } = useApp()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = data.coachMessages
  const latestEntry = [...data.dailyEntries].sort((a, b) => b.date.localeCompare(a.date))[0]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    addCoachMessage({ role: 'user', content: text })
    setInput('')
    setLoading(true)

    try {
      const response = await mockCoachProvider.generateResponse(text, {
        profile: data.profile,
        goals: data.goals,
        latestEntry,
        program: data.program,
      })
      addCoachMessage({
        role: 'assistant',
        content: response,
        linkedDailyEntryId: latestEntry?.id,
      })
    } finally {
      setLoading(false)
    }
  }

  const useLatestEntry = () => {
    if (!latestEntry) return
    const summary = summarizeEntryForCoach(latestEntry)
    setInput((prev) => (prev ? `${prev}\n\n${summary}` : summary))
  }

  return (
    <div className="flex flex-col space-y-4 md:h-auto">
      <header>
        <p className="text-sm text-[var(--color-ink-muted)]">Coach</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">A quiet second voice</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Local reflections only — no cloud, no API.
        </p>
      </header>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={useLatestEntry} disabled={!latestEntry}>
          Use latest entry as context
        </Button>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col !p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-sm text-[var(--color-ink-muted)]">
              Share what's on your mind. The coach responds with pattern-aware reflections — not
              prescriptions.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'ml-auto bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-ink)]'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {line.startsWith('**') ? (
                    <>
                      <strong>{line.replace(/\*\*/g, '').split(' — ')[0]}</strong>
                      {line.includes(' — ') && ` — ${line.split(' — ').slice(1).join(' — ')}`}
                    </>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-[var(--color-ink-muted)]" role="status">
              Reflecting…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[var(--color-border)] p-4">
          <TextArea
            label="Your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's weighing on you?"
            rows={2}
          />
          <Button className="mt-3" onClick={send} loading={loading} disabled={!input.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}
