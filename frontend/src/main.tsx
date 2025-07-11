import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import ForgotPassword from './ForgotPassword'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ForgotPassword />
  </StrictMode>,
)
