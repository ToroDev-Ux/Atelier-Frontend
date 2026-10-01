import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useScrollReveal from '../hooks/useScrollReveal'
import PortfolioCard from '../components/PortfolioCard'
import './Portfolio.css'

const Portfolio = () => {
  const sceneRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const titleRef = useRef(null)

  const [headerRef, headerVisible] = useScrollReveal()

  useEffect(() => {
    gsap.fromTo(
      titleRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
    )
  }, [])

  const handleMouseMove = (e) => {
    const bounds = sceneRef.current.getBoundingClientRect()
    const x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2

    gsap.to(imageRef.current, {
      rotateY: x * 12,
      rotateX: -y * 12,
      duration: 0.6,
      ease: 'power2.out'
    })

    gsap.to(overlayRef.current, {
      background: `radial-gradient(circle at ${50 + x * 30}% ${50 + y * 30}%, rgba(216,90,48,0.25), transparent 60%)`,
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' })
    gsap.to(overlayRef.current, { background: 'transparent', duration: 0.8 })
  }

  return (
    <div className="portfolio-page">

      <section
        className="portfolio-hero"
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="portfolio-hero-stage">
          <img
            ref={imageRef}
            className="portfolio-hero-image"
            src="https://i.pinimg.com/736x/9e/a7/9e/9ea79e2e989664cd11e65e059f2a5874.jpg"
            alt="Featured interior"
          />
          <div ref={overlayRef} className="portfolio-hero-overlay"></div>

          <button className="hero-hotspot" style={{ top: '30%', left: '62%' }}>
            <span className="hotspot-dot">+</span>
            <span className="hotspot-label">Chair</span>
          </button>
          <button className="hero-hotspot" style={{ top: '58%', left: '38%' }}>
            <span className="hotspot-dot">+</span>
            <span className="hotspot-label">Table</span>
          </button>
        </div>

        <div className="portfolio-hero-text" ref={titleRef}>
          <span className="hero-eyebrow">Selected Works</span>
          <h1 className="hero-heading">Interiors, considered</h1>
          <p className="hero-description">
            A collection of sixteen residential, kitchen, and bath projects, each designed around lifestyle, function, and individuality.          </p>
        </div>
      </section>

      <div
        ref={headerRef}
        className={`portfolio-page-header reveal ${headerVisible ? 'visible' : ''}`}
      >
        <span className="section-label">Selected Works</span>
        <h2 className="section-title">Portfolio</h2>
      </div>

      <div className="portfolio-page-grid">
        <PortfolioCard
          image="https://i.pinimg.com/1200x/54/d8/bf/54d8bfc068a381a39cf3f5cc2780b8df.jpg"
          title="Modern Sanctuary"
          year="2024"
          category="Residential"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/28/a5/03/28a50349a1f58785a445d8e845f0c030.jpg"
          title="Serene Retreat"
          year="2024"
          category="Master Suite"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/c0/ce/f2/c0cef27b22ef6e7fa7493bad1bc9f9a1.jpg"
          title="Culinary Canvas"
          year="2025"
          category="Kitchen Design"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/a8/39/84/a839842c6ecb4b3fe38bdfb32c78540a.jpg"
          title="Elegant Dining"
          year="2025"
          category="Dining Room"
        />
        <PortfolioCard
          image="https://i.pinimg.com/736x/99/ad/d6/99add6659e93fda95d2a30506a6ee5cc.jpg"
          title="Entryway Elegance"
          year="2026"
          category="Ante Room"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/ba/03/ca/ba03ca93a1f1eb0dc0167f0d22bac2de.jpg"
          title="Spa Sanctuary"
          year="2026"
          category="Bathroom"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/45/50/e2/4550e282e72bd92df206a5491ab3cbac.jpg"
          title="Wabi Sabi Haven"
          year="2026"
          category="Living Room"
        />
        <PortfolioCard
          image="https://i.pinimg.com/736x/57/c1/e0/57c1e0dc50c1de5ff962b9ddf64a5e72.jpg"
          title="Sculptural wood curves"
          year="2026"
          category="Mirror"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/9e/a5/b3/9ea5b3a982073a5fff27c2c2df3aca31.jpg"
          title="Zen Minimalism"
          year="2026"
          category="Living Room"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/59/5a/7d/595a7d332e838d1ea63c12dce3832649.jpg"
          title="Tv Console"
          year="2026"
          category="Living Room"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/57/af/ca/57afca9b3ebe88743a1d7a75875958b0.jpg"
          title="Italian minimalism"
          year="2026"
          category="Bathroom"
        />
        <PortfolioCard
          image="https://i.pinimg.com/1200x/8d/0d/28/8d0d281ddc2bc0beca4a0c8a734b4074.jpg"
          title="Wabi Sabi Haven"
          year="2026"
          category="Dining Room"
        />
      </div>

    </div>
  )
}

export default Portfolio