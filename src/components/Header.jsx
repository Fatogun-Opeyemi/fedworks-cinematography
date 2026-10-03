import React from 'react'

export default function Header({
  activeSection,
  onOpenInquiry,
  onToggleSanity,
  sanityConnected,
}) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="top-bar-header">
      <div className="site-container">
        <div className="top-bar-inner">
          {/* Zone 1: Single text element wordmark with muted oxblood dot */}
          <a href="#" className="brand-wordmark" aria-label="Fedworks Studio Home">
            FEDWORKx
            <span className="brand-dot" aria-hidden="true" />
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="nav-links-zone" aria-label="Main Navigation">
            <button
              onClick={() => scrollTo('works')}
              className={`nav-link-item ${activeSection === 'works' ? 'active' : ''}`}
            >
              Selected Works
            </button>
            <button
              onClick={() => scrollTo('discipline')}
              className={`nav-link-item ${activeSection === 'discipline' ? 'active' : ''}`}
            >
              Discipline
            </button>
            <button
              onClick={() => scrollTo('monographs')}
              className={`nav-link-item ${activeSection === 'monographs' ? 'active' : ''}`}
            >
              Monographs
            </button>
            <button
              onClick={() => scrollTo('studio')}
              className={`nav-link-item ${activeSection === 'studio' ? 'active' : ''}`}
            >
              Studio
            </button>
            <button
              onClick={onToggleSanity}
              className={`nav-link-item ${activeSection === 'sanity' ? 'active' : ''}`}
            >
              Sanity CMS
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="top-bar-actions">
            <button
              onClick={onToggleSanity}
              className="btn-cms-badge"
              title="Open Sanity CMS Data & Schema Inspector"
              aria-label="Sanity CMS Connection Status"
            >
              <span
                className={`cms-status-indicator ${sanityConnected ? 'connected' : ''}`}
              />
              <span>Sanity Studio</span>
            </button>

            <button
              onClick={onOpenInquiry}
              className="btn-inquire-primary"
            >
              Inquire
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
