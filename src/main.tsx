import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UnifiedUI from './UnifiedUI.tsx'

const devMode = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      {
          devMode ? (
              <UnifiedUI />
          ) : (
              <App />
          )
      }
  </StrictMode>,
)
