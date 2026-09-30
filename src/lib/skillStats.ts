import type { AttemptRecord, Section } from '../types'

export interface SkillStat {
  skill: string
  section: Section
  domain: string
  attempts: number
  correct: number
  accuracy: number
  lastSeen: string
}

/** Below this many answered questions, an accuracy% is too noisy to act on. */
export const MIN_ATTEMPTS_FOR_SIGNAL = 3

/**
 * Aggregates every answered question across all saved attempts, grouped by skill tag,
 * so weak/strong areas show up regardless of which session they were answered in.
 * Unanswered (timed-out) questions are excluded — they reflect pacing, not knowledge.
 */
export function computeSkillStats(attempts: AttemptRecord[]): SkillStat[] {
  const map = new Map<string, SkillStat>()

  for (const attempt of attempts) {
    for (const sectionResult of attempt.sectionResults) {
      for (const a of sectionResult.answered) {
        if (a.selectedIndex === null) continue

        const key = a.question.skill
        const existing = map.get(key)
        if (existing) {
          existing.attempts += 1
          if (a.correct) existing.correct += 1
          if (attempt.date > existing.lastSeen) existing.lastSeen = attempt.date
        } else {
          map.set(key, {
            skill: key,
            section: a.question.section,
            domain: a.question.domain,
            attempts: 1,
            correct: a.correct ? 1 : 0,
            accuracy: 0,
            lastSeen: attempt.date,
          })
        }
      }
    }
  }

  return Array.from(map.values())
    .map((s) => ({ ...s, accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy)
}
