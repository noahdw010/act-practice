import { useState } from 'react'
import type { AttemptRecord } from '../types'

const WIDTH = 640
const HEIGHT = 220
const PAD_L = 36
const PAD_R = 16
const PAD_T = 16
const PAD_B = 28

export function ProgressChart({ attempts }: { attempts: AttemptRecord[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  // Chronological order (oldest first) for a left-to-right trend line.
  const ordered = [...attempts].reverse()

  if (ordered.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/30 text-sm text-slate-500">
        Complete at least two practice sessions to see your trend.
      </div>
    )
  }

  const innerW = WIDTH - PAD_L - PAD_R
  const innerH = HEIGHT - PAD_T - PAD_B
  const stepX = ordered.length > 1 ? innerW / (ordered.length - 1) : 0

  const xFor = (i: number) => PAD_L + i * stepX
  const yFor = (pct: number) => PAD_T + innerH * (1 - pct / 100)

  const points = ordered.map((a, i) => ({ x: xFor(i), y: yFor(a.percentage), attempt: a }))
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const gridLines = [0, 25, 50, 75, 100]

  const hovered = hoverIdx !== null ? points[hoverIdx] : null

  return (
    <div className="relative rounded-xl border border-slate-700 bg-slate-800/30 p-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Line chart of score percentage across practice attempts over time"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {gridLines.map((g) => (
          <g key={g}>
            <line
              x1={PAD_L}
              x2={WIDTH - PAD_R}
              y1={yFor(g)}
              y2={yFor(g)}
              stroke="currentColor"
              className="text-slate-700"
              strokeWidth={1}
            />
            <text x={PAD_L - 8} y={yFor(g) + 3} textAnchor="end" className="fill-slate-500 text-[10px]">
              {g}%
            </text>
          </g>
        ))}

        <path d={path} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i ? 6 : 4}
              fill="#3b82f6"
              stroke="#0f172a"
              strokeWidth={2}
              onMouseEnter={() => setHoverIdx(i)}
            />
            <rect
              x={p.x - stepX / 2}
              y={PAD_T}
              width={stepX}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
            />
          </g>
        ))}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-lg"
          style={{
            left: `${(hovered.x / WIDTH) * 100}%`,
            top: 0,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold">{hovered.attempt.percentage}%</div>
          <div className="text-slate-400">{new Date(hovered.attempt.date).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  )
}
