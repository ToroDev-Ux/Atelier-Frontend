// Lets React catch common mistakes during development
import { StrictMode } from 'react'

// Mounts React onto the actual browser page
import { createRoot } from 'react-dom/client'

// Enables routing for the whole app
import { BrowserRouter } from 'react-router-dom'

// Our route map
import App from './App.jsx'

// Global styles
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)