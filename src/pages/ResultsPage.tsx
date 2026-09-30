import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { SECTION_META, SECTION_ORDER } from '../data'
import { formatTime } from '../lib/quizEngine'
import type { Section } from '../types'

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="rounded-full border border-blue-800 bg-blue-950/60 px-2.5 py-0.5 text-xs font-semibold text-blue-200">
      Est. {score}/36
    </span>
  )
}

export function ResultsPage() {
  const { completedAttempt } = useQuiz()
  const navigate = useNavigate()

  if (!completedAttempt) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-100">No recent result</h1>
        <p className="mt-2 text-slate-400">Start a practice session to see your results here.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            Go home
          </Link>
          <Link
            to="/history"
            className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500"
          >
            View history
          </Link>
        </div>
      </div>
    )
  }

  const missed = completedAttempt.sectionResults.flatMap((r) =>
    r.answered.filter((a) => !a.correct).map((a) => ({ section: r.section, ...a })),
  )

  const weakAreas = Object.entries(
    missed.reduce<Record<string, number>>((acc, m) => {
      acc[m.question.skill] = (acc[m.question.skill] ?? 0) + 1
      return acc
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const sectionsPresent = completedAttempt.sections
  const orderedSections = SECTION_ORDER.filter((s) => sectionsPresent.includes(s))

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-100">Results</h1>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-center">
        <div className="text-5xl font-bold text-slate-100">{completedAttempt.percentage}%</div>
        <div className="mt-1 text-slate-400">
          {completedAttempt.correctCount} / {completedAttempt.total} correct · {formatTime(completedAttempt.totalTimeSpentSec)} spent
        </div>

        {completedAttempt.compositeScore !== null && (
          <div className="mt-4 inline-block rounded-xl border border-blue-800 bg-blue-950/50 px-5 py-2">
            <div className="text-3xl font-bold text-blue-100">{completedAttempt.compositeScore}</div>
            <div className="text-xs text-blue-300">Estimated Composite (1–36)</div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-slate-500">
        Estimated ACT scores are a rough approximation from this session's accuracy — not an official score.{' '}
        <Link to="/about" className="text-blue-400 hover:text-blue-300">
          How is this estimated / how are questions sourced?
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {orderedSections.map((s) => {
          const r = completedAttempt.sectionResults.find((sr) => sr.section === s)
          if (!r) return null
          const score = completedAttempt.sectionScores[s]
          return (
            <div key={s} className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-100">{SECTION_META[s].label}</div>
                {score !== undefined && <ScoreBadge score={score} />}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                {r.correctCount} / {r.total} correct ({r.total > 0 ? Math.round((r.correctCount / r.total) * 100) : 0}%)
              </div>
            </div>
          )
        })}
      </div>

      {(completedAttempt.stemScore !== null || completedAttempt.elaScore !== null) && (
        <div className="mt-3 flex justify-center gap-6 text-xs text-slate-500">
          {completedAttempt.stemScore !== null && <span>Supplemental STEM: {completedAttempt.stemScore}/36</span>}
          {completedAttempt.elaScore !== null && <span>Supplemental ELA: {completedAttempt.elaScore}/36</span>}
        </div>
      )}

      {weakAreas.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Focus areas to improve next
          </h2>
          <div className="flex flex-wrap gap-2">
            {weakAreas.map(([skill, count]) => (
              <span
                key={skill}
                className="rounded-full border border-amber-800 bg-amber-950/40 px-3 py-1 text-xs text-amber-200"
              >
                {skill} · missed {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {missed.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Review missed questions</h2>
          <div className="flex flex-col gap-4">
            {missed.map((m) => (
              <div key={m.question.id} className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {SECTION_META[m.section as Section].label} · {m.question.skill}
                </div>
                <p className="mb-2 text-sm text-slate-200">{m.question.prompt}</p>

                <div className="flex flex-col gap-1 text-sm">
                  {m.question.choices.map((choice, idx) => {
                    const isCorrect = idx === m.question.answerIndex
                    const isPicked = idx === m.selectedIndex
                    if (!isCorrect && !isPicked) return null
                    return (
                      <p
                        key={idx}
                        className={isCorrect ? 'text-green-400' : 'text-red-400'}
                      >
                        <span className="font-semibold">
                          {String.fromCharCode(65 + idx)}. {choice}
                        </span>{' '}
                        {isCorrect ? '(correct)' : '(your answer)'}
                      </p>
                    )
                  })}
                  {m.selectedIndex === null && <p className="text-slate-500 italic">You didn't answer this one in time.</p>}
                </div>

                <div className="mt-3 rounded-lg bg-slate-900/50 p-3 text-sm text-slate-300">
                  <p className="mb-1 font-semibold text-slate-100">
                    Why {String.fromCharCode(65 + m.question.answerIndex)} is correct
                  </p>
                  <p>{m.question.explanation}</p>
                </div>

                {m.question.distractorRationale && Object.keys(m.question.distractorRationale).length > 0 && (
                  <div className="mt-2 rounded-lg bg-slate-900/50 p-3 text-sm text-slate-300">
                    <p className="mb-1 font-semibold text-slate-100">Why the other choices are wrong</p>
                    <ul className="flex flex-col gap-1">
                      {Object.entries(m.question.distractorRationale).map(([idx, note]) => (
                        <li key={idx}>
                          <span className="font-semibold text-slate-200">{String.fromCharCode(65 + Number(idx))}.</span>{' '}
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Practice again
        </button>
        <Link
          to="/history"
          className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500"
        >
          View history
        </Link>
      </div>
    </div>
  )
}
