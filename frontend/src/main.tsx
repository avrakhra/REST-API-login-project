import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import Register from './Register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Register />
  </StrictMode>,
)
