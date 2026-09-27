import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import DynamicPage from './pages/DynamicPage.jsx'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<DynamicPage />} />
      </Routes>
    </Router>
  )
}

export default App
