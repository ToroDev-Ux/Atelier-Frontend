import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './NotFound.css'

const SECONDS = 8

const NotFound = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [left, setLeft] = useState(SECONDS)

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (left <= 0) navigate('/home', { replace: true })
  }, [left, navigate])

  return (
    <div className="nf-page">
      <svg
        className="nf-plan"
        viewBox="0 0 400 260"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path className="draw d1" pathLength="1" d="M40 40 H360 V220 H40 Z" />
        <path className="draw d2" pathLength="1" d="M40 140 H140 V220" />
        <path className="draw d3" pathLength="1" d="M250 220 V180 M250 180 A40 40 0 0 1 290 220" />
        <path className="draw d4 gold" pathLength="1" d="M215 66 H335 V104 H215 Z M215 76 H335" />
        <circle className="draw d5 gold" pathLength="1" cx="275" cy="148" r="16" />
        <path className="draw d6 gold" pathLength="1" d="M60 160 H120 V206 H60 Z" />
      </svg>

      <p className="nf-code">404</p>
      <p className="nf-eyebrow">Page not found</p>
      <h1 className="nf-heading">This room hasn't been built yet</h1>
      <p className="nf-path">{pathname}</p>

      <div className="nf-progress">
        <span style={{ animationDuration: `${SECONDS}s` }}></span>
      </div>

      <p className="nf-countdown">Taking you home in {Math.max(left, 0)}s</p>

      <button className="nf-button" onClick={() => navigate('/home', { replace: true })}>
        Go home now
      </button>
    </div>
  )
}

export default NotFound