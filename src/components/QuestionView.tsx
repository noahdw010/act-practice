import { useQuiz } from '../context/QuizContext'
import { PassagePane } from './PassagePane'

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  hard: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function QuestionView() {
  const {
    currentQuestion,
    currentBlock,
    selectedIndex,
    showFeedback,
    selectAnswer,
    nextQuestion,
    plan,
    questionIndex,
    flaggedIds,
    toggleFlag,
  } = useQuiz()

  if (!currentQuestion || !currentBlock || !plan) return null

  const isLast = questionIndex === currentBlock.questions.length - 1
  const hasPassage = Boolean(currentQuestion.passageId)
  const isPracticeMode = plan.mode === 'practice'
  const isFlagged = flaggedIds.has(currentQuestion.id)

  return (
    <div className={`grid gap-6 ${hasPassage ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
      {hasPassage && (
        <div className="md:h-[28rem]">
          <PassagePane passageId={currentQuestion.passageId} />
        </div>
      )}

      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{currentQuestion.skill}</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${DIFFICULTY_STYLES[currentQuestion.difficulty]}`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>
          <button
            onClick={toggleFlag}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              isFlagged
                ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span aria-hidden="true">{isFlagged ? '🚩' : '⚑'}</span>
            {isFlagged ? 'Flagged for review' : 'Mark for review'}
          </button>
        </div>
        <p className="mb-5 text-lg text-slate-900">{currentQuestion.prompt}</p>

        <div className="flex flex-col gap-3">
          {currentQuestion.choices.map((choice, idx) => {
            const isSelected = selectedIndex === idx
            const isCorrectChoice = idx === currentQuestion.answerIndex
            let stateClasses = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'

            if (showFeedback) {
              if (isCorrectChoice) {
                stateClasses = 'border-green-400 bg-green-50 text-green-900'
              } else if (isSelected && !isCorrectChoice) {
                stateClasses = 'border-red-400 bg-red-50 text-red-900'
              } else {
                stateClasses = 'border-slate-200 bg-white opacity-60'
              }
            } else if (isSelected) {
              stateClasses = 'border-blue-500 bg-blue-50 text-blue-900'
            }

            return (
              <button
                key={idx}
                onClick={() => !showFeedback && selectAnswer(idx)}
                disabled={showFeedback}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${stateClasses}`}
              >
                <span className="mr-2 font-semibold">{String.fromCharCode(65 + idx)}.</span>
                {choice}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className="mt-4 flex flex-col gap-3">
            <div
              className={`rounded-lg border p-4 text-sm ${
                selectedIndex === currentQuestion.answerIndex
                  ? 'border-green-300 bg-green-50 text-green-900'
                  : 'border-red-300 bg-red-50 text-red-900'
              }`}
            >
              <p className="mb-1 font-semibold">
                {selectedIndex === currentQuestion.answerIndex ? 'Correct!' : 'Not quite.'}
              </p>
              {selectedIndex !== null &&
                selectedIndex !== currentQuestion.answerIndex &&
                currentQuestion.distractorRationale?.[selectedIndex] && (
                  <p>
                    Why {String.fromCharCode(65 + selectedIndex)} is wrong:{' '}
                    {currentQuestion.distractorRationale[selectedIndex]}
                  </p>
                )}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="mb-1 font-semibold text-slate-900">
                Why {String.fromCharCode(65 + currentQuestion.answerIndex)} is correct
              </p>
              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Question {questionIndex + 1} of {currentBlock.questions.length}
            {isFlagged && <span className="ml-2 text-amber-600">🚩 flagged</span>}
          </span>
          <button
            onClick={nextQuestion}
            disabled={selectedIndex === null}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? 'Finish section' : 'Next question'}
          </button>
        </div>

        {isPracticeMode && !showFeedback && (
          <p className="mt-2 text-xs text-slate-500">Select an answer to see instant feedback.</p>
        )}
      </div>
    </div>
  )
}
