import { COMPOSITE_SECTIONS } from '../data/sectionMeta'
import type { Section, SectionResult } from '../types'

/**
 * Rough percent-correct -> 1-36 ACT scaled-score curve.
 *
 * IMPORTANT: ACT does not publish a single official raw-to-scale conversion
 * table — real conversions are "equated" per test form and vary slightly
 * administration to administration, and are not public. This is a smooth,
 * monotonic approximation of the general shape of that curve (scores bottom
 * out at 1, top scores require near-perfect accuracy), used only to give a
 * ballpark sense of where a practice score might land. Treat it as directional,
 * not a certified predictor — and treat any single small practice set as a
 * noisy sample of the real, much longer section.
 */
const SCALE_CONTROL_POINTS: [percent: number, scaledScore: number][] = [
  [0, 1],
  [10, 5],
  [20, 9],
  [30, 13],
  [40, 16],
  [50, 19],
  [60, 22],
  [70, 25],
  [80, 29],
  [90, 33],
  [95, 35],
  [100, 36],
]

export function estimateScaledScore(percentCorrect: number): number {
  const p = Math.max(0, Math.min(100, percentCorrect))
  for (let i = 0; i < SCALE_CONTROL_POINTS.length - 1; i++) {
    const [p0, s0] = SCALE_CONTROL_POINTS[i]
    const [p1, s1] = SCALE_CONTROL_POINTS[i + 1]
    if (p >= p0 && p <= p1) {
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0)
      return Math.round(s0 + t * (s1 - s0))
    }
  }
  return 36
}

export interface EstimatedScores {
  sectionScores: Partial<Record<Section, number>>
  compositeScore: number | null
  stemScore: number | null
  elaScore: number | null
}

export function estimateScores(sectionResults: SectionResult[]): EstimatedScores {
  const sectionScores: Partial<Record<Section, number>> = {}
  for (const r of sectionResults) {
    const pct = r.total > 0 ? (r.correctCount / r.total) * 100 : 0
    sectionScores[r.section] = estimateScaledScore(pct)
  }

  const hasAllComposite = COMPOSITE_SECTIONS.every((s) => sectionScores[s] !== undefined)
  const compositeScore = hasAllComposite
    ? Math.round(COMPOSITE_SECTIONS.reduce((sum, s) => sum + (sectionScores[s] ?? 0), 0) / COMPOSITE_SECTIONS.length)
    : null

  const stemScore =
    sectionScores.math !== undefined && sectionScores.science !== undefined
      ? Math.round((sectionScores.math + sectionScores.science) / 2)
      : null

  const elaScore =
    sectionScores.english !== undefined && sectionScores.reading !== undefined
      ? Math.round((sectionScores.english + sectionScores.reading) / 2)
      : null

  return { sectionScores, compositeScore, stemScore, elaScore }
}
