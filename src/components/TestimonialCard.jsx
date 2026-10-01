import './TestimonialCard.css'
import { Quote } from 'lucide-react'


// Reusable card — takes a quote, client name, and project as props
const TestimonialCard = ({ quote, name, project }) => {
    return (
        <div className="testimonial-card">
            <Quote className="testimonial-quote-icon" strokeWidth={1} />

            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <span className="testimonial-name">{name}</span>
                <span className="testimonial-project">{project}</span>
            </div>
        </div>
    )
}

export default TestimonialCard