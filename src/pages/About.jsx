import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import { getSiteSettings } from '../lib/sanity/queries.js'

export default function About() {
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

  return (
    <div style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-off-white)', minHeight: '100vh', paddingTop: '7.5rem', paddingBottom: '6rem' }}>
      <div className="site-container">
        <SectionHeader
          kicker="Practice & Ethos"
          title="About"
          subtitle="Director of Photography working internationally across narrative features, music films, commercials, and documentary projects."
        />

        <div className="editorial-split" style={{ marginTop: '3.5rem' }}>
          <div>
             <Reveal>
               <div style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                 <div>Chukwuka Edeogu (Fedworks)</div>
                 <div style={{ color: 'var(--color-red)' }}>DIRECTOR OF PHOTOGRAPHY</div>
               </div>

              <div style={{ fontSize: 'clamp(1rem, 1.35vw, 1.2rem)', fontWeight: 300, lineHeight: 1.75, color: 'rgba(243, 240, 232, 0.85)', maxWidth: '58ch' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  {settings?.aboutBody ||
                    'Approaching the camera as an instrument of cultural observation and architectural discipline. Believing that every community, landscape, and face carries an inherent visual truth that requires patience, motivated light, and stillness rather than forced technical spectacle.'}
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Work spans celluloid 35mm, Super 16mm, and digital large format sensors, often pairing expressive vintage spherical optics with bespoke color pipelines to preserve natural grain, skin texture, and environmental atmosphere.
                </p>
                <p>
                  Collaborating with directors from script development through final color grading to ensure that lighting and movement remain inextricably bound to character and cultural place.
                </p>
              </div>
            </Reveal>

            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div style={{ color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                Camera & Format Discipline
              </div>
              <div style={{ color: 'rgba(243, 240, 232, 0.8)' }}>
                35mm Spherical · Super 16mm · Digital Large Format · Natural & Motivated Tungsten
              </div>
            </div>
          </div>

          <div>
            <Reveal delay={0.12}>
              {/* Clear, strong editorial portrait of the cinematographer */}
              <div style={{ overflow: 'hidden', backgroundColor: 'var(--color-black-soft)', aspectRatio: '1 / 1' }}>
                <img
                  src={settings?.heroPosterUrl || '/src/assets/images/project_film_cinematography_1790959704756.jpg'}
                  alt="Cinematographer working on set with camera"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'rgba(243, 240, 232, 0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                On location · Camera Department
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
