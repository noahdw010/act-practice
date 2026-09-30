import { getQuestions, secondsPerQuestion, SECTION_ORDER } from '../data'
import type { Mode, Question, Section } from '../types'

export interface QuizBlock {
  section: Section
  questions: Question[]
  timeBudgetSec: number | null
}

export interface QuizPlan {
  mode: Mode
  blocks: QuizBlock[]
}

function buildBlock(section: Section, mode: Mode): QuizBlock {
  const questions = getQuestions(section)
  const timeBudgetSec =
    mode === 'practice' ? null : Math.round(questions.length * secondsPerQuestion(section))
  return { section, questions, timeBudgetSec }
}

export function buildQuizPlan(mode: Mode, sections: Section[]): QuizPlan {
  if (mode === 'full') {
    return { mode, blocks: SECTION_ORDER.map((s) => buildBlock(s, mode)) }
  }
  return { mode, blocks: sections.map((s) => buildBlock(s, mode)) }
}

export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(clamped / 60)
  const s = clamped % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
