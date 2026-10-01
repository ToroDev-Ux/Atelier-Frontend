import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <Link to="/home" className="header-logo">ATELIER</Link>

      <div className="header-links">
        <Link to="/portfolio">Portfolio</Link>
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  )
}

export default Header