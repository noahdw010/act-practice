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
