import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api/apiConfig'
import './AdminSignup.css'

const AdminForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post(`${API_URL}/api/v1/admin/send-otp`, {
        email,
        purpose: 'password-reset'
      })
      setStep('reset')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post(`${API_URL}/api/v1/admin/reset-password`, {
        email,
        code,
        newPassword
      })
      navigate('/admin/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-split-page">
      <div className="admin-form-panel">
        <a href="/admin/login" className="admin-return-link">&larr; Back to login</a>

        <p className="admin-logo">ATELIER</p>

        <h1 className="admin-heading">Reset password</h1>

        {step === 'email' ? (
          <form className="admin-form" onSubmit={handleSendOtp}>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" className="admin-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send code'}
            </button>
          </form>
        ) : (
          <form className="admin-form" onSubmit={handleReset}>
            <div className="input-field">
              <input
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <div className="input-field">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" className="admin-submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>

      <div
        className="admin-photo-panel"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/736x/99/fe/20/99fe20a0475c5a37223f992dea68624c.jpg)'
        }}
      >
        <p className="admin-quote">
          "Where sophistication
          <br />
          meets intention."
        </p>
      </div>
    </div>
  )
}

export default AdminForgotPassword