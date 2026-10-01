import useScrollReveal from '../hooks/useScrollReveal'
import './ProcessStep.css'

// Reusable step — takes a number, title, and description as props
const ProcessStep = ({ number, title, description }) => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`process-step reveal ${isVisible ? 'visible' : ''}`}
    >
      <span className="process-step-number">{number}</span>
      <div className="process-step-content">
        <h3 className="process-step-title">{title}</h3>
        <p className="process-step-description">{description}</p>
      </div>
    </div>
  )
}

export default ProcessStep