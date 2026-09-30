import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { SECTION_META, SECTION_ORDER, getQuestions } from '../data'
import type { Mode, Section } from '../types'

const MODE_INFO: Record<Mode, { label: string; description: string }> = {
  practice: {
    label: 'Untimed Practice',
    description: 'No clock. Get instant feedback and an explanation after every question.',
  },
  timed: {
    label: 'Timed Quiz',
    description: 'One section, paced at the official ACT rate. Scored at the end.',
  },
  full: {
    label: 'Full Simulated Test',
    description: 'All four sections back-to-back, in official order and pacing.',
  },
}

export function HomePage() {
  const [mode, setMode] = useState<Mode>('practice')
  const [section, setSection] = useState<Section>('english')
  const { startQuiz } = useQuiz()
  const navigate = useNavigate()

  const needsSectionPicker = mode !== 'full'

  const handleStart = () => {
    startQuiz(mode, needsSectionPicker ? [section] : SECTION_ORDER)
    navigate('/quiz')
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-100">ACT Practice</h1>
        <div className="flex gap-4 text-sm">
          <Link to="/about" className="text-blue-400 hover:text-blue-300">
            About these questions
          </Link>
          <Link to="/history" className="text-blue-400 hover:text-blue-300">
            Progress history →
          </Link>
        </div>
      </div>
      <p className="mt-2 text-slate-400">Pick a mode and start practicing. Your results are saved locally.</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Mode</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(MODE_INFO) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === m
                  ? 'border-blue-500 bg-blue-950/50'
                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
              }`}
            >
              <div className="font-semibold text-slate-100">{MODE_INFO[m].label}</div>
              <div className="mt-1 text-xs text-slate-400">{MODE_INFO[m].description}</div>
            </button>
          ))}
        </div>
      </section>

      {needsSectionPicker && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Section</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {SECTION_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  section === s
                    ? 'border-blue-500 bg-blue-950/50'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold text-slate-100">{SECTION_META[s].label}</div>
                <div className="mt-1 text-xs text-slate-400">{getQuestions(s).length} questions available</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {mode === 'full' && (
        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm text-slate-400">
          Full test order: {SECTION_ORDER.map((s) => SECTION_META[s].label).join(' → ')}. Each section is timed at
          the official ACT pace based on the number of practice questions available.
        </section>
      )}

      <button
        onClick={handleStart}
        className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-500 sm:w-auto"
      >
        Start
      </button>
    </div>
  )
}
