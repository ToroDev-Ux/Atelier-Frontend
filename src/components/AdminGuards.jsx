import { Navigate, Outlet } from 'react-router-dom'
import { getValidToken } from '../utils/adminAuth'

// Only for logged-in admins
export const ProtectedAdminRoute = () =>
  getValidToken() ? <Outlet /> : <Navigate to="/admin/login" replace />

// Only for visitors who are NOT logged in (welcome, login, signup)
export const GuestAdminRoute = () =>
  getValidToken() ? <Navigate to="/admin/dashboard" replace /> : <Outlet />

// Only while a signup is waiting for its PIN
export const PinSetupRoute = () =>
  localStorage.getItem('pendingPinEmail')
    ? <Outlet />
    : <Navigate to="/admin/signup" replace />