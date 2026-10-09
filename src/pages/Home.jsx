// Home.jsx

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import PortfolioCard from '../components/PortfolioCard'
import useScrollReveal from '../hooks/useScrollReveal'
import API_URL from '../api/apiConfig'
import './Home.css'
import { Lightbulb, Compass, PenTool, Sparkles } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import ProcessStep from '../components/ProcessStep'
import TestimonialCard from '../components/TestimonialCard'
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import ContactForm from '../components/ContactForm'
import fallbackHero from '../assets/images/hero-fallback.jpg'

const Home = () => {
  // Local fallback shows immediately
  const [heroImage, setHeroImage] = useState(fallbackHero)

  // Tracks whether we've already started fetching,
  // to block StrictMode's duplicate call
  const hasFetched = useRef(false)

  // Watches the portfolio header
  const [headerRef, headerVisible] = useScrollReveal()

  // Watches the services header
  const [servicesHeaderRef, servicesHeaderVisible] = useScrollReveal()

  // Watches the process header
  const [processHeaderRef, processHeaderVisible] = useScrollReveal()

  // Watches the testimonials header
  const [testimonialsHeaderRef, testimonialsHeaderVisible] = useScrollReveal()

  // Watches the contact section
  const [contactHeaderRef, contactHeaderVisible] = useScrollReveal()

  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      quote:
        "Atelier transformed our house into a home that truly reflects who we are. Every detail was considered with such care.",
      name: "Sarah Johnson",
      project: "Private Client"
    },
    {
      quote:
        "Working with this team was seamless from start to finish. The final result exceeded everything we imagined.",
      name: "Michael Chen",
      project: "Business Owner"
    },
    {
      quote:
        "Their eye for detail and understanding of our lifestyle made all the difference. Truly exceptional work.",
      name: "Emma Martinez",
      project: "Homeowner"
    }
  ]

  const nextTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev + 1) % testimonials.length
    )
  }

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  useEffect(() => {
    // If this has already run once, skip the second StrictMode call
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchHeroImage = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/hero-images`)

        const images = response.data

        // Make sure the API actually returned images
        if (!images || images.length === 0) {
          console.log('No hero images found. Using fallback image.')
          return
        }

        const randomIndex = Math.floor(Math.random() * images.length)
        const chosenUrl = images[randomIndex].imageUrl

        // Preload the fetched image first
        const preload = new Image()
        preload.src = chosenUrl

        preload.onload = () => {
          // Swap only after the real image has completely loaded
          setHeroImage(chosenUrl)
        }

        preload.onerror = () => {
          // Keep the local fallback if the fetched image fails
          console.log('Hero image failed to load. Using fallback image.')
        }
      } catch (error) {
        // Keep showing the local fallback
        console.log('Using fallback image:', error)
      }
    }

    fetchHeroImage()
  }, [])

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section
        className="hero hero-loaded"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Curating Spaces, Crafting Stories
          </h1>

          <p className="hero-subtitle">
            Timeless interiors that reflect your vision and elevate
            everyday living
          </p>

          <button className="hero-button">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* ==================== PORTFOLIO ==================== */}
      <section className="portfolio-preview">
        <div
          ref={headerRef}
          className={`portfolio-preview-header reveal ${headerVisible ? 'visible' : ''
            }`}
        >
          <span className="section-label">
            Selected Works
          </span>

          <Link
            to="/portfolio"
            className="section-title-link"
          >
            <h2 className="section-title">
              Portfolio
            </h2>
          </Link>
        </div>

        <div className="portfolio-preview-grid">
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
        </div>

        <Link
          to="/portfolio"
          className="view-all-link"
        >
          View Full Portfolio →
        </Link>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section
        className="services-preview"
        id="services"
      >
        <div
          ref={servicesHeaderRef}
          className={`services-preview-header reveal ${servicesHeaderVisible ? 'visible' : ''
            }`}
        >
          <span className="section-labelb">
            What We Do
          </span>

          <h2 className="section-titleb">
            Services
          </h2>

          <p className="section-description">
            We specialize in creating interiors that are both
            beautiful and functional, tailored to your lifestyle
            and infused with timeless elegance.
          </p>
        </div>

        <div className="services-preview-grid">
          <ServiceCard
            icon={<Lightbulb strokeWidth={1.5} />}
            title="Concept Development"
            description="Translating your vision into a cohesive design narrative that captures your unique style and functional needs."
          />

          <ServiceCard
            icon={<Compass strokeWidth={1.5} />}
            title="Space Planning"
            description="Thoughtful spatial design that maximizes flow, comfort, and aesthetic harmony throughout your environment."
          />

          <ServiceCard
            icon={<PenTool strokeWidth={1.5} />}
            title="Interior Styling"
            description="Curating furnishings, textures, and finishes to create timeless, layered interiors with character."
          />

          <ServiceCard
            icon={<Sparkles strokeWidth={1.5} />}
            title="Full Renovation"
            description="End-to-end project management from concept to completion, ensuring seamless execution of your dream space."
          />
        </div>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section
        className="process-preview"
        id="process"
      >
        <div
          ref={processHeaderRef}
          className={`process-preview-header reveal ${processHeaderVisible ? 'visible' : ''
            }`}
        >
          <span className="section-labelc">
            How We Work
          </span>

          <h2 className="section-titlec">
            Our Process
          </h2>
        </div>

        <div className="process-preview-steps">
          <ProcessStep
            number="01"
            title="Discovery"
            description="We begin with an in-depth consultation to understand your vision, lifestyle, and aspirations for the space."
          />

          <ProcessStep
            number="02"
            title="Concept Design"
            description="Our team develops initial concepts, mood boards, and spatial plans that bring your vision to life."
          />

          <ProcessStep
            number="03"
            title="Development"
            description="We refine every detail—from material selections to custom furnishings—ensuring coherence and quality."
          />

          <ProcessStep
            number="04"
            title="Realization"
            description="With meticulous oversight, we bring the design to completion, delivering a space that exceeds expectations."
          />
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section
        className="testimonials-preview"
        id="testimonials"
      >
        <div
          ref={testimonialsHeaderRef}
          className={`testimonials-preview-header reveal ${testimonialsHeaderVisible ? 'visible' : ''
            }`}
        >
          <span className="section-label-dark">
            Client Stories
          </span>

          <h2 className="section-title-dark">
            Testimonials
          </h2>
        </div>

        <div className="testimonial-carousel">
          <button
            className="carousel-arrow"
            onClick={prevTestimonial}
          >
            <ChevronLeft strokeWidth={1.5} />
          </button>

          <TestimonialCard
            quote={testimonials[activeTestimonial].quote}
            name={testimonials[activeTestimonial].name}
            project={testimonials[activeTestimonial].project}
          />

          <button
            className="carousel-arrow"
            onClick={nextTestimonial}
          >
            <ChevronRight strokeWidth={1.5} />
          </button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeTestimonial ? 'active' : ''
                }`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section
        className="contact-preview"
        id="contact"
      >
        <div className="contact-grid">

          <div
            ref={contactHeaderRef}
            className={`contact-info reveal ${contactHeaderVisible ? 'visible' : ''
              }`}
          >
            <span className="section-label">
              Get in Touch
            </span>

            <h2 className="contact-title">
              Let's Create Something Beautiful
            </h2>

            <p className="contact-description">
              Ready to transform your space? Reach out to schedule
              a consultation and discover how we can bring your
              vision to life.
            </p>

            <div className="contact-details">

              <div className="contact-detail-item">
                <Mail
                  size={18}
                  strokeWidth={1.5}
                />

                <div>
                  <span className="detail-label">
                    Email
                  </span>

                  <span className="detail-value">
                    hello@atelier-studio.com
                  </span>
                </div>
              </div>

              <div className="contact-detail-item">
                <Phone
                  size={18}
                  strokeWidth={1.5}
                />

                <div>
                  <span className="detail-label">
                    Phone
                  </span>

                  <span className="detail-value">
                    +1 (555) 123-4567
                  </span>
                </div>
              </div>

              <div className="contact-detail-item">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                />

                <div>
                  <span className="detail-label">
                    Studio
                  </span>

                  <span className="detail-value">
                    New York, NY
                  </span>
                </div>
              </div>

            </div>
          </div>

          <ContactForm />

        </div>
      </section>
    </>
  )
}

export default Home