// import React, { useState, useEffect } from 'react'
// import Reveal from '../components/Reveal.jsx'
// import { getSiteSettings } from '../lib/sanity/queries.js'

// export default function Contact() {
//   const [settings, setSettings] = useState(null)
//   const [submitted, setSubmitted] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     projectType: 'Narrative',
//     message: '',
//   })

//   useEffect(() => {
//     let mounted = true
//     getSiteSettings().then(data => {
//       if (mounted) setSettings(data)
//     })
//     return () => {
//       mounted = false
//     }
//   }, [])

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setSubmitted(true)
//   }

//   const contactEmail = settings?.contactEmail || 'studio@fedworks.com'
//   const instagramUrl = settings?.instagramUrl

//   return (
//     <div
//       style={{
//         backgroundColor: 'var(--color-black)',
//         color: 'var(--color-off-white)',
//         minHeight: '85svh',
//         paddingTop: '8rem',
//         paddingBottom: '5rem',
//       }}
//     >
//       <div className="site-container">
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem' }}>
//           {/* Display Header */}
//           <Reveal>
//             <div style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>
//               <div>HAVE A STORY?</div>
//               <div style={{ color: 'var(--color-red)' }}>LET'S SHOOT IT.</div>
//             </div>
//           </Reveal>

//           <div className="editorial-split">
//             {/* Direct Contact Form */}
//             <div>
//               {submitted ? (
//                 <div
//                   style={{
//                     padding: '1.5rem',
//                     borderLeft: '2px solid var(--color-red)',
//                     backgroundColor: 'rgba(243, 240, 232, 0.05)',
//                     fontSize: '0.9375rem',
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   <strong>Transmission Received.</strong>
//                   <p style={{ marginTop: '0.5rem', fontWeight: 300, color: 'rgba(243, 240, 232, 0.8)' }}>
//                     Thank you, {formData.name}. The camera department reviews incoming scripts and treatment briefs regularly.
//                   </p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
//                       <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
//                         Name *
//                       </label>
//                       <input
//                         type="text"
//                         required
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         style={{
//                           padding: '0.75rem 1rem',
//                           backgroundColor: 'transparent',
//                           border: '1px solid var(--border-dark)',
//                           color: 'var(--color-off-white)',
//                           outline: 'none',
//                           fontSize: '0.9375rem',
//                         }}
//                         placeholder="Producer / Director"
//                       />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
//                       <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
//                         Email *
//                       </label>
//                       <input
//                         type="email"
//                         required
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         style={{
//                           padding: '0.75rem 1rem',
//                           backgroundColor: 'transparent',
//                           border: '1px solid var(--border-dark)',
//                           color: 'var(--color-off-white)',
//                           outline: 'none',
//                           fontSize: '0.9375rem',
//                         }}
//                         placeholder="contact@production.com"
//                       />
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
//                     <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
//                       Inquiry Category
//                     </label>
//                     <select
//                       value={formData.projectType}
//                       onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
//                       style={{
//                         padding: '0.75rem 1rem',
//                         backgroundColor: 'var(--color-black-soft)',
//                         border: '1px solid var(--border-dark)',
//                         color: 'var(--color-off-white)',
//                         outline: 'none',
//                         fontSize: '0.9375rem',
//                       }}
//                     >
//                       <option value="Narrative">Narrative Feature / Short</option>
//                       <option value="Commercial">Commercial Campaign</option>
//                       <option value="Music">Music Video</option>
//                       <option value="Documentary">Documentary</option>
//                       <option value="Mentoring">Mentoring & Shadowing</option>
//                     </select>
//                   </div>

//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
//                     <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(243, 240, 232, 0.6)' }}>
//                       Script Treatment & Proposed Dates *
//                     </label>
//                     <textarea
//                       required
//                       rows={4}
//                       value={formData.message}
//                       onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                       style={{
//                         padding: '0.75rem 1rem',
//                         backgroundColor: 'transparent',
//                         border: '1px solid var(--border-dark)',
//                         color: 'var(--color-off-white)',
//                         outline: 'none',
//                         resize: 'vertical',
//                         fontSize: '0.9375rem',
//                       }}
//                       placeholder="Outline the synopsis, location, schedule, and optical requirements..."
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     style={{
//                       padding: '0.85rem 1.75rem',
//                       backgroundColor: 'var(--color-off-white)',
//                       color: 'var(--color-black)',
//                       fontSize: '0.8125rem',
//                       fontWeight: 600,
//                       letterSpacing: '0.12em',
//                       textTransform: 'uppercase',
//                       alignSelf: 'flex-start',
//                       cursor: 'pointer',
//                       transition: 'background-color 0.2s ease, color 0.2s ease',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = 'var(--color-red)'
//                       e.currentTarget.style.color = 'var(--color-off-white)'
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = 'var(--color-off-white)'
//                       e.currentTarget.style.color = 'var(--color-black)'
//                     }}
//                   >
//                     Send Transmission →
//                   </button>
//                 </form>
//               )}
//             </div>

//             {/* Direct Information */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
//               <div>
//                 <div style={{ fontSize: '0.75rem', color: 'rgba(243, 240, 232, 0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
//                   Direct Transmission
//                 </div>
//                 <a
//                   href={`mailto:${contactEmail}`}
//                   style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-off-white)', marginTop: '0.35rem', display: 'block' }}
//                 >
//                   {contactEmail}
//                 </a>
//                 {settings?.phone && (
//                   <a
//                     href={`tel:${settings.phone}`}
//                     style={{ fontSize: '0.9375rem', color: 'rgba(243, 240, 232, 0.75)', marginTop: '0.25rem', display: 'block' }}
//                   >
//                     {settings.phone}
//                   </a>
//                 )}
//               </div>

//               {instagramUrl && (
//                 <div>
//                   <div style={{ fontSize: '0.75rem', color: 'rgba(243, 240, 232, 0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
//                     Social Dispatches
//                   </div>
//                   <a
//                     href={instagramUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{ fontSize: '0.9375rem', color: 'var(--color-off-white)', textDecoration: 'underline', marginTop: '0.35rem', display: 'inline-block' }}
//                   >
//                     Instagram
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'
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

    getSiteSettings().then((data) => {
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

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <main
      style={{
        backgroundColor: 'var(--color-off-white)',
        color: 'var(--color-black)',
        minHeight: '100svh',
        // paddingTop: 'clamp(7rem, 6vw, 11rem)',
        paddingTop: "2.5rem",
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
      }}
    >
      <div className="site-container">
        {/* Intro */}
        <Reveal>
          <header
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '2rem',
              paddingBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  backgroundColor: 'var(--color-red)',
                  display: 'inline-block',
                }}
              />
              Contact / Commission
            </div>

            <div
              style={{
                maxWidth: '1100px',
                fontSize: 'clamp(3.5rem, 4vw, 9.5rem)',
                fontWeight: 200,
                lineHeight: 0.88,
                letterSpacing: '-0.055em',
                // textTransform: 'uppercase',
              }}
            >
              <div>Have a story? Let's shoot it.</div>

              {/* <div
                style={{
                  marginLeft: 'clamp(1.5rem, 12vw, 12rem)',
                }}
              >
                story?
              </div>

              <div
                style={{
                  color: 'var(--color-red)',
                  marginLeft: 'clamp(3rem, 25vw, 25rem)',
                }}
              >
                Let's shoot it.
              </div> */}
            </div>
          </header>
        </Reveal>

        {/* Contact area */}
        <section
          style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
          }}
        >
          <div
            className="editorial-split"
            style={{
              alignItems: 'start',
            }}
          >
            {/* Form */}
            <Reveal>
              <div>
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
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                    }}
                  >
                    01 — Project Inquiry
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '1rem',
                      lineHeight: 1.65,
                      color: 'rgba(0, 0, 0, 0.62)',
                      maxWidth: '480px',
                    }}
                  >
                    Tell us what you're making, where you're making it,
                    and what you need from the camera department.
                  </p>
                </div>

                {submitted ? (
                  <div
                    style={{
                      borderTop: '2px solid var(--color-red)',
                      paddingTop: '1.5rem',
                      maxWidth: '620px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: 400,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Transmission received.
                    </div>

                    <p
                      style={{
                        marginTop: '1rem',
                        marginBottom: 0,
                        color: 'rgba(0, 0, 0, 0.62)',
                        lineHeight: 1.65,
                      }}
                    >
                      Thank you, {formData.name}. We'll review the project
                      details and get back to you.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.75rem',
                      maxWidth: '680px',
                    }}
                  >
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
                        required
                        value={formData.name}
                        onChange={(value) => updateField('name', value)}
                        placeholder="Your name"
                      />

                      <Field
                        label="Email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(value) => updateField('email', value)}
                        placeholder="you@production.com"
                      />
                    </div>

                    <div style={fieldWrapperStyle}>
                      <label style={labelStyle}>
                        Project Type
                      </label>

                      <select
                        value={formData.projectType}
                        onChange={(e) =>
                          updateField('projectType', e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="Narrative">
                          Narrative Feature / Short
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
                          Mentoring & Shadowing
                        </option>
                      </select>
                    </div>

                    <div style={fieldWrapperStyle}>
                      <label style={labelStyle}>
                        Project Details <span>*</span>
                      </label>

                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          updateField('message', e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          resize: 'vertical',
                          minHeight: '150px',
                        }}
                        placeholder="Synopsis, location, proposed dates, visual references, scope..."
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '0.25rem',
                        padding: '1rem 1.4rem',
                        border: '1px solid var(--color-black)',
                        backgroundColor: 'var(--color-black)',
                        color: 'var(--color-off-white)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition:
                          'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
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
                      Send Inquiry →
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Contact information */}
            <Reveal>
              <aside
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1.25rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '2.5rem',
                  }}
                >
                  02 — Direct Contact
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2.5rem',
                  }}
                >
                  <div>
                    <div style={metaLabelStyle}>
                      Email
                    </div>

                    <a
                      href={`mailto:${contactEmail}`}
                      style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        color: 'var(--color-black)',
                        fontSize: 'clamp(1.2rem, 2.2vw, 1.65rem)',
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: '-0.025em',
                        textDecoration: 'none',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {contactEmail}
                    </a>
                  </div>

                  {settings?.phone && (
                    <div>
                      <div style={metaLabelStyle}>
                        Phone
                      </div>

                      <a
                        href={`tel:${settings.phone}`}
                        style={{
                          display: 'inline-block',
                          marginTop: '0.5rem',
                          color: 'rgba(0, 0, 0, 0.72)',
                          fontSize: '1rem',
                          textDecoration: 'none',
                        }}
                      >
                        {settings.phone}
                      </a>
                    </div>
                  )}

                  {instagramUrl && (
                    <div>
                      <div style={metaLabelStyle}>
                        Instagram
                      </div>

                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: '0.5rem',
                          color: 'var(--color-black)',
                          fontSize: '1rem',
                          textDecoration: 'underline',
                          textUnderlineOffset: '0.25em',
                        }}
                      >
                        Follow FedWorks →
                      </a>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 'clamp(4rem, 10vw, 8rem)',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-light)',
                    color: 'rgba(0, 0, 0, 0.48)',
                    fontSize: '0.78rem',
                    lineHeight: 1.6,
                  }}
                >
                  Lagos, Nigeria
                  <br />
                  Available for selected commissions worldwide.
                </div>
              </aside>
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  )
}

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
  borderBottom: '1px solid var(--border-light)',
  borderRadius: 0,
  color: 'var(--color-black)',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: '1rem',
}

function Field({
  label,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder,
}) {
  return (
    <div style={fieldWrapperStyle}>
      <label style={labelStyle}>
        {label} {required && <span>*</span>}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}