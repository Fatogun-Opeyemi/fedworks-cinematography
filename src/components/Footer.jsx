import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="minimal-cinematic-footer">
      <div className="site-container">
        <div className="minimal-footer-inner">
          {/* Identity */}
          <div className="minimal-footer-brand">
            <Link to="/" className="minimal-footer-title">
              FEDWORKS
            </Link>
            <div className="minimal-footer-subtitle">
              DIRECTOR OF PHOTOGRAPHY
            </div>
          </div>

          {/* Direct Inquiry Link */}
          <div className="minimal-footer-action">
            <Link to="/contact" className="minimal-footer-contact-link">
              Contact / Inquiry →
            </Link>
          </div>

          {/* Copyright */}
          <div className="minimal-footer-copy tabular-nums">
            © {new Date().getFullYear()} FEDWORKS
          </div>
        </div>
      </div>
    </footer>
  )
}
