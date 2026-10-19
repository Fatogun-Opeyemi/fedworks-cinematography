import React from 'react'
import Reveal from './Reveal.jsx'

export default function SectionHeader({ kicker, title, subtitle, className = '' }) {
  return (
    <header className={`section-header ${className}`}>
      {title && (
        <Reveal delay={0.06}>
          <h2 className="section-title">{title}</h2>
        </Reveal>
      )}

      {/* {subtitle && (
        <Reveal delay={0.12}>
          <p className="section-subtitle">{subtitle}</p>
        </Reveal>
      )} */}
    </header>
  )
}
