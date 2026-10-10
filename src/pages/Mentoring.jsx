import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

import Reveal from '../components/Reveal.jsx'

const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID

const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID

const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,

  blockHeadless: true,

  limitRate: {
    id: 'fedworks-mentoring',
    throttle: 10000,
  },
})

export default function Mentoring() {
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: '',
    website: '',
  })

  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (status === 'sending') {
      return
    }

    // ----------------------------------------
    // Honeypot protection
    // ----------------------------------------

    if (formData.website.trim()) {
      // Silently pretend the submission succeeded.
      // Do not tell automated bots they were detected.
      setStatus('success')

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        about: '',
        website: '',
      })

      return
    }

    // ----------------------------------------
    // Normalize input
    // ----------------------------------------

    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()
    const email = formData.email.trim()
    const about = formData.about.trim()

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!firstName || !lastName || !email || !about) {
      setStatus('error')
      return
    }

    if (
      firstName.length > 80 ||
      lastName.length > 80
    ) {
      setStatus('error')
      return
    }

    if (email.length > 254) {
      setStatus('error')
      return
    }

    if (about.length > 5000) {
      setStatus('error')
      return
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      setStatus('error')
      return
    }

    // ----------------------------------------
    // Send
    // ----------------------------------------

    setStatus('sending')

    try {
      if (!formRef.current) {
        throw new Error('Form reference is unavailable.')
      }

      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
      )

      setStatus('success')

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        about: '',
        website: '',
      })
    } catch (error) {
      console.error(
        'Mentoring form submission failed:',
        error,
      )

      setStatus('error')
    }
  }

  return (
    <div
      className="editorial-page-section"
      style={{
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="site-container">
        <div
          style={{
            maxWidth: '900px',
          }}
        >
          <Reveal>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  fontWeight: 400,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: 'var(--color-black)',
                }}
              >
                Mentoring &amp; Shadowing
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div
              style={{
                maxWidth: '680px',
                marginTop: '2rem',
              }}
            >
              {/* <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'rgba(10, 10, 10, 0.72)',
                }}
              >
                If you would like to partake in mentoring and
                shadowing opportunities such as being on set as a
                DP Shadow or having one-to-one/group mentoring
                sessions, please enter your contact information
                below.
              </p> */}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              style={{
                maxWidth: '680px',
                marginTop: '3rem',
              }}
            >
              {/* Honeypot */}

              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                }}
              >
                <label htmlFor="website">
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* Names */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',
                  gap: '1.5rem',
                }}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    style={{
                      display: 'block',
                      marginBottom: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: 'var(--color-black)',
                    }}
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                    maxLength={80}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '0.65rem 0',
                      border: 0,
                      borderBottom:
                        '1px solid var(--border-light)',
                      borderRadius: 0,
                      background: 'transparent',
                      color: 'var(--color-black)',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    style={{
                      display: 'block',
                      marginBottom: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: 'var(--color-black)',
                    }}
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                    maxLength={80}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '0.65rem 0',
                      border: 0,
                      borderBottom:
                        '1px solid var(--border-light)',
                      borderRadius: 0,
                      background: 'transparent',
                      color: 'var(--color-black)',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Email */}

              <div style={{ marginTop: '1.5rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-black)',
                  }}
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  maxLength={254}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: '0.65rem 0',
                    border: 0,
                    borderBottom:
                      '1px solid var(--border-light)',
                    borderRadius: 0,
                    background: 'transparent',
                    color: 'var(--color-black)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* About */}

              <div style={{ marginTop: '1.5rem' }}>
                <label
                  htmlFor="about"
                  style={{
                    display: 'block',
                    marginBottom: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-black)',
                  }}
                >
                  Please enter some information about yourself
                </label>

                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  required
                  rows={1}
                  maxLength={5000}
                  style={{
                    display: 'block',
                    width: '100%',
                    minHeight: '100px',
                    margin: 0,
                    padding: '0.65rem 0',
                    border: 0,
                    borderBottom:
                      '1px solid var(--border-light)',
                    borderRadius: 0,
                    background: 'transparent',
                    color: 'var(--color-black)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit */}

              <div style={{ marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={status === 'sending'}
                >
                  {status === 'sending'
                    ? 'SENDING...'
                    : 'SUBMIT'}
                </button>
              </div>

              {/* Success */}

              {status === 'success' && (
                <p
                  role="status"
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: 'rgba(10, 10, 10, 0.65)',
                  }}
                >
                  Thank you. Your information has been received.
                </p>
              )}

              {/* Error */}

              {status === 'error' && (
                <p
                  role="alert"
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: 'var(--color-red)',
                  }}
                >
                  Something went wrong. Please check your
                  information and try again.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  )
}