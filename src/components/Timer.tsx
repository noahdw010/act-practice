import { formatTime } from '../lib/quizEngine'

export function Timer({ remainingSec }: { remainingSec: number | null }) {
  if (remainingSec === null) {
    return (
      <span className="rounded-full bg-slate-700 px-3 py-1 text-sm font-medium text-slate-200">
        Untimed
      </span>
    )
  }
  const low = remainingSec <= 60
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-mono font-semibold tabular-nums ${
        low ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-100'
      }`}
    >
      {formatTime(remainingSec)}
    </span>
  )
}
