import type { Section, SectionMeta } from '../types'

/**
 * Official ACT section timing/question counts, current format (effective Sept 2025).
 * Source: https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html
 * (fetched 2026-09-30). Science is an optional section under the current format and
 * is excluded from the Composite score — see `COMPOSITE_SECTIONS` below and
 * https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html
 */
export const SECTION_META: Record<Section, SectionMeta> = {
  english: { section: 'english', label: 'English', officialQuestionCount: 50, officialMinutes: 35 },
  math: { section: 'math', label: 'Math', officialQuestionCount: 45, officialMinutes: 50 },
  reading: { section: 'reading', label: 'Reading', officialQuestionCount: 36, officialMinutes: 40 },
  science: { section: 'science', label: 'Science', officialQuestionCount: 40, officialMinutes: 40 },
}

export const SECTION_ORDER: Section[] = ['english', 'math', 'reading', 'science']

/** Sections that count toward the Composite score under the current ACT format. */
export const COMPOSITE_SECTIONS: Section[] = ['english', 'math', 'reading']

export function secondsPerQuestion(section: Section): number {
  const meta = SECTION_META[section]
  return Math.round((meta.officialMinutes * 60) / meta.officialQuestionCount)
}
