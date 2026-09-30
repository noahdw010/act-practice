import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { QuestionView } from '../components/QuestionView'
import { Timer } from '../components/Timer'
import { SECTION_META } from '../data'

export function QuizPage() {
  const { plan, currentBlock, remainingSec, completedAttempt, abandonQuiz } = useQuiz()
  const navigate = useNavigate()

  useEffect(() => {
    if (completedAttempt) {
      navigate('/results')
    }
  }, [completedAttempt, navigate])

  useEffect(() => {
    if (!plan && !completedAttempt) {
      navigate('/')
    }
  }, [plan, completedAttempt, navigate])

  if (!plan || !currentBlock) return null

  const blockNumber = plan.blocks.findIndex((b) => b.section === currentBlock.section) + 1

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {plan.mode === 'full' ? `Section ${blockNumber} of ${plan.blocks.length}` : 'Practice session'}
          </div>
          <h1 className="text-xl font-bold text-slate-900">{SECTION_META[currentBlock.section].label}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Timer remainingSec={remainingSec} />
          <button
            onClick={() => {
              abandonQuiz()
              navigate('/')
            }}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700"
          >
            Quit
          </button>
        </div>
      </div>

      <QuestionView />
    </div>
  )
}
