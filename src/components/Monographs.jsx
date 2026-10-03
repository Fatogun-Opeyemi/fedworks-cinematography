import React, { useState } from 'react'
import { monographs } from '../sanity/client'

export default function Monographs({ onOpenInquiry }) {
  const [acquiredMessage, setAcquiredMessage] = useState(null)

  const handleAcquire = (mono) => {
    if (mono.stock === 'Sold Out') {
      setAcquiredMessage(`"${mono.title}" is archived. Contact studio for reprint waitlist.`)
    } else {
      setAcquiredMessage(`Edition reserved: "${mono.title}". Proceeding to studio dispatch.`)
      setTimeout(() => {
        onOpenInquiry(`Monograph Acquisition: ${mono.title}`)
      }, 1000)
    }
  }

  return (
    <section id="monographs" className="monographs-section">
      <div className="site-container">
        <div className="section-title-wrap">
          <span className="section-label">Editorial Publishing</span>
          <h2 className="section-heading">Tactile Monographs</h2>
        </div>

        <p style={{ marginTop: '1rem', maxWidth: '58ch', color: 'var(--color-text-light-muted)', fontSize: '0.9375rem', fontWeight: 300 }}>
          Independent studio publications documenting spatial installations, material experiments,
          and theoretical manuscripts. Produced in limited numbered runs with bespoke Swiss bindings.
        </p>

        {acquiredMessage && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1.25rem',
              borderLeft: '2px solid var(--color-oxblood)',
              backgroundColor: 'rgba(243, 240, 232, 0.08)',
              fontSize: '0.8125rem',
              color: 'var(--color-canvas)',
            }}
          >
            {acquiredMessage}
          </div>
        )}

        <div className="monograph-list">
          {monographs.map((mono) => (
            <div key={mono._id} className="monograph-row">
              <div className="mono-vol tabular-nums">{mono.volume}</div>
              <div>
                <h3 className="mono-title">{mono.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light-muted)', marginTop: '0.25rem', fontWeight: 300 }}>
                  {mono.description}
                </p>
              </div>
              <div className="mono-spec">
                <div>{mono.dimensions}</div>
                <div style={{ opacity: 0.75 }}>{mono.pages}</div>
              </div>
              <div className="mono-stock">{mono.stock}</div>
              <div className="mono-price tabular-nums">{mono.price}</div>
              <div>
                <button
                  onClick={() => handleAcquire(mono)}
                  className="btn-mono-acquire"
                  disabled={mono.stock === 'Sold Out'}
                  style={mono.stock === 'Sold Out' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                >
                  {mono.stock === 'Sold Out' ? 'Archived' : 'Acquire'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
