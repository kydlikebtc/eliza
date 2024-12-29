import { Routes, Route } from 'react-router-dom'
import AgentConfigPage from './pages/AgentConfigPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AgentConfigPage />} />
    </Routes>
  )
}
