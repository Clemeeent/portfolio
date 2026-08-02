import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Note: browser scroll restoration is deliberately left alone. Every position
// in the works deck is a pure function of scrollY, so landing mid-pin on reload
// renders correctly with no catch-up — there is nothing to protect against, and
// overriding it would take away behaviour the browser gives the user for free.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
