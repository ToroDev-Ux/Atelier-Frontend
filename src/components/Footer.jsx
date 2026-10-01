import useScrollReveal from '../hooks/useScrollReveal'
import './Footer.css'

const Footer = () => {

  // Each piece gets its own independent scroll watcher
  const [brandRef, brandVisible] = useScrollReveal()
  const [studioRef, studioVisible] = useScrollReveal()
  const [connectRef, connectVisible] = useScrollReveal()
  const [bottomRef, bottomVisible] = useScrollReveal()

  return (
    <footer className="footer">
      <div className="footer-main">

        <div
          ref={brandRef}
          className={`footer-brand reveal ${brandVisible ? 'visible' : ''}`}
        >
          <h3 className="footer-logo">ATELIER</h3>
          <p className="footer-description">
            Creating timeless interiors that reflect your vision and elevate everyday living. Where sophistication meets comfort.
          </p>
        </div>

        <div
          ref={studioRef}
          className={`footer-column reveal ${studioVisible ? 'visible' : ''}`}
        >
          <span className="footer-column-title">Studio</span>
          <a href="/">About</a>
          <a href="/portfolio">Portfolio</a>
          <a href="">Services</a>
          <a href="">Contact</a>
        </div>

        <div
          ref={connectRef}
          className={`footer-column reveal ${connectVisible ? 'visible' : ''}`}
        >
          <span className="footer-column-title">Connect</span>
          <a href="" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="" target="_blank" rel="noopener noreferrer">Pinterest</a>
          <a href="" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="" target="_blank" rel="noopener noreferrer">Houzz</a>
        </div>

      </div>

      <div
        ref={bottomRef}
        className={`footer-bottom reveal ${bottomVisible ? 'visible' : ''}`}
      >
        <span>© 2026 Atelier Studio. All rights reserved.</span>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer