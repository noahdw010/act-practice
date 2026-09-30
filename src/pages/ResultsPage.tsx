import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { SECTION_META } from '../data'
import { formatTime } from '../lib/quizEngine'

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-100">Results</h1>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-center">
        <div className="text-5xl font-bold text-slate-100">{completedAttempt.percentage}%</div>
        <div className="mt-1 text-slate-400">
          {completedAttempt.correctCount} / {completedAttempt.total} correct · {formatTime(completedAttempt.totalTimeSpentSec)} spent
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {completedAttempt.sectionResults.map((r) => (
          <div key={r.section} className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="font-semibold text-slate-100">{SECTION_META[r.section].label}</div>
            <div className="mt-1 text-sm text-slate-400">
              {r.correctCount} / {r.total} correct ({r.total > 0 ? Math.round((r.correctCount / r.total) * 100) : 0}%)
            </div>
          </div>
        ))}
      </div>

      {missed.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Review missed questions</h2>
          <div className="flex flex-col gap-4">
            {missed.map((m) => (
              <div key={m.question.id} className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {SECTION_META[m.section].label} · {m.question.skill}
                </div>
                <p className="mb-2 text-sm text-slate-200">{m.question.prompt}</p>
                <p className="text-sm text-slate-400">
                  Correct answer:{' '}
                  <span className="font-semibold text-green-400">
                    {String.fromCharCode(65 + m.question.answerIndex)}. {m.question.choices[m.question.answerIndex]}
                  </span>
                </p>
                {m.selectedIndex !== null && (
                  <p className="text-sm text-slate-400">
                    Your answer:{' '}
                    <span className="font-semibold text-red-400">
                      {String.fromCharCode(65 + m.selectedIndex)}. {m.question.choices[m.selectedIndex]}
                    </span>
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-300">{m.question.explanation}</p>
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
