import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AdminSetupPin.css'

const AdminSetupPin = () => {
  const navigate = useNavigate()
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [stage, setStage] = useState('enter') // enter | confirm
  const [error, setError] = useState('')

  const handleDigitChange = (value, index, type) => {
    if (!/^[0-9]?$/.test(value)) return

    const setter = type === 'enter' ? setPin : setConfirmPin
    const current = type === 'enter' ? [...pin] : [...confirmPin]
    current[index] = value
    setter(current)

    if (value && index < 3) {
      document.getElementById(`${type}-${index + 1}`)?.focus()
    }
  }

  const goToConfirm = () => {
    if (pin.join('').length === 4) {
      setStage('confirm')
      setError('')
    }
  }

  const handleConfirm = async () => {
    if (pin.join('') !== confirmPin.join('')) {
      setError('PINs do not match. Try again.')
      setConfirmPin(['', '', '', ''])
      return
    }

    try {
      const email = localStorage.getItem('pendingPinEmail')
      await axios.post('http://localhost:5000/api/v1/admin/setup-pin', {
        email,
        pin: pin.join('')
      })

      localStorage.removeItem('pendingPinEmail')
      navigate('/admin/login')
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="pin-setup-page">
      <div className="pin-setup-card">
        <p className="pin-logo">ATELIER</p>
        <div className="pin-line"></div>

        {stage === 'enter' ? (
          <>
            <h2 className="pin-heading">Set your PIN</h2>
            <p className="pin-subtext">This secures your account for every future sign in.</p>
            <div className="pin-boxes">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  id={`enter-${i}`}
                  className="pin-box"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(e.target.value, i, 'enter')}
                />
              ))}
            </div>
            <button className="pin-submit" onClick={goToConfirm}>Continue</button>
          </>
        ) : (
          <>
            <h2 className="pin-heading">Confirm your PIN</h2>
            <p className="pin-subtext">Enter the same PIN again to verify.</p>
            <div className="pin-boxes">
              {confirmPin.map((digit, i) => (
                <input
                  key={i}
                  id={`confirm-${i}`}
                  className="pin-box"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(e.target.value, i, 'confirm')}
                />
              ))}
            </div>
            {error && <p className="pin-error">{error}</p>}
            <button className="pin-submit" onClick={handleConfirm}>Confirm PIN</button>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminSetupPin