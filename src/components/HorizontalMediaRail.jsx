import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'

export default function HorizontalMediaRail({ items, title = 'Selected Stills' }) {
  if (!items || items.length === 0) return null

  return (
    <section className="horizontal-media-rail">
      <div className="site-container">
        <Reveal>
          <div className="section-kicker">
            <span className="section-kicker-dot" aria-hidden="true" />
            <span>Archive</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {title}
          </h3>
        </Reveal>

        <div className="rail-scroll-container">
          {items.map((item, idx) => (
            <div key={idx} className="rail-item">
              <Link to={item.slug ? `/work/${item.slug.current}` : '#'}>
                <div className="rail-media-holder">
                  <img
                    src={item.poster || item.src}
                    alt={item.title || `Rail item ${idx + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="rail-media-img"
                  />
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-black)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(10, 10, 10, 0.6)' }}>
                  {item.categoryLabel || item.year}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
