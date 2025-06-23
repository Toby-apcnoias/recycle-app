import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CoinsProvider } from './hooks/useCoins.jsx'
import AuthGate from './components/AuthGate'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CoinsProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/recycle" element={
                <AuthGate>
                  <Dashboard />
                </AuthGate>
              } />
              <Route path="/history" element={
                <AuthGate>
                  <History />
                </AuthGate>
              } />
              <Route path="/" element={
                <AuthGate>
                  <Dashboard />
                </AuthGate>
              } />
            </Routes>
          </div>
        </Router>
      </CoinsProvider>
    </QueryClientProvider>
  )
}

export default App 