
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

import API_URL from '../api/apiConfig'
import './AdminSignup.css'

const AdminSignup = () => {
  const navigate = useNavigate()

  const [ownerExists, setOwnerExists] = useState(null)
  const [signupType, setSignupType] = useState(null)

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    age: '',
    address: '',
    phone: ''
  })

  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [emailError, setEmailError] = useState('')

  const [step, setStep] = useState('form')
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/admin/owner-exists`
        )

        setOwnerExists(response.data.ownerExists)
      } catch (error) {
        console.error('Failed to check owner status:', error)
        setErrorMsg(
          error.response?.data?.message ||
          'Unable to check Owner account status. Please refresh and try again.'
        )
      }
    }

    checkOwner()
  }, [])

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const getPasswordStrength = (password) => {
    let score = 0

    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    return score
  }

  const strengthScore = getPasswordStrength(formData.password)

  const strengthLabels = [
    '',
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    setEmailError('')
    setErrorMsg('')

    const normalizedEmail = formData.email.trim().toLowerCase()

    if (!validateEmail(normalizedEmail)) {
      setEmailError('Please enter a valid email address')
      return
    }

    if (!signupType) {
      setErrorMsg('Please select Owner or Admin')
      return
    }

    if (signupType === 'owner' && ownerExists) {
      setErrorMsg('An Owner account already exists')
      return
    }

    setSendingOtp(true)

    try {
      await axios.post(
        `${API_URL}/api/v1/admin/send-otp`,
        {
          email: normalizedEmail,
          purpose: 'signup',
          signupType
        }
      )

      setFormData((previous) => ({
        ...previous,
        email: normalizedEmail
      }))

      setStep('otp')
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
        'Failed to send verification code'
      )
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault()

    setOtpError('')
    setErrorMsg('')
    setStatus('submitting')

    const normalizedEmail = formData.email.trim().toLowerCase()

    try {
      await axios.post(
        `${API_URL}/api/v1/admin/verify-otp`,
        {
          email: normalizedEmail,
          code: otpCode,
          purpose: 'signup'
        }
      )

      const endpoint =
        signupType === 'owner'
          ? `${API_URL}/api/v1/admin/signup-owner`
          : `${API_URL}/api/v1/admin/signup-admin`

      await axios.post(endpoint, {
        ...formData,
        email: normalizedEmail
      })

      setStatus('success')

      localStorage.setItem(
        'pendingPinEmail',
        normalizedEmail
      )

      setTimeout(() => {
        navigate('/admin/setup-pin')
      }, 1200)
    } catch (error) {
      setStatus('error')

      const message =
        error.response?.data?.message ||
        'Verification failed. Please try again.'

      setOtpError(message)
    }
  }

  if (ownerExists === null) {
    return (
      <div className="admin-page-loading">
        Loading...
      </div>
    )
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
          Create account
        </h1>

        <p className="admin-subheading">
          Set up access to the Atelier admin workspace.
        </p>

        <div className="signup-toggle">
          <button
            type="button"
            className={signupType === 'owner' ? 'active' : ''}
            disabled={Boolean(ownerExists)}
            onClick={() => {
              setSignupType('owner')
              setErrorMsg('')
            }}
          >
            Owner
          </button>

          <button
            type="button"
            className={signupType === 'admin' ? 'active' : ''}
            onClick={() => {
              setSignupType('admin')
              setErrorMsg('')
            }}
          >
            Admin
          </button>
        </div>

        {ownerExists && signupType === 'owner' && (
          <p className="admin-msg">
            An Owner account already exists.
          </p>
        )}

        {(signupType === 'owner' && !ownerExists) ||
        signupType === 'admin' ? (
          step === 'form' ? (
            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >
              <div className="input-field">
                <User
                  size={16}
                  strokeWidth={1.5}
                  className="field-icon"
                />

                <input
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="field-icon"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {emailError && (
                <p className="admin-error">
                  {emailError}
                </p>
              )}

              {signupType === 'admin' && (
                <div className="input-field">
                  <input
                    name="role"
                    placeholder="Role (e.g. Social Media Manager)"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="input-field">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="field-icon"
                />

                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="field-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((previous) => !previous)}
                >
                  {showPassword ? (
                    <EyeOff
                      size={16}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Eye
                      size={16}
                      strokeWidth={1.5}
                    />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="strength-meter">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`strength-bar ${
                          i <= strengthScore ? 'filled' : ''
                        }`}
                      ></div>
                    ))}
                  </div>

                  <span className="strength-label">
                    {strengthLabels[strengthScore]}
                  </span>
                </div>
              )}

              <div className="input-row">
                <div className="input-field">
                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div className="input-field">
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-field">
                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="admin-submit"
                disabled={sendingOtp}
              >
                {sendingOtp ? 'Sending code...' : 'Continue'}
              </button>

              {errorMsg && (
                <p className="admin-error">
                  {errorMsg}
                </p>
              )}
            </form>
          ) : (
            <form
              className="admin-form"
              onSubmit={handleVerifyAndSignup}
            >
              <p className="admin-msg">
                We sent a code to {formData.email}
              </p>

              <div className="input-field">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)

                    setOtpCode(value)
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </div>

              {otpError && (
                <p className="admin-error">
                  {otpError}
                </p>
              )}

              <button
                type="submit"
                className="admin-submit"
                disabled={
                  status === 'submitting' ||
                  status === 'success' ||
                  otpCode.length !== 6
                }
              >
                {status === 'submitting'
                  ? 'Verifying...'
                  : status === 'success'
                    ? 'Account created'
                    : 'Verify & create account'}
              </button>

              {status === 'success' && (
                <p className="admin-success">
                  Account created — setting up your PIN...
                </p>
              )}

              {status === 'error' && (
                <button
                  type="button"
                  className="admin-return-link"
                  onClick={() => {
                    setStep('form')
                    setOtpCode('')
                    setOtpError('')
                    setStatus('idle')
                  }}
                >
                  Back to signup
                </button>
              )}
            </form>
          )
        ) : null}
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

export default AdminSignup
