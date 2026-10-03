import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function ProjectModal({ project, onClose, onInquireProject }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="modal-dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close project modal"
          >
            ✕
          </button>

          <div className="modal-media-frame">
            <img
              src={project.image}
              alt={project.title}
              className="modal-media-img"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="modal-body">
            <div className="modal-meta-row">
              <span>{project.discipline}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
              <span aria-hidden="true">·</span>
              <span>{project.location}</span>
            </div>

            <h2 className="modal-title">{project.title}</h2>

            <p className="modal-synopsis">{project.synopsis}</p>

            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Client / Commissioner
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-black)' }}>
                {project.client}
              </div>
            </div>

            {project.specifications && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Material & Technical Specifications
                </div>
                <div className="modal-specs-list">
                  {project.specifications.map((spec, i) => (
                    <div key={i} className="modal-spec-item">
                      <span className="modal-spec-bullet">/</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Sanity Document ID: <code style={{ fontFamily: 'monospace' }}>{project._id}</code>
              </div>
              <button
                onClick={() => {
                  onClose()
                  onInquireProject(project.title)
                }}
                className="btn-inquire-primary"
              >
                Inquire About Similar Commission
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
