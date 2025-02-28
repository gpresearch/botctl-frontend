import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UnifiedUI from './UnifiedUI.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnifiedUI/>
  </StrictMode>,
)
