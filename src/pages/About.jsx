
import React, { useEffect, useState } from 'react'

import Reveal from '../components/Reveal.jsx'

import { sendContactEmail } from '../libs/email.js'

import {
  Link,
  useLocation,
} from 'react-router-dom'
import SectionHeader from '../components/SectionHeader.jsx'
import {
  getAboutContent,
  getSiteSettings,
} from '../libs/sanity.js'

import './About.css'

export default function About() {
  const [about, setAbout] = useState(null)

  const [siteSettings, setSiteSettings] = useState(null)

  const [loading, setLoading] = useState(true)

  const [submitted, setSubmitted] = useState(false)

  const [sending, setSending] = useState(false)

  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Narrative',
    message: '',
  })

  const routerLocation = useLocation()

  useEffect(() => {
    if (loading || !routerLocation.hash) return

    const id = routerLocation.hash.substring(1)

    const element = document.getElementById(id)

    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }, [routerLocation.hash, loading])

  useEffect(() => {
    let mounted = true

    async function loadAbout() {
      try {
        const [aboutData, siteSettingsData] =
          await Promise.all([
            getAboutContent(),
            getSiteSettings(),
          ])

        if (mounted) {
          setAbout(aboutData || null)
          setSiteSettings(siteSettingsData || null)
        }
      } catch (error) {
        console.error(
          'Failed to load About page:',
          error
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAbout()

    return () => {
      mounted = false
    }
  }, [])

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (sending) {
      return
    }

    setSending(true)
    setError('')

    try {
      await sendContactEmail(e.currentTarget)

      setSubmitted(true)
    } catch (error) {
      console.error(
        'Failed to send contact inquiry:',
        error
      )

      setError(
        'We could not send your inquiry. Please try again or contact us directly.'
      )
    } finally {
      setSending(false)
    }
  }

  /*
   * ============================================================
   * SANITY DATA
   * ============================================================
   */

  const name = about?.name || 'FEDWORKS'

  const professionalTitle =
    about?.title || 'Director of Photography'

  const biography = about?.bio || ''

  const extendedBiography = Array.isArray(
    about?.extendedBio
  )
    ? about.extendedBio
      .map((block) => {
        if (!Array.isArray(block?.children)) {
          return ''
        }

        return block.children
          .map((child) => child?.text || '')
          .join('')
          .trim()
      })
      .filter(Boolean)
    : []

  const portraitImageUrl =
    about?.portraitImageUrl || ''

  const supportingImages = Array.isArray(
    about?.supportingImages
  )
    ? about.supportingImages
    : []

  const pressPublications = Array.isArray(
    about?.pressPublications
  )
    ? about.pressPublications.filter(Boolean)
    : []

  const brandsWorkedWith = Array.isArray(
    about?.brandsWorkedWith
  )
    ? about.brandsWorkedWith.filter(Boolean)
    : []

  const engagements = Array.isArray(
    about?.engagements
  )
    ? about.engagements.filter(Boolean)
    : []

  const cvUrl = about?.cvUrl || ''
  console.log('About document:', about)
  console.log('CV URL:', cvUrl)

  const contactEmail =
    siteSettings?.contactEmail || ''

  const location =
    siteSettings?.location || ''

  /*
   * socialLinks is now an array from Sanity:
   *
   * [
   *   {
   *     platform: 'instagram',
   *     url: 'https://...'
   *   },
   *   {
   *     platform: 'youtube',
   *     url: 'https://...'
   *   }
   * ]
   */

  const socialLinks = Array.isArray(
    siteSettings?.socialLinks
  )
    ? siteSettings.socialLinks.filter(
      (social) =>
        social?.platform && social?.url
    )
    : []


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */


  if (loading) {
    return (
      <main className="about-page">
        <div className="site-container about-loading-skeleton">
          <div className="about-section-marker about-section-marker-horizontal">
            <span>01 / 06</span>
            <span>ABOUT</span>
          </div>

          <div className="about-portrait-wrap">
            <div
              className="about-skeleton about-skeleton-portrait"
              aria-hidden="true"
            />

            <div className="about-skeleton-caption">
              <span className="about-skeleton" />
              <span className="about-skeleton" />
            </div>
          </div>

          <section
            className="about-skeleton-section"
            aria-label="Loading biography"
            aria-busy="true"
          >
            <div className="about-section-marker">
              <span>02 / 06</span>
              <span>BIOGRAPHY</span>
            </div>

            <div className="about-editorial-content">
              {[100, 100, 78, 100, 48].map((width, index) => (
                <div
                  key={index}
                  className="about-skeleton about-skeleton-line"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
          </section>

          <section className="about-skeleton-section">
            <div className="about-section-marker">
              <span>03 / 06</span>
              <span>PRESS &amp; PUBLICATIONS</span>
            </div>

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="about-skeleton about-skeleton-line"
                style={{ width: `${100 - item * 12}%` }}
              />
            ))}
          </section>
        </div>
      </main>
    )
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <main className="about-page">
      <div className="site-container">

        {/* =====================================================
            01 / 06 — ABOUT
        ===================================================== */}

        <section className="about-portrait-section">

          {/* Desktop section marker */}
          <div className="about-section-marker about-section-marker-horizontal">
            <span>01 / 06</span>
            <span>ABOUT</span>
          </div>

          {/* Mobile-only section heading + home link */}
          <div className="mobile-section-intro">
            <SectionHeader title="About" />

            <Link
              to="/"
              className="mobile-back-home"
            >
              <span aria-hidden="true">←</span>
              <span>Back Home</span>
            </Link>
          </div>

          <Reveal>
            <div className="about-portrait-wrap">

              <div className="about-portrait">
                {portraitImageUrl ? (
                  <img
                    src={portraitImageUrl}
                    alt={name}
                  />
                ) : (
                  <div className="about-portrait-placeholder">
                    <span>
                      {name.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="about-image-caption">
                <span>
                  {name.toUpperCase()}
                </span>

                <span>
                  {professionalTitle.toUpperCase()}
                </span>
              </div>

            </div>
          </Reveal>
        </section>

        {/* =====================================================
            02 / 06 — BIOGRAPHY
        ===================================================== */}

        <section className="about-editorial-section">

          <div className="about-section-marker">
            <span>02 / 06</span>
            <span>BIOGRAPHY</span>
          </div>

          <div className="about-editorial-content">
            <Reveal>
              {biography ? (
                <div className="about-biography">
                  {biography
                    .split(/\n\n+/)
                    .map((paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    ))}
                </div>
              ) : extendedBiography.length > 0 ? (
                <div className="about-biography">
                  {extendedBiography.map(
                    (paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <div className="about-empty">
                  Biography coming soon.
                </div>
              )}
            </Reveal>
          </div>
        </section>

        {/* =====================================================
            03 / 06 — PRESS & PUBLICATIONS
        ===================================================== */}

        <section className="about-editorial-section about-projects-section">

          <div className="about-section-marker">
            <span>03 / 06</span>

            <span>
              PRESS &amp; PUBLICATIONS
            </span>
          </div>

          <div className="about-editorial-content">

            <Reveal>
              <div className="about-project-list">

                {pressPublications.length > 0 ? (
                  pressPublications.map(
                    (publication, index) => (
                      <div
                        className="about-project-row"
                        key={`${publication.title}-${index}`}
                      >

                        <span className="about-project-number">
                          {String(index + 1).padStart(
                            2,
                            '0'
                          )}
                        </span>

                        <div className="about-project-title">
                          {publication.url ? (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {publication.title}
                              <b>↗</b>
                            </a>
                          ) : (
                            publication.title
                          )}
                        </div>

                        <div className="about-project-company">
                          {publication.publication}
                        </div>

                        {publication.date && (
                          <div className="about-project-note">
                            {publication.date}
                          </div>
                        )}

                      </div>
                    )
                  )
                ) : (
                  <div className="about-empty">
                    {/* Press and publications coming soon. */}
                  </div>
                )}

              </div>
            </Reveal>

          </div>
        </section>

        {/* =====================================================
            SUPPORTING IMAGES
        ===================================================== */}

        {supportingImages.length > 0 && (
          <section className="about-supporting-images">

            <div className="about-supporting-grid">

              {supportingImages.map(
                (image, index) => {
                  const imageUrl =
                    image?.url ||
                    image?.asset?.url ||
                    ''

                  if (!imageUrl) {
                    return null
                  }

                  return (
                    <Reveal
                      key={
                        image?.asset?._id ||
                        index
                      }
                      delay={Math.min(
                        index * 0.04,
                        0.16
                      )}
                    >
                      <figure className="about-supporting-image">

                        <img
                          src={imageUrl}
                          alt={`${name} — supporting image ${index + 1}`}
                          loading="lazy"
                        />

                        <figcaption>
                          {String(
                            index + 1
                          ).padStart(2, '0')}
                        </figcaption>

                      </figure>
                    </Reveal>
                  )
                }
              )}

            </div>
          </section>
        )}


        {/* =====================================================
    04 / 06 — BRANDS WORKED WITH
===================================================== */}

        <section className="about-editorial-section about-brands-section">
          <div className="about-section-marker">
            <span>04 / 06</span>
            <span>BRANDS WORKED WITH</span>
          </div>

          <div className="about-editorial-content">
            <Reveal>
              {brandsWorkedWith.length > 0 ? (
                <div className="about-brand-list">
                  {brandsWorkedWith
                    .map((brand) => brand.name)
                    .filter(Boolean)
                    .join(', ')}
                </div>
              ) : (
                <div className="about-empty">
                  Brands worked with will appear here.
                </div>
              )}
            </Reveal>
          </div>
        </section>
        {/* =====================================================
    05 / 06 — IN CONVERSATION
===================================================== */}

        <section className="about-editorial-section about-conversation-section">
          <div className="about-section-marker">
            <span>05 / 06</span>
            <span>BEYOND THE FRAME</span>
          </div>

          <div className="about-editorial-content">
            <Reveal>
              {engagements.length > 0 ? (
                <div className="about-conversation-list">
                  {engagements
                    .map((engagement) => engagement?.title?.trim())
                    .filter(Boolean)
                    .join(', ')}
                </div>
              ) : (
                <div className="about-conversation-empty">
                  <span>05</span>
                  <p>Conversations and features coming soon.</p>
                </div>
              )}
            </Reveal>
          </div>
        </section>
        {/* =====================================================
            06 / 06 — CONTACT
        ===================================================== */}

        <section
          className="about-editorial-section about-contact-section"
        >

          <div className="about-section-marker">
            <span>06 / 06</span>
            <span>CONTACT</span>
          </div>

          <div
            style={{
              borderTop:
                '1px solid var(--border-light)',
              paddingTop:
                'clamp(2rem, 4vw, 3.5rem)',
            }}
          >

            <div
              className="editorial-split"
              style={{
                alignItems: 'start',
              }}
            >

              {/* =================================================
                  01 — INQUIRY FORM
              ================================================= */}

              <Reveal>

                <div id="inquire">

                  <div
                    style={{
                      marginBottom: '2rem',
                      maxWidth: '520px',
                    }}
                  >

                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform:
                          'uppercase',
                        marginBottom:
                          '0.75rem',
                      }}
                    >
                      01 — Contact / Inquiry
                    </div>

                    {/* <p
                      style={{
                        margin: 0,
                        fontSize: '1rem',
                        lineHeight: 1.65,
                        color:
                          'rgba(0, 0, 0, 0.62)',
                        maxWidth: '480px',
                      }}
                    >
                      For commissions,
                      collaborations,
                      mentoring,
                      professional
                      inquiries, or anything
                      else you'd like to
                      discuss.
                    </p> */}

                  </div>

                  {submitted ? (

                    <div
                      style={{
                        borderTop:
                          '2px solid var(--color-red)',
                        paddingTop: '1.5rem',
                        maxWidth: '620px',
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            'clamp(2rem, 4vw, 3.5rem)',
                          fontWeight: 400,
                          lineHeight: 1,
                          letterSpacing:
                            '-0.04em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        Message received!
                      </div>

                      <p
                        style={{
                          marginTop: '1rem',
                          marginBottom: 0,
                          color:
                            'rgba(0, 0, 0, 0.62)',
                          lineHeight: 1.65,
                        }}
                      >
                        Thank you,{' '}
                        {formData.name}. We'll
                        review your message and
                        get back to you.
                      </p>

                    </div>

                  ) : (

                    <form
                      onSubmit={handleSubmit}
                      style={{
                        display: 'flex',
                        flexDirection:
                          'column',
                        gap: '1.75rem',
                        maxWidth: '680px',
                      }}
                    >

                      {error && (
                        <p
                          style={{
                            margin: 0,
                            color:
                              'var(--color-red)',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                          }}
                        >
                          {error}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '1.5rem',
                        }}
                      >

                        <Field
                          label="Name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(value) =>
                            updateField(
                              'name',
                              value
                            )
                          }
                          placeholder="Your name"
                        />

                        <Field
                          label="Email"
                          name="email"
                          required
                          type="email"
                          value={formData.email}
                          onChange={(value) =>
                            updateField(
                              'email',
                              value
                            )
                          }
                          placeholder="you@production.com"
                        />

                      </div>

                      <div
                        style={fieldWrapperStyle}
                      >

                        <label
                          style={labelStyle}
                        >
                          Inquiry Type
                        </label>

                        <select
                          value={
                            formData.projectType
                          }
                          name="project_type"
                          onChange={(e) =>
                            updateField(
                              'projectType',
                              e.target.value
                            )
                          }
                          style={inputStyle}
                        >

                          <option value="Narrative">
                            Narrative Feature /
                            Short
                          </option>

                          <option value="Commercial">
                            Commercial Campaign
                          </option>

                          <option value="Music">
                            Music Video
                          </option>

                          <option value="Documentary">
                            Documentary
                          </option>

                          <option value="Mentoring">
                            Mentoring &amp;
                            Shadowing
                          </option>

                          <option value="Collaboration">
                            Collaboration
                          </option>

                          <option value="Other">
                            Other Inquiry
                          </option>

                        </select>

                      </div>

                      <div
                        style={fieldWrapperStyle}
                      >

                        <label
                          style={labelStyle}
                        >
                          Message <span>*</span>
                        </label>

                        <textarea
                          name="message"
                          required
                          rows={2}
                          value={formData.message}
                          onChange={(e) =>
                            updateField(
                              'message',
                              e.target.value
                            )
                          }
                          style={{
                            ...inputStyle,
                            resize: 'vertical',
                            minHeight: '80px',
                          }}
                          placeholder="Tell us what you'd like to discuss..."
                        />

                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        style={{
                          alignSelf: 'flex-start',
                          marginTop: '0.25rem',
                          padding:
                            '1rem 1.4rem',
                          border:
                            '1px solid var(--color-black)',
                          backgroundColor:
                            'var(--color-black)',
                          color:
                            'var(--color-off-white)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          letterSpacing:
                            '0.13em',
                          textTransform:
                            'uppercase',
                          cursor: sending
                            ? 'wait'
                            : 'pointer',
                          opacity: sending
                            ? 0.7
                            : 1,
                          transition:
                            'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (sending) return

                          e.currentTarget.style.backgroundColor =
                            'var(--color-red)'

                          e.currentTarget.style.borderColor =
                            'var(--color-red)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'var(--color-black)'

                          e.currentTarget.style.borderColor =
                            'var(--color-black)'
                        }}
                      >
                        {sending
                          ? 'Sending…'
                          : 'Send Inquiry'}
                      </button>

                    </form>
                  )}

                </div>

              </Reveal>

              {/* =================================================
                  02 — DIRECT CONTACT
              ================================================= */}

              <Reveal>

                <aside
                  style={{
                    borderTop:
                      '1px solid var(--border-light)',
                    paddingTop: '1.25rem',
                  }}
                >

                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform:
                        'uppercase',
                      marginBottom: '2.5rem',
                    }}
                  >
                    02 — Direct Contact
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection:
                        'column',
                      gap: '2.5rem',
                    }}
                  >

                    {/* Email */}

                    {contactEmail && (
                      <div>

                        <div
                          style={metaLabelStyle}
                        >
                          Email
                        </div>

                        <a
                          href={`mailto:${contactEmail}`}
                          style={{
                            display:
                              'inline-block',
                            marginTop: '0.5rem',
                            color:
                              'var(--color-black)',
                            fontSize:
                              'clamp(1.2rem, 2.2vw, 1.65rem)',
                            fontWeight: 400,
                            lineHeight: 1.15,
                            letterSpacing:
                              '-0.025em',
                            textDecoration:
                              'none',
                            overflowWrap:
                              'anywhere',
                          }}
                        >
                          {contactEmail}
                        </a>

                      </div>
                    )}

                    {/* Phone */}

                    {siteSettings?.phone && (
                      <div>

                        <div
                          style={metaLabelStyle}
                        >
                          Phone
                        </div>

                        <a
                          href={`tel:${siteSettings.phone}`}
                          style={{
                            display:
                              'inline-block',
                            marginTop: '0.5rem',
                            color:
                              'rgba(0, 0, 0, 0.72)',
                            fontSize: '1rem',
                            textDecoration:
                              'none',
                          }}
                        >
                          {siteSettings.phone}
                        </a>

                      </div>
                    )}

                    {/* Social Links */}

                    {socialLinks.length > 0 && (
                      <div>

                        <div
                          style={metaLabelStyle}
                        >
                          Social
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection:
                              'column',
                            gap: '0.75rem',
                            marginTop: '0.5rem',
                          }}
                        >

                          {socialLinks.map(
                            (social) => {
                              const labels = {
                                instagram:
                                  'Instagram',
                                linkedin:
                                  'LinkedIn',
                                youtube:
                                  'YouTube',
                                vimeo:
                                  'Vimeo',
                                imdb:
                                  'Imdb',
                              }

                              const label =
                                labels[
                                social.platform
                                ] ||
                                social.platform

                              return (
                                <a
                                  key={`${social.platform}-${social.url}`}
                                  href={social.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display:
                                      'inline-block',
                                    width:
                                      'fit-content',
                                    color:
                                      'var(--color-black)',
                                    fontSize:
                                      '1rem',
                                    textDecoration:
                                      'underline',
                                    textUnderlineOffset:
                                      '0.25em',
                                  }}
                                >
                                  {label}
                                </a>
                              )
                            }
                          )}

                        </div>
                      </div>
                    )}

                    {/* CV */}

                    {cvUrl && (
                      <div>

                        <div
                          style={metaLabelStyle}
                        >
                          CV
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1.25rem',
                            marginTop: '0.5rem',
                          }}
                        >

                          <a
                            href={cvUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color:
                                'var(--color-black)',
                              fontSize: '1rem',
                              textDecoration:
                                'underline',
                              textUnderlineOffset:
                                '0.25em',
                            }}
                          >
                            View CV
                          </a>

                          <a
                            href={`${cvUrl}${cvUrl.includes('?') ? '&' : '?'}dl=CV.pdf`}
                            target="_blank"
                            style={{
                              color:
                                'var(--color-black)',
                              fontSize: '1rem',
                              textDecoration:
                                'underline',
                              textUnderlineOffset:
                                '0.25em',
                            }}
                          >
                            Download CV
                          </a>

                        </div>
                      </div>
                    )}

                  </div>

                  {/* Availability */}

                  <div
                    style={{
                      marginTop:
                        'clamp(4rem, 10vw, 8rem)',
                      paddingTop: '1.25rem',
                      borderTop:
                        '1px solid var(--border-light)',
                      color:
                        'rgba(0, 0, 0, 0.48)',
                      fontSize: '0.78rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {location || 'Africa'}
                    <br />
                    Available for selected
                    commissions,
                    collaborations,
                    mentoring, and
                    professional inquiries
                    worldwide.
                  </div>

                </aside>

              </Reveal>

            </div>
          </div>

        </section>

      </div>
    </main>
  )
}

/*
 * ============================================================
 * CONTACT FORM HELPERS
 * ============================================================
 */

const fieldWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.55rem',
}

const labelStyle = {
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(0, 0, 0, 0.55)',
}

const metaLabelStyle = {
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(0, 0, 0, 0.45)',
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.9rem 0',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom:
    '1px solid var(--border-light)',
  borderRadius: 0,
  color: 'var(--color-black)',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: '1rem',
}

function Field({
  label,
  name,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder,
}) {
  return (
    <div style={fieldWrapperStyle}>
      <label style={labelStyle}>
        {label}{' '}
        {required && <span>*</span>}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}
