import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import { getSiteSettings } from '../lib/sanity/queries.js'

export default function Mentoring() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    let mounted = true
    getSiteSettings().then(data => {
      if (mounted) setSettings(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const programs = [
    {
      title: 'SHADOW A SHOOT',
      lead: 'Active Set Observation',
      description: 'Physical on-set shadowing for emerging camera assistants and operators during narrative and commercial productions. Exposure to camera department protocol, lens swaps, monitor calibration, and lighting department coordination.',
    },
    {
      title: 'MENTORSHIP',
      lead: 'Craft & Reel Consultation',
      description: 'One-on-one portfolio critiques, treatment reviews, and technical discussions covering exposure theory, light meter discipline, contrast ratios, and optical characteristics of spherical versus anamorphic glass.',
    },
    {
      title: 'PRODUCTION GUIDANCE',
      lead: 'Director Collaboration',
      description: 'Methods for articulating visual tone, creating lighting diagrams, testing look-up tables (LUTs), and navigating the artistic dialogue between cinematographer, director, and production designer.',
    },
  ]

  return (
    <div className="editorial-page-section" style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
      <div className="site-container">
        <SectionHeader
          kicker="Education & Camera Craft"
          title={settings?.mentoringHeading || 'Shadow a shoot. Practical set craft.'}
          subtitle={settings?.mentoringBody || 'Practical on-set shadowing and craft discussions for emerging cinematographers.'}
        />

        <div className="editorial-split" style={{ marginTop: '3.5rem' }}>
          <div>
            <Reveal>
              <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 600, lineHeight: 1.2, marginBottom: '1.5rem' }}>
                Direct physical presence. Learning by observing motivated light.
              </h3>
              <p className="editorial-body-text">
                The nuances of camera operating, set politics, and reacting to changing natural light cannot be learned
                through screen recordings. We believe in providing access to active working sets for those committed
                to the craft.
              </p>
            </Reveal>

            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/contact" className="btn-primary-action">
                Inquire Regarding Shadowing →
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {programs.map((prog, idx) => (
              <Reveal key={prog.title} delay={idx * 0.08}>
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-red)', marginBottom: '0.35rem' }}>
                    {prog.title}
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-black)' }}>
                    {prog.lead}
                  </h4>
                  <p style={{ fontSize: '0.875rem', fontWeight: 300, lineHeight: 1.6, color: 'rgba(10, 10, 10, 0.7)' }}>
                    {prog.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
