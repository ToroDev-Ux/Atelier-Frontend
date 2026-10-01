import { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Send } from 'lucide-react'
import './ContactForm.css'

// A unique key for where we store this specific form's data in localStorage
const STORAGE_KEY = 'atelier_contact_draft'

const ContactForm = () => {

  // Tries to load any previously saved draft, falls back to empty values if none exists
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', message: '' }
    } catch (error) {
      return { name: '', email: '', phone: '', message: '' }
    }
  }

  const formik = useFormik({
    initialValues: getSavedDraft(),

    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),

      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),

      phone: Yup.string()
        .matches(/^[0-9+\-\s()]*$/, 'Phone number can only contain numbers'),

      message: Yup.string()
        .required('Message is required')
        .min(10, 'Message must be at least 10 characters'),
    }),

    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        await axios.post('http://localhost:5000/api/v1/contact', values)

        localStorage.removeItem(STORAGE_KEY)

        // Explicitly pass the blank values we want to reset TO
        resetForm({
          values: { name: '', email: '', phone: '', message: '' }
        })

        setStatus('success')
      } catch (error) {
        console.log('Failed to submit form:', error)
        setStatus('error')
      }
    }
  })

  // Every time any field changes, save the current values to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formik.values))
  }, [formik.values])

  return (
    <form className="contact-form" onSubmit={formik.handleSubmit}>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="field-error">{formik.errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="field-error">{formik.errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone && (
          <span className="field-error">{formik.errors.phone}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="3"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
        {formik.touched.message && formik.errors.message && (
          <span className="field-error">{formik.errors.message}</span>
        )}
      </div>

      <button type="submit" className="contact-submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Sending...' : 'Subscribe'}
        <Send size={16} strokeWidth={1.5} />
      </button>

      {formik.status === 'success' && (
        <p className="form-feedback success">Thank you for Subscribing — we'll be in touch soon.</p>
      )}
      {formik.status === 'error' && (
        <p className="form-feedback error">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}

export default ContactForm