// Routing tools: Route defines a path, Routes holds them all, Navigate redirects
import { Route, Routes, Navigate } from 'react-router-dom'

// Shared shell (Header + Outlet) for pages that need the navbar
import MainLayout from './layouts/MainLayout'

// Every page component
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminSignup from './pages/AdminSignup'
import AdminWelcome from './pages/AdminWelcome'
import AdminSetupPin from './pages/AdminSetupPin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminForgotPassword from './pages/AdminForgotPassword'
import AdminResetPin from './pages/AdminResetPin'


const App = () => {
  return (
    <Routes>
      {/* Everything inside here gets the Header */}
<Route element={<MainLayout />}>

        {/* Visiting "/" sends you straight to "/home" */}
        <Route index element={<Navigate to="/home" />} />

        <Route path="/home" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
             <Route path="/contact" element={<Contact />} />
        
      </Route>

      {/* Outside Layout — no Header on these */}
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin" element={<AdminWelcome />} />
      <Route path="/admin/setup-pin" element={<AdminSetupPin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
<Route path="/admin/reset-pin-request" element={<AdminResetPin />} />
    </Routes>
  )
}

export default App