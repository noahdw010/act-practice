import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadAttempts, clearAttempts } from '../lib/storage'
import { SECTION_META } from '../data'
import { formatTime } from '../lib/quizEngine'
import { ProgressChart } from '../components/ProgressChart'

const MODE_LABEL = { practice: 'Practice', timed: 'Timed', full: 'Full Test' } as const

export function HistoryPage() {
  const [attempts, setAttempts] = useState(() => loadAttempts())

  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
    : 0
  const best = attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0

  const handleClear = () => {
    if (confirm('Clear all saved practice history? This cannot be undone.')) {
      clearAttempts()
      setAttempts([])
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Progress History</h1>
        <div className="flex gap-4 text-sm">
          <Link to="/mastery" className="text-blue-600 hover:text-blue-700">
            Skill mastery
          </Link>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            ← Back home
          </Link>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No practice sessions yet. Complete one to start tracking your progress.
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{attempts.length}</div>
              <div className="text-xs text-slate-500">Sessions</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{avg}%</div>
              <div className="text-xs text-slate-500">Average score</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{best}%</div>
              <div className="text-xs text-slate-500">Best score</div>
            </div>
          </div>

          <ProgressChart attempts={attempts} />

          <div className="mt-6 flex flex-col gap-2">
            {attempts.map((a) => {
              const estimateLabel =
                a.compositeScore != null
                  ? `Est. Composite ${a.compositeScore}/36`
                  : a.sections
                      .map((s) => {
                        const score = a.sectionScores?.[s]
                        return score !== undefined ? `Est. ${score}/36 (${SECTION_META[s].label})` : null
                      })
                      .filter(Boolean)
                      .join(' · ')

              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {MODE_LABEL[a.mode]} · {a.sections.map((s) => SECTION_META[s].label).join(', ')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(a.date).toLocaleString()} · {formatTime(a.totalTimeSpentSec)}
                    </div>
                    {estimateLabel && <div className="mt-0.5 text-xs text-blue-600">{estimateLabel}</div>}
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{a.percentage}%</div>
                </div>
              )
            })}
          </div>

          <button
            onClick={handleClear}
            className="mt-8 text-xs text-slate-500 underline hover:text-red-600"
          >
            Clear history
          </button>
        </>
      )}
    </div>
  )
}
