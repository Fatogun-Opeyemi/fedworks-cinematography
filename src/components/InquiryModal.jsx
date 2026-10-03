import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function InquiryModal({ isOpen, onClose, initialSubject = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    discipline: 'Spatial Architecture',
    budget: '€100k - €250k',
    message: initialSubject ? `Inquiring regarding: ${initialSubject}` : '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (initialSubject) {
      setFormData(prev => ({
        ...prev,
        message: `Inquiring regarding: ${initialSubject}`,
      }))
    }
  }, [initialSubject])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="modal-dialog"
          style={{ maxWidth: '640px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close inquiry dialog"
          >
            ✕
          </button>

          <div className="modal-body">
            <span className="section-label">Studio Engagement</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.35rem 0 1.25rem 0' }}>
              Initiate Commission
            </h2>

            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-feedback-notice">
                  <strong>Commission Brief Received.</strong>
                  <p style={{ marginTop: '0.35rem', fontWeight: 300 }}>
                    Thank you, {formData.name}. The studio directors review all prospective commissions weekly.
                    A formal response will be dispatched to <em>{formData.email}</em> within 48 hours.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="btn-inquire-primary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Return to Studio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="inquiry-form-card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Elena Rostova"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization / Foundation</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Rostova Pavilion Trust"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="name@organization.com"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Discipline</label>
                    <select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      className="form-select"
                    >
                      <option value="Spatial Architecture">Spatial Architecture</option>
                      <option value="Monograph & Print">Monograph & Print Edition</option>
                      <option value="Cinema & Direction">Cinema & Direction</option>
                      <option value="Industrial Design">Industrial Design</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Scale Scope</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="form-select"
                    >
                      <option value="Under €50k">Publication / Small Object</option>
                      <option value="€50k - €150k">Medium Scale / Exhibition</option>
                      <option value="€150k - €500k">Permanent Spatial Structure</option>
                      <option value="€500k+">Institutional Pavilion</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Scope & Location *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    placeholder="Briefly describe the site, conceptual context, and delivery requirements..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    * Studio consultations strictly by appointment.
                  </span>
                  <button type="submit" className="btn-inquire-primary">
                    Transmit Brief
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
