import React, { useEffect, useRef, useState } from 'react'
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
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

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

  // Update video state when mediaSrc changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = mediaSrc || ''
      videoRef.current.poster = posterSrc || ''
      // Reset play state when media changes? We'll keep it as is.
    }
  }, [mediaSrc, posterSrc])

  // Handle video ended
  useEffect(() => {
    if (videoRef.current) {
      const handleEnded = () => {
        setIsPlaying(false)
      }
      videoRef.current.addEventListener('ended', handleEnded)
      return () => {
        videoRef.current.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

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
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <video
                  ref={videoRef}
                  src={mediaSrc}
                  poster={posterSrc}
                  playsInline
                  autoPlay
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {/* Controls Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '0 12px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    // We'll show controls always in fullscreen for simplicity
                    opacity: 1,
                  }}
                >
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--color-off-white)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isPlaying ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    )}
                  </button>
                  {/* Mute/Unmute Button */}
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--color-off-white)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isMuted ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
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