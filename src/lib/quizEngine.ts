import { getQuestions, secondsPerQuestion, SECTION_ORDER } from '../data'
import type { DifficultyFilter, Mode, Question, Section } from '../types'

export interface QuizBlock {
  section: Section
  questions: Question[]
  timeBudgetSec: number | null
}

export interface QuizPlan {
  mode: Mode
  blocks: QuizBlock[]
}

export interface BuildQuizOptions {
  /** Restrict to one difficulty tier, or 'mixed' for the full, unfiltered bank. Ignored for 'full' mode (always mixed, like the real test). */
  difficulty?: DifficultyFilter
  /** Restrict to specific skill tags (used for "focus practice" on weak skills). Ignored for 'full' mode. */
  skills?: string[]
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Randomizes question order so the same session isn't memorizable question-to-question.
 * Passage-based questions (Reading/Science) are grouped by passage first, then the
 * passage order and each passage's internal question order are shuffled — this avoids
 * bouncing between three different passages every single question, matching how the
 * real ACT keeps a passage's questions together too. Standalone questions (English/Math)
 * get a plain full shuffle.
 */
function shuffleQuestions(questions: Question[]): Question[] {
  const hasPassages = questions.some((q) => q.passageId)
  if (!hasPassages) return shuffle(questions)

  const groupOrder: string[] = []
  const groups = new Map<string, Question[]>()
  for (const q of questions) {
    const key = q.passageId ?? `__standalone__${q.id}`
    if (!groups.has(key)) {
      groups.set(key, [])
      groupOrder.push(key)
    }
    groups.get(key)!.push(q)
  }

  return shuffle(groupOrder).flatMap((key) => shuffle(groups.get(key)!))
}

function buildBlock(section: Section, mode: Mode, options?: BuildQuizOptions): QuizBlock {
  let questions = getQuestions(section)

  if (mode !== 'full') {
    if (options?.skills && options.skills.length > 0) {
      const filtered = questions.filter((q) => options.skills!.includes(q.skill))
      if (filtered.length > 0) questions = filtered
    } else if (options?.difficulty && options.difficulty !== 'mixed') {
      const filtered = questions.filter((q) => q.difficulty === options.difficulty)
      if (filtered.length > 0) questions = filtered
    }
  }

  questions = shuffleQuestions(questions)

  const timeBudgetSec =
    mode === 'practice' ? null : Math.round(questions.length * secondsPerQuestion(section))
  return { section, questions, timeBudgetSec }
}

export function buildQuizPlan(mode: Mode, sections: Section[], options?: BuildQuizOptions): QuizPlan {
  if (mode === 'full') {
    return { mode, blocks: SECTION_ORDER.map((s) => buildBlock(s, mode)) }
  }
  return { mode, blocks: sections.map((s) => buildBlock(s, mode, options)) }
}

export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(clamped / 60)
  const s = clamped % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
