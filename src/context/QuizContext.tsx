import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { buildQuizPlan } from '../lib/quizEngine'
import type { QuizBlock } from '../lib/quizEngine'
import { saveAttempt } from '../lib/storage'
import type { AnsweredQuestion, AttemptRecord, Mode, Section, SectionResult } from '../types'

interface QuizState {
  plan: { mode: Mode; blocks: QuizBlock[] } | null
  blockIndex: number
  questionIndex: number
  blockAnswers: AnsweredQuestion[]
  allSectionResults: SectionResult[]
  selectedIndex: number | null
  showFeedback: boolean
  remainingSec: number | null
  completedAttempt: AttemptRecord | null
}

interface QuizContextValue extends QuizState {
  currentBlock: QuizBlock | null
  currentQuestion: QuizBlock['questions'][number] | null
  startQuiz: (mode: Mode, sections: Section[]) => void
  selectAnswer: (index: number) => void
  nextQuestion: () => void
  abandonQuiz: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

const initialState: QuizState = {
  plan: null,
  blockIndex: 0,
  questionIndex: 0,
  blockAnswers: [],
  allSectionResults: [],
  selectedIndex: null,
  showFeedback: false,
  remainingSec: null,
  completedAttempt: null,
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(initialState)
  const questionStartRef = useRef<number>(Date.now())

  const currentBlock = state.plan ? state.plan.blocks[state.blockIndex] ?? null : null
  const currentQuestion = currentBlock ? currentBlock.questions[state.questionIndex] ?? null : null

  const startQuiz = useCallback((mode: Mode, sections: Section[]) => {
    const plan = buildQuizPlan(mode, sections)
    const firstBlock = plan.blocks[0]
    questionStartRef.current = Date.now()
    setState({
      ...initialState,
      plan,
      remainingSec: firstBlock?.timeBudgetSec ?? null,
    })
  }, [])

  const finalizeSectionResult = useCallback(
    (block: QuizBlock, answers: AnsweredQuestion[]): SectionResult => {
      const filled: AnsweredQuestion[] = block.questions.map((q) => {
        const existing = answers.find((a) => a.question.id === q.id)
        if (existing) return existing
        return { question: q, selectedIndex: null, correct: false, timeSpentSec: 0 }
      })
      return {
        section: block.section,
        answered: filled,
        correctCount: filled.filter((a) => a.correct).length,
        total: filled.length,
      }
    },
    [],
  )

  const finishQuiz = useCallback(
    (finalSectionResults: SectionResult[]) => {
      setState((prev) => {
        if (!prev.plan) return prev
        const correctCount = finalSectionResults.reduce((sum, r) => sum + r.correctCount, 0)
        const total = finalSectionResults.reduce((sum, r) => sum + r.total, 0)
        const totalTimeSpentSec = finalSectionResults.reduce(
          (sum, r) => sum + r.answered.reduce((s, a) => s + a.timeSpentSec, 0),
          0,
        )
        const attempt: AttemptRecord = {
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          mode: prev.plan.mode,
          sections: finalSectionResults.map((r) => r.section),
          sectionResults: finalSectionResults,
          correctCount,
          total,
          percentage: total > 0 ? Math.round((correctCount / total) * 100) : 0,
          totalTimeSpentSec,
        }
        saveAttempt(attempt)
        return {
          ...initialState,
          completedAttempt: attempt,
        }
      })
    },
    [],
  )

  const advanceBlock = useCallback(() => {
    setState((prev) => {
      if (!prev.plan || !currentBlock) return prev
      const sectionResult = finalizeSectionResult(currentBlock, prev.blockAnswers)
      const nextSectionResults = [...prev.allSectionResults, sectionResult]
      const nextBlockIndex = prev.blockIndex + 1
      const nextBlock = prev.plan.blocks[nextBlockIndex]

      if (!nextBlock) {
        // handled by finishQuiz below (needs latest state)
        return { ...prev, allSectionResults: nextSectionResults, blockIndex: nextBlockIndex }
      }

      questionStartRef.current = Date.now()
      return {
        ...prev,
        allSectionResults: nextSectionResults,
        blockIndex: nextBlockIndex,
        questionIndex: 0,
        blockAnswers: [],
        selectedIndex: null,
        showFeedback: false,
        remainingSec: nextBlock.timeBudgetSec,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBlock, finalizeSectionResult])

  // Finish the quiz once we've advanced past the last block.
  useEffect(() => {
    if (state.plan && currentBlock === null && state.blockIndex > 0 && !state.completedAttempt) {
      finishQuiz(state.allSectionResults)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.blockIndex, state.plan, currentBlock])

  const selectAnswer = useCallback((index: number) => {
    setState((prev) => {
      if (!currentQuestion) return prev
      const correct = index === currentQuestion.answerIndex
      const timeSpentSec = Math.max(0, Math.round((Date.now() - questionStartRef.current) / 1000))
      const answered: AnsweredQuestion = { question: currentQuestion, selectedIndex: index, correct, timeSpentSec }
      const withoutExisting = prev.blockAnswers.filter((a) => a.question.id !== currentQuestion.id)
      return {
        ...prev,
        selectedIndex: index,
        showFeedback: prev.plan?.mode === 'practice',
        blockAnswers: [...withoutExisting, answered],
      }
    })
  }, [currentQuestion])

  const nextQuestion = useCallback(() => {
    if (!currentBlock) return
    const isLastInBlock = state.questionIndex >= currentBlock.questions.length - 1
    if (isLastInBlock) {
      advanceBlock()
      return
    }
    questionStartRef.current = Date.now()
    setState((prev) => ({
      ...prev,
      questionIndex: prev.questionIndex + 1,
      selectedIndex: null,
      showFeedback: false,
    }))
  }, [currentBlock, state.questionIndex, advanceBlock])

  const abandonQuiz = useCallback(() => {
    setState(initialState)
  }, [])

  // Countdown timer for timed / full modes.
  useEffect(() => {
    if (state.remainingSec === null || !state.plan) return
    if (state.remainingSec <= 0) {
      advanceBlock()
      return
    }
    const t = setTimeout(() => {
      setState((prev) => (prev.remainingSec === null ? prev : { ...prev, remainingSec: prev.remainingSec - 1 }))
    }, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.remainingSec, state.plan])

  const value = useMemo<QuizContextValue>(
    () => ({
      ...state,
      currentBlock,
      currentQuestion,
      startQuiz,
      selectAnswer,
      nextQuestion,
      abandonQuiz,
    }),
    [state, currentBlock, currentQuestion, startQuiz, selectAnswer, nextQuestion, abandonQuiz],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider')
  return ctx
}
