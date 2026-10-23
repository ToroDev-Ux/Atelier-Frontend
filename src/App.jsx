import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'

import AdminWelcome from './pages/AdminWelcome'
import AdminSignup from './pages/AdminSignup'
import AdminSetupPin from './pages/AdminSetupPin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminForgotPassword from './pages/AdminForgotPassword'
import AdminResetPin from './pages/AdminResetPin'

import {
  ProtectedAdminRoute,
  GuestAdminRoute,
  PinSetupRoute,
} from './components/AdminGuards'

const App = () => {
  return (
    <Routes>
      {/* Public site, with Header and Footer */}
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />

        {/* Old removed pages send visitors home instead of a 404 */}
        <Route path="/services" element={<Navigate to="/home" replace />} />
        <Route path="/process" element={<Navigate to="/home" replace />} />
        <Route path="/testimonials" element={<Navigate to="/home" replace />} />
        <Route path="/contact" element={<Navigate to="/home" replace />} />
      </Route>

      {/* Admin: only for visitors who are logged out */}
      <Route element={<GuestAdminRoute />}>
        <Route path="/admin" element={<AdminWelcome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
      </Route>

      {/* Admin: recovery pages stay open */}
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-pin-request" element={<AdminResetPin />} />

      {/* Admin: only while a signup is waiting for its PIN */}
      <Route element={<PinSetupRoute />}>
        <Route path="/admin/setup-pin" element={<AdminSetupPin />} />
      </Route>

      {/* Admin: only for logged-in admins */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Any unknown admin URL goes to /admin */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      {/* Everything else shows the animated 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App