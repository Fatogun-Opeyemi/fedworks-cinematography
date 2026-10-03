import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="editorial-page-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="site-container">
        <div style={{ maxWidth: '600px' }}>
          <div className="section-kicker">
            <span className="section-kicker-dot" aria-hidden="true" />
            <span>404 · Unallocated Route</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: '0.5rem 0 1.5rem' }}>
            Frame not found.
          </h1>
          <p className="editorial-body-text" style={{ fontSize: '1rem' }}>
            The requested location does not exist in the cinematography archive.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn-primary-action">
              Return to Index
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
