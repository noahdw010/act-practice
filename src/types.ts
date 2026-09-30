export type Section = 'english' | 'math' | 'reading' | 'science'

export type Mode = 'practice' | 'timed' | 'full'

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
  explanation: string
  skill: string
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
}
