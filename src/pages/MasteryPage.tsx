import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { loadAttempts } from '../lib/storage'
import { computeSkillStats, MIN_ATTEMPTS_FOR_SIGNAL } from '../lib/skillStats'
import { SECTION_META } from '../data'

export function MasteryPage() {
  const [attempts] = useState(() => loadAttempts())
  const { startQuiz } = useQuiz()
  const navigate = useNavigate()

  const stats = computeSkillStats(attempts)
  const withSignal = stats.filter((s) => s.attempts >= MIN_ATTEMPTS_FOR_SIGNAL)
  const needsWork = withSignal.filter((s) => s.accuracy < 70)
  const goingWell = withSignal.filter((s) => s.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy)
  const gathering = stats.filter((s) => s.attempts < MIN_ATTEMPTS_FOR_SIGNAL)

  const practiceSkill = (skill: string, section: (typeof stats)[number]['section']) => {
    startQuiz('practice', [section], { skills: [skill] })
    navigate('/quiz')
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Skill Mastery</h1>
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back home
        </Link>
      </div>
      <p className="mb-6 text-sm text-slate-500">
        Tracked automatically across every practice session, broken down by tested skill — not just section — so
        you can see exactly what to work on next, and it gets more accurate the more you practice.
      </p>

      {stats.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No data yet. Complete a practice session and this page will start tracking your strengths and weaknesses
          by skill.
        </div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700">
              Focus here (below 70% accuracy)
            </h2>
            {needsWork.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nothing below 70% yet with enough data — nice work, or keep practicing to surface weak spots.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {needsWork.map((s) => (
                  <div
                    key={s.skill}
                    className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800">{s.skill}</div>
                      <div className="text-xs text-slate-500">
                        {SECTION_META[s.section].label} · {s.correct}/{s.attempts} correct ·{' '}
                        {new Date(s.lastSeen).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-amber-700">{s.accuracy}%</span>
                      <button
                        onClick={() => practiceSkill(s.skill, s.section)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Practice this
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {goingWell.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
                Going well (70%+ accuracy)
              </h2>
              <div className="flex flex-wrap gap-2">
                {goingWell.map((s) => (
                  <span
                    key={s.skill}
                    className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-green-800"
                  >
                    {s.skill} · {s.accuracy}%
                  </span>
                ))}
              </div>
            </section>
          )}

          {gathering.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Still gathering data (fewer than {MIN_ATTEMPTS_FOR_SIGNAL} questions answered)
              </h2>
              <div className="flex flex-wrap gap-2">
                {gathering.map((s) => (
                  <span
                    key={s.skill}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-500"
                  >
                    {s.skill} · {s.correct}/{s.attempts}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
