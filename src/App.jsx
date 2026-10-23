
import { Route, Routes, Navigate } from 'react-router-dom'

// Shared layout
import MainLayout from './layouts/MainLayout'

// Public pages
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Admin pages
import AdminSignup from './pages/AdminSignup'
import AdminWelcome from './pages/AdminWelcome'
import AdminSetupPin from './pages/AdminSetupPin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminForgotPassword from './pages/AdminForgotPassword'
import AdminResetPin from './pages/AdminResetPin'

// Admin route guards
import {
  ProtectedAdminRoute,
  GuestAdminRoute,
  PinSetupRoute,
} from './components/AdminGuards'

const App = () => {
  return (
    <Routes>
      {/* Public pages with the main navbar */}
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin welcome, login and signup pages: guests only */}
      <Route element={<GuestAdminRoute />}>
        <Route path="/admin" element={<AdminWelcome />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* PIN setup: requires a pending signup */}
      <Route element={<PinSetupRoute />}>
        <Route path="/admin/setup-pin" element={<AdminSetupPin />} />
      </Route>

      {/* Protected admin pages */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route
          path="/admin/reset-pin-request"
          element={<AdminResetPin />}
        />
      </Route>

      {/* Regular user authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
