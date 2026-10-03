import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MenuOverlay from './MenuOverlay.jsx'

export default function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Class determination based on route and scroll state
  let navClass = 'site-nav'
  if (isHome) {
    navClass += isScrolled ? ' nav-scrolled' : ' nav-transparent'
  } else {
    navClass += isScrolled ? ' nav-solid-light nav-scrolled' : ' nav-solid-light'
  }

  return (
    <>
      <header className={navClass}>
        <div className="site-container">
          <div className="site-nav-inner">
            <Link
              to="/"
              className="nav-brand"
              aria-label="FEDWORKS — Cinematography Home"
            >
              FEDWORKS
              <span className="nav-brand-dot" aria-hidden="true" />
            </Link>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="nav-menu-btn"
              aria-label="Open main navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span>MENU</span>
              <div className="nav-menu-icon" aria-hidden="true">
                <span className="nav-menu-line" />
                <span className="nav-menu-line" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  )
}
