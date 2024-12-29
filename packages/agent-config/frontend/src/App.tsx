import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from './components/ui/toast'
import { AppRoutes } from './router'

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  )
}

export default App
