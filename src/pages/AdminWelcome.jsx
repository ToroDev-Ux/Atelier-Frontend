import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import './AdminWelcome.css'

const AdminWelcome = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const wordRef = useRef(null)
  const barRef = useRef(null)
  const loaderRef = useRef(null)
  const contentRef = useRef(null)

  // Generates a few random dot positions once, so they don't reshuffle on re-render
  const dots = useRef(
    Array.from({ length: 12 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 6,
    }))
  ).current

  useEffect(() => {
    const tl = gsap.timeline()

    tl.to(wordRef.current, {
      opacity: 1,
      letterSpacing: '4px',
      duration: 1,
      ease: 'power2.out'
    })
      .to(barRef.current, {
        width: '80px',
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .to(loaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.inOut',
        delay: 0.5,
        onComplete: () => setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      )
    }
  }, [loading])

  return (
    <div className="admin-welcome-page">

      <div className="ambient-dots">
        {dots.map((dot, i) => (
          <span
            key={i}
            className="ambient-dot"
            style={{
              top: `${dot.top}%`,
              left: `${dot.left}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          ></span>
        ))}
      </div>

      {loading && (
        <div className="admin-loader" ref={loaderRef}>
          <p ref={wordRef} className="loader-word">ATELIER</p>
          <div ref={barRef} className="loader-bar"></div>
        </div>
      )}

      {!loading && (
        <div className="admin-welcome-content" ref={contentRef}>
          <p className="welcome-logo">ATELIER</p>
          <span className="welcome-label">Admin Portal</span>

          <h1 className="welcome-heading">Welcome</h1>
          <p className="welcome-subtext">Manage your studio workspace with ease.</p>

          <button className="welcome-primary-btn" onClick={() => navigate('/admin/signup')}>
            Get started
          </button>

          <p className="welcome-secondary">
            Already have an account?{' '}
            <span className="welcome-link" onClick={() => navigate('/admin/login')}>Sign in</span>
          </p>
        </div>
      )}

      <p className="admin-footer">Atelier Studio &copy; 2026</p>

    </div>
  )
}

export default AdminWelcome