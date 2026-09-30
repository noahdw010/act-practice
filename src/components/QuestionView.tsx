import { useQuiz } from '../context/QuizContext'
import { PassagePane } from './PassagePane'

export function QuestionView() {
  const { currentQuestion, currentBlock, selectedIndex, showFeedback, selectAnswer, nextQuestion, plan, questionIndex } =
    useQuiz()

  if (!currentQuestion || !currentBlock || !plan) return null

  const isLast = questionIndex === currentBlock.questions.length - 1
  const hasPassage = Boolean(currentQuestion.passageId)
  const isPracticeMode = plan.mode === 'practice'

  return (
    <div className={`grid gap-6 ${hasPassage ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
      {hasPassage && (
        <div className="md:h-[28rem]">
          <PassagePane passageId={currentQuestion.passageId} />
        </div>
      )}

      <div className="flex flex-col">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{currentQuestion.skill}</div>
        <p className="mb-5 text-lg text-slate-100">{currentQuestion.prompt}</p>

        <div className="flex flex-col gap-3">
          {currentQuestion.choices.map((choice, idx) => {
            const isSelected = selectedIndex === idx
            const isCorrectChoice = idx === currentQuestion.answerIndex
            let stateClasses = 'border-slate-600 hover:border-slate-400 hover:bg-slate-800'

            if (showFeedback) {
              if (isCorrectChoice) {
                stateClasses = 'border-green-500 bg-green-950 text-green-100'
              } else if (isSelected && !isCorrectChoice) {
                stateClasses = 'border-red-500 bg-red-950 text-red-100'
              } else {
                stateClasses = 'border-slate-700 opacity-60'
              }
            } else if (isSelected) {
              stateClasses = 'border-blue-500 bg-blue-950 text-blue-100'
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
                  ? 'border-green-800 bg-green-950/40 text-green-100'
                  : 'border-red-800 bg-red-950/40 text-red-100'
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
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 text-sm text-slate-300">
              <p className="mb-1 font-semibold text-slate-100">
                Why {String.fromCharCode(65 + currentQuestion.answerIndex)} is correct
              </p>
              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Question {questionIndex + 1} of {currentBlock.questions.length}
          </span>
          <button
            onClick={nextQuestion}
            disabled={selectedIndex === null}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
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
