import { formatTime } from '../lib/quizEngine'

export function Timer({ remainingSec }: { remainingSec: number | null }) {
  if (remainingSec === null) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
        Untimed
      </span>
    )
  }
  const low = remainingSec <= 60
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-mono font-semibold tabular-nums ${
        low ? 'bg-red-600 text-white' : 'bg-blue-50 text-blue-700'
      }`}
    >
      {formatTime(remainingSec)}
    </span>
  )
}
