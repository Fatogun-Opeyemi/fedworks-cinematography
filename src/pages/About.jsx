import React, { useEffect, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { getSiteSettings } from '../lib/sanity/queries.js'
import "./About.css"

export default function About() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    let mounted = true

    getSiteSettings()
      .then((data) => {
        if (mounted) setSettings(data)
      })
      .catch(() => {
        if (mounted) setSettings(null)
      })

    return () => {
      mounted = false
    }
  }, [])

  const contactEmail = settings?.contactEmail

  return (
    <main className="about-page">
      <div className="about-container">

        {/* HERO */}
        <section className="about-hero">
          <Reveal>
            <div className="about-portrait">
              {settings?.aboutImage ? (
                <img
                  src={settings.aboutImage}
                  alt="Chukwuka Edeogu"
                />
              ) : (
                <div className="about-portrait-placeholder">
                  Portrait
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div className="about-intro">
              <div className="about-eyebrow">
                <span />
                About FedWorks
              </div>

              <h1>
                Chukwuka
                <br />
                Edeogu
              </h1>

              <p className="about-role">
                Director of Photography
              </p>

              <p className="about-bio">
                {settings?.bio ||
                  'FedWorks is a cinematography practice focused on visual storytelling across narrative, commercial and music projects.'}
              </p>
            </div>
          </Reveal>
        </section>

        {/* PROFILE */}
        <AboutSection number="01" label="Profile">
          <p className="about-statement">
            Cinematography rooted in story, performance, atmosphere and
            the relationship between people and place.
          </p>
        </AboutSection>

        {/* CONTACT */}
        <AboutSection number="02" label="Contact">
          <div className="about-contact">
            <span>Inquiries</span>

            {contactEmail ? (
              <a href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            ) : (
              <span className="about-muted">
                Contact information coming soon.
              </span>
            )}
          </div>
        </AboutSection>

        {/* INFLUENCES */}
        <AboutSection number="03" label="Things I like">
          <div className="about-influences">
            <h2>
              Things I like.
            </h2>

            <p>
              Films, images, music, places and ideas that influence
              the way FedWorks approaches visual storytelling.
            </p>

            <div className="about-influence-placeholder">
              <span>01</span>
              <span>References &amp; influences</span>
            </div>
          </div>
        </AboutSection>

      </div>
    </main>
  )
}

function AboutSection({ number, label, children }) {
  return (
    <section className="about-section">
      <div className="about-section-label">
        <span>{number}</span>
        <span>{label}</span>
      </div>

      <div className="about-section-content">
        {children}
      </div>
    </section>
  )
}