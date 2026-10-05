import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// import Navbar from './components/Navbar.jsx'
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from './pages/HomePage.jsx'
import DynamicPage from './pages/DynamicPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import AdminPages from './pages/admin/AdminPages.jsx'
import AdminPageCreate from './pages/admin/AdminPageCreate.jsx'
import AdminPageEdit from './pages/admin/AdminPageEdit.jsx'
import AdminPageVisualEditor from './pages/admin/AdminPageVisualEditor.jsx'
import AdminHome from './pages/admin/AdminHome.jsx'
import AdminNavigation from './pages/admin/AdminNavigation.jsx'
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {

  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:slug" element={<DynamicPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/new" element={<AdminPageCreate />} />
          <Route path="pages/:id" element={<AdminPageEdit />} />
          <Route path="pages/:id/visual" element={<AdminPageVisualEditor />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="navigation" element={<AdminNavigation />} />
        </Route>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/pages/new" element={<AdminPageCreate />} />
        <Route path="/admin/pages/:id" element={<AdminPageEdit />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/navigation" element={<AdminNavigation />} /> */}
      </Routes>
    </Router>
  )
}

export default App
