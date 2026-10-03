import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function MediaViewer({ isOpen, onClose, mediaSrc, mediaAlt, title, caption }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.classList.add('menu-open')
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('menu-open')
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="media-viewer-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="media-viewer-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="media-viewer-close"
            aria-label="Close media viewer"
          >
            ✕
          </button>

          <div className="media-viewer-media">
            <img
              src={mediaSrc}
              alt={mediaAlt || title || 'Enlarged media frame'}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              referrerPolicy="no-referrer"
            />
          </div>

          {(title || caption) && (
            <div className="media-viewer-content">
              {title && <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem' }}>{title}</h3>}
              {caption && <p style={{ fontSize: '0.875rem', color: 'rgba(10, 10, 10, 0.65)', fontWeight: 300 }}>{caption}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
