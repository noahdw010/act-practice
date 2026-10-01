export type Section = 'english' | 'math' | 'reading' | 'science'

export type Mode = 'practice' | 'timed' | 'full'

export type Difficulty = 'easy' | 'medium' | 'hard'

/** Which difficulty tier(s) a session pulls questions from. 'mixed' uses the full bank, unfiltered (realistic ACT spread). */
export type DifficultyFilter = 'easy' | 'medium' | 'hard' | 'mixed'

export interface DataTable {
  headers: string[]
  rows: string[][]
}

export interface Passage {
  id: string
  title: string
  text: string
  table?: DataTable
}

export interface Question {
  id: string
  section: Section
  passageId?: string
  prompt: string
  choices: string[]
  answerIndex: number
  /** Core explanation of the underlying rule/concept and why the correct choice satisfies it. */
  explanation: string
  /** Per-choice notes (indexed like `choices`) explaining specifically why that wrong choice is a trap. */
  distractorRationale?: Partial<Record<number, string>>
  skill: string
  /** Official ACT content-domain id this question is aligned to. See `src/data/contentDomains.ts`. */
  domain: string
  difficulty: Difficulty
}

export interface SectionMeta {
  section: Section
  label: string
  officialQuestionCount: number
  officialMinutes: number
}

export interface AnsweredQuestion {
  question: Question
  selectedIndex: number | null
  correct: boolean
  timeSpentSec: number
  /** Whether the test-taker marked this question for review during the quiz. */
  flagged: boolean
}

export interface SectionResult {
  section: Section
  answered: AnsweredQuestion[]
  correctCount: number
  total: number
}

export interface AttemptRecord {
  id: string
  date: string
  mode: Mode
  sections: Section[]
  sectionResults: SectionResult[]
  correctCount: number
  total: number
  percentage: number
  totalTimeSpentSec: number
  /** Estimated 1-36 ACT scaled score per section included in this attempt. See `src/lib/scoreEstimate.ts`. */
  sectionScores: Partial<Record<Section, number>>
  /** Average of English/Math/Reading scaled scores, rounded — Science is excluded per current ACT composite rules. Null unless all three are present. */
  compositeScore: number | null
  /** Supplemental STEM score: average of Math + Science scaled scores. Null unless both present. */
  stemScore: number | null
  /** Supplemental ELA score: average of English + Reading scaled scores (no Writing test in this app). Null unless both present. */
  elaScore: number | null
}
