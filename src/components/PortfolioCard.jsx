import useScrollReveal from '../hooks/useScrollReveal'
import './PortfolioCard.css'

// Reusable card — takes an image, title, year, and category as props
const PortfolioCard = ({ image, title, year, category }) => {

  // ref attaches to the actual DOM element below;
  // isVisible becomes true once that element scrolls into view
  const [ref, isVisible] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`portfolio-card reveal ${isVisible ? 'visible' : ''}`}
    >
      <img src={image} alt={title} className="portfolio-card-image" />

      <div className="portfolio-card-info">
        <h3 className="portfolio-card-title">{title}</h3>
        <span className="portfolio-card-year">{year}</span>
      </div>

      <p className="portfolio-card-category">{category}</p>
    </div>
  )
}

export default PortfolioCard