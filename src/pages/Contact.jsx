import React, { useState, useEffect } from 'react'
import Reveal from '../components/Reveal.jsx'
import { getSiteSettings } from '../lib/sanity/queries.js'

export default function Contact() {
  const [settings, setSettings] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Narrative',
    message: '',
  })

  useEffect(() => {
    let mounted = true
    getSiteSettings().then(data => {
      if (mounted) setSettings(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactEmail = settings?.contactEmail || 'studio@fedworks.com'
  const instagramUrl = settings?.instagramUrl

  return (
    <div
      style={{
        backgroundColor: 'var(--color-black)',
        color: 'var(--color-off-white)',
        minHeight: '85svh',
        paddingTop: '8rem',
        paddingBottom: '5rem',
      }}
    >
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem' }}>
          {/* Display Header */}
          <Reveal>
            <div style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>
              <div>HAVE A STORY?</div>
              <div style={{ color: 'var(--color-red)' }}>LET'S SHOOT IT.</div>
            </div>
          </Reveal>

          <div className="editorial-split">
            {/* Direct Contact Form */}
            <div>
              {submitted ? (
                <div
                  style={{
                    padding: '1.5rem',
                    borderLeft: '2px solid var(--color-red)',
                    backgroundColor: 'rgba(243, 240, 232, 0.05)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                  }}
                >
                  <strong>Transmission Received.</strong>
                  <p style={{ marginTop: '0.5rem', fontWeight: 300, color: 'rgba(243, 240, 232, 0.8)' }}>
                    Thank you, {formData.name}. The camera department reviews incoming scripts and treatment briefs regularly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-dark)',
                          color: 'var(--color-off-white)',
                          outline: 'none',
                          fontSize: '0.9375rem',
                        }}
                        placeholder="Producer / Director"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-dark)',
                          color: 'var(--color-off-white)',
                          outline: 'none',
                          fontSize: '0.9375rem',
                        }}
                        placeholder="contact@production.com"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
                      Inquiry Category
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-black-soft)',
                        border: '1px solid var(--border-dark)',
                        color: 'var(--color-off-white)',
                        outline: 'none',
                        fontSize: '0.9375rem',
                      }}
                    >
                      <option value="Narrative">Narrative Feature / Short</option>
                      <option value="Commercial">Commercial Campaign</option>
                      <option value="Music">Music Video</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Mentoring">Mentoring & Shadowing</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
                      Script Treatment & Proposed Dates *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-dark)',
                        color: 'var(--color-off-white)',
                        outline: 'none',
                        resize: 'vertical',
                        fontSize: '0.9375rem',
                      }}
                      placeholder="Outline the synopsis, location, schedule, and optical requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '0.85rem 1.75rem',
                      backgroundColor: 'var(--color-off-white)',
                      color: 'var(--color-black)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      alignSelf: 'flex-start',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-red)'
                      e.currentTarget.style.color = 'var(--color-off-white)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-off-white)'
                      e.currentTarget.style.color = 'var(--color-black)'
                    }}
                  >
                    Send Transmission →
                  </button>
                </form>
              )}
            </div>

            {/* Direct Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(243, 240, 232, 0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Direct Transmission
                </div>
                <a
                  href={`mailto:${contactEmail}`}
                  style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-off-white)', marginTop: '0.35rem', display: 'block' }}
                >
                  {contactEmail}
                </a>
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    style={{ fontSize: '0.9375rem', color: 'rgba(243, 240, 232, 0.75)', marginTop: '0.25rem', display: 'block' }}
                  >
                    {settings.phone}
                  </a>
                )}
              </div>

              {instagramUrl && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(243, 240, 232, 0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Social Dispatches
                  </div>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.9375rem', color: 'var(--color-off-white)', textDecoration: 'underline', marginTop: '0.35rem', display: 'inline-block' }}
                  >
                    Instagram
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
