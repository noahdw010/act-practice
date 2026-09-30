import { HashRouter, Routes, Route } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import { ResultsPage } from './pages/ResultsPage'
import { HistoryPage } from './pages/HistoryPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <QuizProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </HashRouter>
      </QuizProvider>
    </div>
  )
}

export default App
