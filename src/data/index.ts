import type { Passage, Question, Section } from '../types'
import { englishQuestions } from './questions/english'
import { mathQuestions } from './questions/math'
import { readingQuestions } from './questions/reading'
import { scienceQuestions } from './questions/science'
import { readingPassages } from './passages/reading'
import { sciencePassages } from './passages/science'

export const QUESTIONS_BY_SECTION: Record<Section, Question[]> = {
  english: englishQuestions,
  math: mathQuestions,
  reading: readingQuestions,
  science: scienceQuestions,
}

export const PASSAGES_BY_ID: Record<string, Passage> = Object.fromEntries(
  [...readingPassages, ...sciencePassages].map((p) => [p.id, p]),
)

export function getQuestions(section: Section): Question[] {
  return QUESTIONS_BY_SECTION[section]
}

export function getPassage(passageId: string | undefined): Passage | undefined {
  if (!passageId) return undefined
  return PASSAGES_BY_ID[passageId]
}

export { SECTION_META, SECTION_ORDER, secondsPerQuestion } from './sectionMeta'
