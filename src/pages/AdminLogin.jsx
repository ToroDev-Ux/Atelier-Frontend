import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Mail } from 'lucide-react'
import './AdminLogin.css'

const cookies = new Cookies()

const AdminLogin = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState('pin')
  const [pin, setPin] = useState(['', '', '', ''])
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recognizedInfo, setRecognizedInfo] = useState(null)

  const handleCheckEmail = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/admin/check-email',
        { email }
      )

      setRecognizedInfo(response.data)
      setStep('method')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handlePinChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return

    const updated = [...pin]
    updated[index] = value
    setPin(updated)

    if (value && index < 3) {
      document.getElementById(`login-pin-${index + 1}`)?.focus()
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = method === 'pin'
        ? 'http://localhost:5000/api/v1/admin/login-pin'
        : 'http://localhost:5000/api/v1/admin/login-password'

      const payload = method === 'pin'
        ? { email, pin: pin.join('') }
        : { email, password }

      const response = await axios.post(endpoint, payload)

      cookies.set('adminToken', response.data.token, {
        path: '/',
        maxAge: 86400
      })

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-split-page">

      <div className="admin-form-panel">

        <a
          href="/admin"
          className="admin-return-link"
        >
          &larr; Return to admin
        </a>

        <p className="admin-logo">
          ATELIER
        </p>

        <div className="admin-label-row">
          <span className="admin-line"></span>
          <span className="admin-label">
            Admin Portal
          </span>
        </div>

        <h1 className="admin-heading">
          Sign in
        </h1>

        {step === 'email' && (

          <form
            className="admin-form"
            onSubmit={handleCheckEmail}
          >

            <div className="input-field">

              <Mail
                size={16}
                strokeWidth={1.5}
                className="field-icon"
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            {error && (
              <p className="admin-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="admin-submit"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>

          </form>

        )}

        {step === 'method' && (

          <form
            className="admin-form"
            onSubmit={handleLogin}
          >

            <div className="input-field static-field">

              <Mail
                size={16}
                strokeWidth={1.5}
                className="field-icon"
              />

              <span>
                {email}
              </span>

            </div>

            {recognizedInfo && (

              <div className="recognized-badge">
                Welcome back,{' '}
                {recognizedInfo.isOwner
                  ? 'Owner'
                  : recognizedInfo.role}
              </div>

            )}

            <div className="signup-toggle">

              <button
                type="button"
                className={method === 'pin' ? 'active' : ''}
                onClick={() => setMethod('pin')}
              >
                PIN
              </button>

              <button
                type="button"
                className={method === 'password' ? 'active' : ''}
                onClick={() => setMethod('password')}
              >
                Password
              </button>

            </div>

            <div className="login-help-links">

              <span
                onClick={() => navigate('/admin/forgot-password')}
              >
                Forgot password?
              </span>

              <span
                onClick={() => navigate('/admin/reset-pin-request')}
              >
                Reset PIN
              </span>

            </div>

            {method === 'pin' ? (

              <div className="pin-boxes">

                {pin.map((digit, i) => (

                  <input
                    key={i}
                    id={`login-pin-${i}`}
                    className="pin-box-light"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handlePinChange(
                        e.target.value,
                        i
                      )
                    }
                  />

                ))}

              </div>

            ) : (

              <div className="input-field">

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            )}

            {error && (
              <p className="admin-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="admin-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

        )}

      </div>

      <div
        className="admin-photo-panel"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/1200x/9b/c1/e9/9bc1e94d169caebaea5b433c87f12d69.jpg)'
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

export default AdminLogin