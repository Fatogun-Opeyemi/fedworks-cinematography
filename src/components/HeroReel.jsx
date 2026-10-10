
import React, { useRef, useState } from 'react'
import Reveal from './Reveal.jsx'

export default function HeroReel({
  videoSrc = '',
  posterSrc = '',
  onWatchReel,
}) {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const showVideo = Boolean(videoSrc) && !videoFailed

  const handleVideoError = () => {
    setVideoFailed(true)
    setVideoReady(false)
  }

  const handleVideoPlaying = () => {
    setVideoReady(true)
  }

  return (
    <section
      className="hero-reel-section"
      aria-label="Hero Showreel"
    >
      {/* High-priority poster: present in the initial rendered markup */}
      {posterSrc && (
        <img
          src={posterSrc}
          alt=""
          className="hero-reel-poster"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          aria-hidden="true"
        />
      )}

      {/* Video sits above the poster once playback begins */}
      {showVideo && (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc || undefined}
          autoPlay
          muted
          loop
          playsInline
          // preload="metadata"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={handleVideoPlaying}
          onError={handleVideoError}
          className={`hero-reel-video${videoReady ? ' is-ready' : ''}`}
          aria-hidden="true"
        />
      )}

      <div
        className="hero-reel-overlay"
        aria-hidden="true"
      />

      {/* Centered WATCH REEL control */}
      <div className="hero-controls-layer">
        <div className="hero-controls-cluster">
          <Reveal delay={0.12}>
            <div className="hero-controls-row">
              {onWatchReel && (
                <button
                  type="button"
                  onClick={onWatchReel}
                  className="hero-reel-action"
                  aria-label="Watch showreel"
                >
                  <span
                    className="hero-play-icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      focusable="false"
                      aria-hidden="true"
                    >
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </span>

                  <span className="hero-action-label">
                    WATCH REEL
                  </span>
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Preserve the existing hero content layout */}
      <div className="hero-reel-content">
        <div className="site-container">
          <div className="hero-reel-grid">
            {/* Keep your existing identity content here, if any */}
          </div>
        </div>
      </div>


      <style>{`
  .hero-reel-section {
    position: relative;
    isolation: isolate;
  }

  .hero-reel-poster,
  .hero-reel-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-reel-poster {
    z-index: 0;
  }

  .hero-reel-video {
    z-index: 1;
    opacity: 0;
    transition: opacity 250ms ease;
  }

  .hero-reel-video.is-ready {
    opacity: 1;
  }

  .hero-reel-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .hero-reel-content {
    position: relative;
    z-index: 3;
  }

  /* WATCH REEL — bottom-right of the hero */
  .hero-controls-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0 max(24px, calc((100vw - 1200px) / 2)) 40px;
    pointer-events: none;
  }

  .hero-controls-cluster {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .hero-controls-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.9rem;
    pointer-events: auto;
  }

  .hero-reel-action {
    position: static;
    transform: none;
    margin: 0;
    padding: 10px 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    background: transparent;
    color: #F2F0EB;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    cursor: pointer;
    opacity: 0.85;
    transition: opacity 200ms ease;
  }

  .hero-reel-action:hover {
    opacity: 1;
  }

  .hero-reel-action:focus-visible {
    outline: 1px solid #F2F0EB;
    outline-offset: 5px;
  }

  .hero-reel-action svg {
    display: block;
    width: 0.7rem;
    height: 0.7rem;
  }

  /* Mobile positioning */
  @media (max-width: 767px) {
    .hero-controls-layer {
      padding: 0 24px 24px;
    }
  }

  /* Reduced motion accessibility */
  @media (prefers-reduced-motion: reduce) {
    .hero-reel-video,
    .hero-reel-action {
      transition: none;
    }
  }
`}</style>
    </section>
  )
}