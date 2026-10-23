
import { Navigate, Outlet } from 'react-router-dom'
import { getValidToken } from '../utils/adminAuth'

// Protect admin pages from visitors without a valid token.
export const ProtectedAdminRoute = () =>
  getValidToken()
    ? <Outlet />
    : <Navigate to="/admin/login" replace />

// Keep logged-in admins away from login and signup pages.
export const GuestAdminRoute = () =>
  getValidToken()
    ? <Navigate to="/admin/dashboard" replace />
    : <Outlet />

// Allow PIN setup only during a pending signup.
export const PinSetupRoute = () =>
  localStorage.getItem('pendingPinEmail')
    ? <Outlet />
    : <Navigate to="/admin/signup" replace />
