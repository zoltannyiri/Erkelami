import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import DynamicPage from './pages/DynamicPage.jsx'
import AdminPages from './pages/admin/AdminPages.jsx'
import AdminPageCreate from './pages/admin/AdminPageCreate.jsx'
import AdminPageEdit from './pages/admin/AdminPageEdit.jsx'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/pages/new" element={<AdminPageCreate />} />
        <Route path="/admin/pages/:id" element={<AdminPageEdit />} />
      </Routes>
    </Router>
  )
}

export default App
