import React from 'react'
import { motion } from 'motion/react'

export default function Hero({ onExploreWorks }) {
  return (
    <section className="hero-section">
      <div className="site-container">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-label">Architecture · Editorial · Cinema</div>
            <h1 className="hero-headline">
              Material presence.<br />
              Sculptural silence.
            </h1>
            <p className="hero-prose">
              Fedworks is a multi-disciplinary practice executing permanent spatial installations,
              archival monographs, and cinematic documents. Every commission is governed by gravity,
              austere material honesty, and rigorous restraint.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hero-media-wrapper"
          >
            <img
              src="/src/assets/images/hero_fedworks_installation_1790959674854.jpg"
              alt="Fedworks Monolith Installation in Gallery Pavilion"
              className="hero-image"
              referrerPolicy="no-referrer"
            />
            <div className="hero-media-caption">
              <span>Spatial Commission 05 · Basalt Monolith</span>
              <span className="tabular-nums">Munich · 2024</span>
            </div>
          </motion.div>
        </div>

        {/* Hero discipline indices */}
        <div className="hero-discipline-strip">
          <div className="discipline-col">
            <span className="discipline-number tabular-nums">01. SPATIAL</span>
            <h3 className="discipline-title">Monolithic Architecture</h3>
            <p className="discipline-desc">Cast-concrete sanctuaries, pavilions, and celestial light apertures.</p>
          </div>

          <div className="discipline-col">
            <span className="discipline-number tabular-nums">02. PRINT</span>
            <h3 className="discipline-title">Archival Monographs</h3>
            <p className="discipline-desc">Tactile smyth-sewn editions, naked spine binding, uncoated stocks.</p>
          </div>

          <div className="discipline-col">
            <span className="discipline-number tabular-nums">03. CINEMA</span>
            <h3 className="discipline-title">Atmospheric Documents</h3>
            <p className="discipline-desc">Non-narrative 35mm film records of light migration and acoustic decay.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
