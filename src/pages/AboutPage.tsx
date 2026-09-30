import { Link } from 'react-router-dom'
import { QUESTIONS_BY_SECTION, SECTION_META, SECTION_ORDER } from '../data'
import { CONTENT_DOMAINS, CONTENT_SOURCES } from '../data/contentDomains'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">About These Questions</h1>
        <Link to="/" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back home
        </Link>
      </div>

      <div className="rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-sm text-amber-100">
        <p className="font-semibold">These are original practice questions, not real ACT questions.</p>
        <p className="mt-2 text-amber-200/90">
          Actual ACT test forms are copyrighted and not publicly available, so no app can honestly claim its
          questions are pulled from or identical to the real test. Every question here was written from scratch
          to match the <em>style, difficulty, and officially published content domains</em> of the ACT — sourced
          directly from ACT.org (linked below) — so the topics and skills you practice are the same ones the real
          test covers, even though the exact wording is original.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-100">Current official test structure</h2>
        <p className="mb-3 text-sm text-slate-400">
          Section timing in this app matches ACT's current official format (effective September 2025).
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-left text-slate-300">Section</th>
                <th className="px-3 py-2 text-left text-slate-300">Official questions</th>
                <th className="px-3 py-2 text-left text-slate-300">Official time</th>
                <th className="px-3 py-2 text-left text-slate-300">Questions in this app</th>
              </tr>
            </thead>
            <tbody>
              {SECTION_ORDER.map((s) => (
                <tr key={s} className="border-t border-slate-700">
                  <td className="px-3 py-2 text-slate-200">{SECTION_META[s].label}</td>
                  <td className="px-3 py-2 text-slate-400">{SECTION_META[s].officialQuestionCount}</td>
                  <td className="px-3 py-2 text-slate-400">{SECTION_META[s].officialMinutes} min</td>
                  <td className="px-3 py-2 text-slate-400">{QUESTIONS_BY_SECTION[s].length}</td>
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
        <h2 className="mb-2 text-lg font-semibold text-slate-100">Content domain alignment</h2>
        <p className="mb-4 text-sm text-slate-400">
          Every question is tagged with the official ACT content domain (reporting category) it targets. Compare
          ACT's published weight for each domain against this app's actual question mix below.
        </p>
        <div className="flex flex-col gap-6">
          {SECTION_ORDER.map((s) => {
            const questions = QUESTIONS_BY_SECTION[s]
            const domains = CONTENT_DOMAINS[s]
            return (
              <div key={s}>
                <h3 className="mb-2 font-semibold text-slate-200">{SECTION_META[s].label}</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-800">
                        <th className="px-3 py-2 text-left text-slate-300">ACT content domain</th>
                        <th className="px-3 py-2 text-left text-slate-300">Official weight</th>
                        <th className="px-3 py-2 text-left text-slate-300">This app</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((d) => {
                        const count = questions.filter((q) => q.domain === d.id).length
                        const pct = questions.length > 0 ? Math.round((count / questions.length) * 100) : 0
                        return (
                          <tr key={d.id} className="border-t border-slate-700">
                            <td className="px-3 py-2 text-slate-200">{d.label}</td>
                            <td className="px-3 py-2 text-slate-400">
                              {d.weightRange[0] === d.weightRange[1]
                                ? `${d.weightRange[0]}%`
                                : `${d.weightRange[0]}–${d.weightRange[1]}%`}
                            </td>
                            <td className="px-3 py-2 text-slate-400">
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
        <h2 className="mb-2 text-lg font-semibold text-slate-100">How the estimated ACT score works</h2>
        <p className="text-sm text-slate-400">
          After each session, this app converts your percent correct into a rough 1–36 scaled score using an
          approximate, smoothed curve — not ACT's real conversion table. ACT doesn't publish one universal
          table: real scores are "equated" per test form and vary slightly between administrations. The
          Composite score follows ACT's current rule (average of English, Math, and Reading, Science excluded)
          per the official scoring page linked below. Treat any estimate here as a directional signal, and treat a
          15-question practice set as a noisy sample of the real, much longer section — accuracy will get more
          meaningful as you complete more sessions.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-100">Sources</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {CONTENT_SOURCES.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
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
