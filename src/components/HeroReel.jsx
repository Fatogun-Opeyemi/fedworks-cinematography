import React, { useRef, useState } from 'react'
import Reveal from './Reveal.jsx'

export default function HeroReel({
  videoSrc = '',
  posterSrc = '',
  onWatchReel,
}) {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)

  const showVideo = Boolean(videoSrc) && !videoFailed

  const toggleSound = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)

    const videoEl = videoRef.current
    if (!videoEl) return

    // Apply immediately, and resume playback if autoplay had been blocked.
    videoEl.muted = nextMuted
    if (videoEl.paused) {
      videoEl.play().catch(() => {
        // Playback blocked — the poster stays visible, no error surfaced.
      })
    }
  }

  const handleVideoError = () => {
    setVideoFailed(true)
    setIsMuted(true)
  }

  return (
    <section className="hero-reel-section" aria-label="Hero Showreel">
      {showVideo ? (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc || undefined}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onError={handleVideoError}
          className="hero-reel-video"
          aria-hidden="true"
        />
      ) : (
        /* Fallback only: keeps the composition intact if the reel cannot be decoded. */
        posterSrc ? (
          <img
            src={posterSrc}
            alt=""
            className="hero-reel-fallback-poster"
            aria-hidden="true"
          />
        ) : null
      )}

      {/* Readability overlay, layered above the media and below the content. */}
      <div className="hero-reel-overlay" aria-hidden="true" />

      {/* Hero content — the single dominant brand presentation */}
      <div className="hero-reel-content">
        <div className="site-container">
          <div className="hero-reel-grid">
            {/* Exactly ONE FEDWORKS + DIRECTOR OF PHOTOGRAPHY close together */}
            <Reveal delay={0.05}>
              <div className="hero-identity-lockup">
                <h1 className="hero-identity-title">
                  FEDWORKS
                </h1>
                <div className="hero-identity-role">
                  <span className="role-accent-dot" aria-hidden="true" />
                  <span className="role-text">DIRECTOR OF PHOTOGRAPHY</span>
                </div>
              </div>
            </Reveal>

            {/* Controls share one aligned row with the identity lockup */}
            <div className="hero-controls-cluster">
              {onWatchReel && (
                <Reveal delay={0.12}>
                  <button
                    type="button"
                    onClick={onWatchReel}
                    className="hero-reel-action"
                    aria-label="Play showreel full-screen"
                  >
                    <span className="hero-play-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    </span>
                    <span className="hero-action-label">WATCH REEL</span>
                  </button>
                </Reveal>
              )}

              {showVideo && (
                <Reveal delay={0.16}>
                  <button
                    type="button"
                    onClick={toggleSound}
                    className={`hero-sound-control-btn ${isMuted ? 'is-muted' : 'is-unmuted'}`}
                    aria-pressed={!isMuted}
                    aria-label={isMuted ? 'Turn showreel sound on' : 'Turn showreel sound off'}
                  >
                    {isMuted ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </button>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
