// import React, { useEffect } from 'react'
// import { motion, AnimatePresence } from 'motion/react'

// export default function MediaViewer({ isOpen, onClose, mediaSrc, mediaAlt, title, caption }) {
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') onClose()
//     }

//     if (isOpen) {
//       window.addEventListener('keydown', handleKeyDown)
//       document.body.classList.add('menu-open')
//     }

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown)
//       document.body.classList.remove('menu-open')
//     }
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   return (
//     <AnimatePresence>
//       <div
//         className="media-viewer-backdrop"
//         onClick={onClose}
//         role="dialog"
//         aria-modal="true"
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.97 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.97 }}
//           transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
//           className="media-viewer-modal"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             onClick={onClose}
//             className="media-viewer-close"
//             aria-label="Close media viewer"
//           >
//             ✕
//           </button>

//           <div className="media-viewer-media">
//             <img
//               src={mediaSrc}
//               alt={mediaAlt || title || 'Enlarged media frame'}
//               style={{ width: '100%', height: '100%', objectFit: 'contain' }}
//               referrerPolicy="no-referrer"
//             />
//           </div>

//           {(title || caption) && (
//             <div className="media-viewer-content">
//               {title && <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem' }}>{title}</h3>}
//               {caption && <p style={{ fontSize: '0.875rem', color: 'rgba(10, 10, 10, 0.65)', fontWeight: 300 }}>{caption}</p>}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   )
// }

import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import VideoPlayer from './VideoPlayer.jsx'

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
}) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="media-viewer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Media viewer'}
        >
          <motion.div
            className="media-viewer-modal"
            initial={{
              opacity: 0,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.985,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
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

            <div className="media-viewer-media">
              {mediaType === 'video' && mediaSrc ? (
                <VideoPlayer
                  videoSrc={mediaSrc}
                  posterSrc={posterSrc}
                  title={title || 'Showreel'}
                  controls={true}
                  showVolumeControls={false}
                  muted
                  playsInline
                  aspectRatio="16/9"
                />
              ) : mediaSrc ? (
                <img
                  src={mediaSrc}
                  alt={
                    mediaAlt ||
                    title ||
                    'Enlarged media frame'
                  }
                  className="media-viewer-image"
                  referrerPolicy="no-referrer"
                />
              ) : null}
            </div>

            {(title || caption) && (
              <div className="media-viewer-content">
                {/* {title && (
                  <h3 className="media-viewer-title">
                    {title}
                  </h3>
                )} */}

                {caption && (
                  <p className="media-viewer-caption">
                    {caption}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          <style>{`
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
              overflow: hidden;
              background: #050505;
              box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
            }

            .media-viewer-media {
              width: 100%;
              min-height: 0;
              background: #000;
            }

            .media-viewer-image {
              display: block;
              width: 100%;
              max-height: calc(100vh - 120px);
              object-fit: contain;
              background: #000;
            }

            .media-viewer-close {
              position: absolute;
              top: 12px;
              right: 12px;
              z-index: 30;
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

            .media-viewer-content {
              flex: 0 0 auto;
              padding: 14px 18px 16px;
              background: #050505;
              color: #fff;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
            }

            .media-viewer-title {
              margin: 0;
              font-size: 0.9rem;
              line-height: 1.3;
              font-weight: 500;
            }

            .media-viewer-caption {
              margin: 4px 0 ;
              color: rgba(255, 255, 255, 0.55);
              font-size: 0.7rem;
              line-height: 1.5;
              letter-spacing: 0.04em;
            }

            

              .media-viewer-modal {
                width: 100%;
                max-height: 100vh;
              }

              .media-viewer-close {
                top: 10px;
                right: 10px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}