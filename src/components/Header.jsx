import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './Header.css'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock page scrolling while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close the menu if the window grows past the mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className={`header ${scrolled ? 'header-scrolled' : ''} ${menuOpen ? 'header-open' : ''}`}
    >
      <Link to="/home" className="header-logo" onClick={closeMenu}>ATELIER</Link>

      <button
        className="header-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
      </button>

      <div className={`header-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/portfolio" onClick={closeMenu}>Portfolio</Link>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#process" onClick={closeMenu}>Process</a>
        <a href="#testimonials" onClick={closeMenu}>Testimonials</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </div>
    </nav>
  )
}

export default Header