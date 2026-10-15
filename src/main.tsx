import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import SmoothScroll from './components/SmoothScroll'
// global tokens first, so component styles can override them
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LazyMotion features={domAnimation} strict>
        {/* entrance animations are skipped for people who prefer reduced motion */}
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <App />
          </SmoothScroll>
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  </React.StrictMode>,
)
