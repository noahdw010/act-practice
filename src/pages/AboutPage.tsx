import { Link } from 'react-router-dom'
import { QUESTIONS_BY_SECTION, SECTION_META, SECTION_ORDER } from '../data'
import { CONTENT_DOMAINS, CONTENT_SOURCES } from '../data/contentDomains'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">About These Questions</h1>
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back home
        </Link>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">These are original practice questions, not real ACT questions.</p>
        <p className="mt-2 text-amber-800">
          Actual ACT test forms are copyrighted and not publicly available, so no app can honestly claim its
          questions are pulled from or identical to the real test. Every question here was written from scratch
          to match the <em>style, difficulty, and officially published content domains</em> of the ACT — sourced
          directly from ACT.org (linked below) — so the topics and skills you practice are the same ones the real
          test covers, even though the exact wording is original.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Current official test structure</h2>
        <p className="mb-3 text-sm text-slate-500">
          Section timing in this app matches ACT's current official format (effective September 2025).
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 text-left text-slate-700">Section</th>
                <th className="px-3 py-2 text-left text-slate-700">Official questions</th>
                <th className="px-3 py-2 text-left text-slate-700">Official time</th>
                <th className="px-3 py-2 text-left text-slate-700">Questions in this app</th>
              </tr>
            </thead>
            <tbody>
              {SECTION_ORDER.map((s) => (
                <tr key={s} className="border-t border-slate-200">
                  <td className="px-3 py-2 text-slate-800">{SECTION_META[s].label}</td>
                  <td className="px-3 py-2 text-slate-500">{SECTION_META[s].officialQuestionCount}</td>
                  <td className="px-3 py-2 text-slate-500">{SECTION_META[s].officialMinutes} min</td>
                  <td className="px-3 py-2 text-slate-500">{QUESTIONS_BY_SECTION[s].length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          This app's question bank is intentionally smaller than the real test, so Timed and Full Test modes scale
          the clock proportionally (bank size × official seconds-per-question) rather than using the official
          question count directly.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Content domain alignment</h2>
        <p className="mb-4 text-sm text-slate-500">
          Every question is tagged with the official ACT content domain (reporting category) it targets. Compare
          ACT's published weight for each domain against this app's actual question mix below.
        </p>
        <div className="flex flex-col gap-6">
          {SECTION_ORDER.map((s) => {
            const questions = QUESTIONS_BY_SECTION[s]
            const domains = CONTENT_DOMAINS[s]
            return (
              <div key={s}>
                <h3 className="mb-2 font-semibold text-slate-800">{SECTION_META[s].label}</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="px-3 py-2 text-left text-slate-700">ACT content domain</th>
                        <th className="px-3 py-2 text-left text-slate-700">Official weight</th>
                        <th className="px-3 py-2 text-left text-slate-700">This app</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((d) => {
                        const count = questions.filter((q) => q.domain === d.id).length
                        const pct = questions.length > 0 ? Math.round((count / questions.length) * 100) : 0
                        return (
                          <tr key={d.id} className="border-t border-slate-200">
                            <td className="px-3 py-2 text-slate-800">{d.label}</td>
                            <td className="px-3 py-2 text-slate-500">
                              {d.weightRange[0] === d.weightRange[1]
                                ? `${d.weightRange[0]}%`
                                : `${d.weightRange[0]}–${d.weightRange[1]}%`}
                            </td>
                            <td className="px-3 py-2 text-slate-500">
                              {count} question{count === 1 ? '' : 's'} ({pct}%)
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">How the estimated ACT score works</h2>
        <p className="text-sm text-slate-500">
          After each session, this app converts your percent correct into a rough 1–36 scaled score using an
          approximate, smoothed curve — not ACT's real conversion table. ACT doesn't publish one universal
          table: real scores are "equated" per test form and vary slightly between administrations. The
          Composite score follows ACT's current rule (average of English, Math, and Reading, Science excluded)
          per the official scoring page linked below. Treat any estimate here as a directional signal, and treat a
          small practice set as a noisy sample of the real, much longer section — accuracy will get more
          meaningful as you complete more sessions.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">How difficulty and skill tracking work</h2>
        <p className="text-sm text-slate-500">
          Every question is tagged Easy, Medium, or Hard so you can choose Review Basics, Standard, or Challenge
          Myself when starting a Practice or Timed session (Full Test always uses the realistic mixed bank, like
          the real ACT). Separately, every answer you submit is logged by its specific tested skill (e.g. "Subject-verb
          agreement," "Trend analysis") — not just its section — building up an accuracy history over time. The{' '}
          <Link to="/mastery" className="text-blue-600 hover:text-blue-700">
            Skill Mastery
          </Link>{' '}
          page surfaces skills below 70% accuracy (once there's enough data to be meaningful) so you can jump
          straight into targeted practice on exactly what's holding your score back.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Sources</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {CONTENT_SOURCES.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {src.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
