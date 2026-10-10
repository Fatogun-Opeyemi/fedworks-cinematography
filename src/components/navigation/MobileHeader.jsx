import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MenuOverlay from '../MenuOverlay.jsx'

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <header className={`mobile-header ${isHome ? 'mobile-header-home' : ''}`}>
        <div className="mobile-header-inner">
          <Link
            to="/"
            className="mobile-header-brand"
            aria-label="FEDWORKS — Home"
          >
            Chukwuka Edeogu
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="mobile-hamburger-btn"
            aria-label="Open mobile navigation menu"
            aria-expanded={isMenuOpen}
          >
            {/* <span className="mobile-hamburger-text"></span> */}
            <span className="mobile-hamburger-icon" aria-hidden="true">
              <span className="mobile-hamburger-line" />
              <span className="mobile-hamburger-line" />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  )
}
