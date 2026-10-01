import useScrollReveal from '../hooks/useScrollReveal'
import './ServiceCard.css'

// Reusable card — takes an icon, title, and description as props
const ServiceCard = ({ icon, title, description }) => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`service-card reveal ${isVisible ? 'visible' : ''}`}
    >
      <div className="service-card-icon">{icon}</div>
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-description">{description}</p>
    </div>
  )
}

export default ServiceCard