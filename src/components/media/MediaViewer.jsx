import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'

export default function MediaViewer({
  isOpen,
  onClose,
  mediaType = 'image', // 'image' | 'video'
  mediaSrc,
  posterSrc,
  alt = 'Full-screen cinematography media',
  title = '',
  caption = '',
}) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.classList.add('menu-open')
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('menu-open')
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'var(--site-gutter)',
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Media Viewer'}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-black-soft)',
            border: '1px solid var(--border-dark)',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close full-screen media viewer"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 10,
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: 'rgba(10, 10, 10, 0.85)',
              color: 'var(--color-off-white)',
              border: '1px solid var(--border-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-red)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.85)'
            }}
          >
            ✕
          </button>

          {/* Media Container */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: 'var(--color-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {mediaType === 'video' ? (
              <video
                src={mediaSrc}
                poster={posterSrc}
                controls
                playsInline
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <img
                src={mediaSrc}
                alt={alt}
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </div>

          {/* Optional Caption */}
          {(title || caption) && (
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--color-black-soft)',
                color: 'var(--color-off-white)',
              }}
            >
              {title && (
                <div style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {title}
                </div>
              )}
              {caption && (
                <div style={{ fontSize: '0.85rem', color: 'rgba(243, 240, 232, 0.65)', marginTop: '0.25rem', fontWeight: 300 }}>
                  {caption}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
