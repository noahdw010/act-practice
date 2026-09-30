import type { Section } from '../types'

/**
 * Official ACT content domains (reporting categories) and their published weight
 * ranges, sourced directly from ACT.org — not derived from real test items.
 *
 * Sources (fetched 2026-09-30):
 * - https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html
 * - https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html
 */
export interface ContentDomain {
  id: string
  label: string
  /** Published percentage-of-section weight range, e.g. [38, 43] for 38-43%. */
  weightRange: [number, number]
}

export const CONTENT_DOMAINS: Record<Section, ContentDomain[]> = {
  english: [
    { id: 'production-of-writing', label: 'Production of Writing', weightRange: [38, 43] },
    { id: 'knowledge-of-language', label: 'Knowledge of Language', weightRange: [18, 23] },
    { id: 'conventions-of-standard-english', label: 'Conventions of Standard English', weightRange: [38, 43] },
  ],
  math: [
    { id: 'preparing-for-higher-math', label: 'Preparing for Higher Math', weightRange: [80, 80] },
    { id: 'integrating-essential-skills', label: 'Integrating Essential Skills', weightRange: [20, 20] },
  ],
  reading: [
    { id: 'key-ideas-and-details', label: 'Key Ideas and Details', weightRange: [44, 52] },
    { id: 'craft-and-structure', label: 'Craft and Structure', weightRange: [26, 33] },
    { id: 'integration-of-knowledge-and-ideas', label: 'Integration of Knowledge and Ideas', weightRange: [19, 26] },
  ],
  science: [
    { id: 'interpretation-of-data', label: 'Interpretation of Data', weightRange: [38, 50] },
    { id: 'scientific-investigation', label: 'Scientific Investigation', weightRange: [18, 32] },
    { id: 'evaluating-arguments-models', label: 'Evaluating Scientific Arguments and Models', weightRange: [25, 35] },
  ],
}

export const CONTENT_SOURCES = [
  {
    label: 'ACT Exam Sections & Structure',
    url: 'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html',
  },
  {
    label: 'Understanding Your ACT Scores',
    url: 'https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html',
  },
]
