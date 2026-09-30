import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { SECTION_META, SECTION_ORDER, getQuestions } from '../data'
import type { DifficultyFilter, Mode, Section } from '../types'

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

const DIFFICULTY_INFO: Record<DifficultyFilter, { label: string; description: string }> = {
  mixed: { label: 'Mixed', description: 'Realistic spread, like the real test.' },
  easy: { label: 'Review Basics', description: 'Fundamentals only — rebuild confidence.' },
  medium: { label: 'Standard', description: 'Typical ACT-level questions.' },
  hard: { label: 'Challenge Myself', description: 'Tougher, multi-step questions.' },
}

export function HomePage() {
  const [mode, setMode] = useState<Mode>('practice')
  const [section, setSection] = useState<Section>('english')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('mixed')
  const { startQuiz } = useQuiz()
  const navigate = useNavigate()

  const needsSectionPicker = mode !== 'full'
  const supportsDifficulty = mode !== 'full'

  const availableCount = needsSectionPicker
    ? getQuestions(section).filter((q) => difficulty === 'mixed' || q.difficulty === difficulty).length
    : 0

  const handleStart = () => {
    startQuiz(mode, needsSectionPicker ? [section] : SECTION_ORDER, { difficulty })
    navigate('/quiz')
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">ACT Practice</h1>
        <div className="flex gap-4 text-sm">
          <Link to="/mastery" className="text-blue-600 hover:text-blue-700">
            Skill mastery
          </Link>
          <Link to="/about" className="text-blue-600 hover:text-blue-700">
            About these questions
          </Link>
          <Link to="/history" className="text-blue-600 hover:text-blue-700">
            Progress history →
          </Link>
        </div>
      </div>
      <p className="mt-2 text-slate-500">Pick a mode and start practicing. Your results are saved locally.</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Mode</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(MODE_INFO) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === m
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-slate-900">{MODE_INFO[m].label}</div>
              <div className="mt-1 text-xs text-slate-500">{MODE_INFO[m].description}</div>
            </button>
          ))}
        </div>
      </section>

      {needsSectionPicker && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Section</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {SECTION_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  section === s
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{SECTION_META[s].label}</div>
                <div className="mt-1 text-xs text-slate-500">{getQuestions(s).length} questions available</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {supportsDifficulty && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Difficulty</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {(Object.keys(DIFFICULTY_INFO) as DifficultyFilter[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  difficulty === d
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{DIFFICULTY_INFO[d].label}</div>
                <div className="mt-1 text-xs text-slate-500">{DIFFICULTY_INFO[d].description}</div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {availableCount} question{availableCount === 1 ? '' : 's'} available at this difficulty for{' '}
            {SECTION_META[section].label}.
          </p>
        </section>
      )}

      {mode === 'full' && (
        <section className="mt-8 rounded-xl border border-slate-200 bg-blue-50/60 p-4 text-sm text-slate-600">
          Full test order: {SECTION_ORDER.map((s) => SECTION_META[s].label).join(' → ')}. Each section uses the
          full mixed-difficulty bank, timed at the official ACT pace, just like the real test.
        </section>
      )}

      <button
        onClick={handleStart}
        disabled={needsSectionPicker && availableCount === 0}
        className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Start
      </button>
    </div>
  )
}
