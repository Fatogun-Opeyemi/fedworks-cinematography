import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import VideoPlayer from './VideoPlayer.jsx'

/* ------------------------------------------------------------------ */
/*  CSS injected once into <head>. Never rendered as JSX children,     */
/*  so it cannot bleed into the grid or show up as page text.          */
/* ------------------------------------------------------------------ */

const MEDIA_VIEWER_CSS = `
.media-viewer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 40px);
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(8px);
}

.media-viewer-modal {
  position: relative;
  width: min(1400px, 100%);
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #050505;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
}

.media-viewer-media {
  position: relative;
  width: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  touch-action: pan-y;
}

.media-viewer-image {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(100vh - 150px);
  object-fit: contain;
  background: transparent;
}

.media-viewer-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 40;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.48);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}

.media-viewer-close:hover {
  background: rgba(0, 0, 0, 0.78);
  border-color: rgba(255, 255, 255, 0.65);
  transform: scale(1.04);
}

.media-viewer-close svg {
  width: 17px;
  height: 17px;
}

.media-viewer-nav {
  position: absolute;
  top: 50%;
  z-index: 35;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.48);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transform: translateY(-50%);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}

.media-viewer-nav:hover {
  background: rgba(0, 0, 0, 0.82);
  border-color: rgba(255, 255, 255, 0.65);
}

.media-viewer-nav svg {
  width: 23px;
  height: 23px;
}

.media-viewer-prev {
  left: 16px;
}

.media-viewer-next {
  right: 16px;
}

.media-viewer-counter {
  position: absolute;
  bottom: 64px;
  right: 18px;
  z-index: 35;
  padding: 6px 10px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.media-viewer-content {
  flex: 0 0 auto;
  width: 100%;
  padding: 14px 18px 16px;
  background: #050505;
  color: #fff;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.media-viewer-caption {
  margin: 4px 0;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.7rem;
  line-height: 1.5;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .media-viewer-backdrop {
    padding: 10px;
  }

  .media-viewer-modal {
    width: 100%;
    max-height: calc(100dvh - 20px);
  }

  .media-viewer-image {
    max-width: 100%;
    max-height: calc(100dvh - 110px);
  }

  .media-viewer-nav {
    width: 38px;
    height: 38px;
  }

  .media-viewer-prev {
    left: 8px;
  }

  .media-viewer-next {
    right: 8px;
  }

  .media-viewer-counter {
    bottom: 58px;
    right: 12px;
  }

  .media-viewer-close {
    top: 8px;
    right: 8px;
  }
}
`

function ensureMediaViewerStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('media-viewer-styles')) return

  const el = document.createElement('style')
  el.id = 'media-viewer-styles'
  el.textContent = MEDIA_VIEWER_CSS
  document.head.appendChild(el)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MediaViewer({
  isOpen,
  onClose,
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  mediaAlt,
  title,
  caption,
  showControls = true,
  onNext,
  onPrevious,
  currentIndex = 0,
  totalItems = 0,
}) {
  const touchStartX = useRef(null)

  const hasNavigation = totalItems > 1 && onNext && onPrevious

  useEffect(() => {
    ensureMediaViewerStyles()
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
      if (hasNavigation && event.key === 'ArrowRight') {
        event.preventDefault()
        onNext()
      }
      if (hasNavigation && event.key === 'ArrowLeft') {
        event.preventDefault()
        onPrevious()
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, onNext, onPrevious, hasNavigation])

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || !hasNavigation) {
      touchStartX.current = null
      return
    }

    const touchEndX = event.changedTouches[0].clientX
    const difference = touchStartX.current - touchEndX

    if (Math.abs(difference) > 50) {
      if (difference > 0) onNext()
      else onPrevious()
    }

    touchStartX.current = null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="media-viewer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Media viewer'}
        >
          <motion.div
            className="media-viewer-modal"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="media-viewer-close"
              aria-label="Close media viewer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <div
              className="media-viewer-media"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {mediaType === 'video' && mediaSrc ? (
                <VideoPlayer
                  key={mediaSrc}
                  videoSrc={mediaSrc}
                  posterSrc={posterSrc}
                  title={title || 'Showreel'}
                  controls={showControls}
                  showVolumeControls={true}
                  playsInline
                  aspectRatio="16/9"
                />
              ) : mediaSrc ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mediaSrc}
                    src={mediaSrc}
                    alt={mediaAlt || title || 'Enlarged media frame'}
                    className="media-viewer-image"
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
              ) : null}
            </div>

            {hasNavigation && (
              <>
                <button
                  type="button"
                  className="media-viewer-nav media-viewer-prev"
                  onClick={onPrevious}
                  aria-label="Previous image"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="media-viewer-nav media-viewer-next"
                  onClick={onNext}
                  aria-label="Next image"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                <div className="media-viewer-counter">
                  {currentIndex + 1} / {totalItems}
                </div>
              </>
            )}

            {(title || caption) && (
              <div className="media-viewer-content">
                {caption && (
                  <p className="media-viewer-caption">{caption}</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}