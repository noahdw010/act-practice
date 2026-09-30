import type { Section, SectionMeta } from '../types'

// Official ACT timing/question counts (classic 4-section format).
export const SECTION_META: Record<Section, SectionMeta> = {
  english: { section: 'english', label: 'English', officialQuestionCount: 75, officialMinutes: 45 },
  math: { section: 'math', label: 'Math', officialQuestionCount: 60, officialMinutes: 60 },
  reading: { section: 'reading', label: 'Reading', officialQuestionCount: 40, officialMinutes: 35 },
  science: { section: 'science', label: 'Science', officialQuestionCount: 40, officialMinutes: 35 },
}

export const SECTION_ORDER: Section[] = ['english', 'math', 'reading', 'science']

export function secondsPerQuestion(section: Section): number {
  const meta = SECTION_META[section]
  return Math.round((meta.officialMinutes * 60) / meta.officialQuestionCount)
}
