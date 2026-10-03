import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { videoCoordinator } from './videoCoordinator.js'
import Reveal from '../Reveal.jsx'

export default function MediaSquareCard({ project, delay = 0 }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const hasVideo = Boolean(project.videoUrl)
  const posterUrl = project.posterUrl || project.poster || project.thumbnailUrl || project.thumbnail || ''

  // Register with global video coordinator
  useEffect(() => {
    const videoEl = videoRef.current
    if (videoEl) {
      videoCoordinator.register(videoEl)
    }
    return () => {
      if (videoEl) videoCoordinator.unregister(videoEl)
    }
  }, [hasVideo])

  // Pause video automatically when leaving viewport
  useEffect(() => {
    if (!hasVideo) return
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [hasVideo])

  const togglePlay = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const videoEl = videoRef.current
    if (!videoEl) return

    if (videoEl.paused) {
      videoCoordinator.notifyPlay(videoEl)
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      videoEl.pause()
      setIsPlaying(false)
    }
  }

  const toggleSound = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const videoEl = videoRef.current
    if (!videoEl) return

    const nextMuted = !videoEl.muted
    videoEl.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <Reveal delay={delay}>
      <article
        ref={containerRef}
        className="media-square-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Uniform 1:1 Aspect Ratio Media Container */}
        <div
          className="square-media-box"
          onClick={hasVideo ? togglePlay : undefined}
          style={{ cursor: hasVideo ? 'pointer' : 'default' }}
        >
          {/* Real Cover Image (Displayed when idle or paused) */}
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={project.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="square-media-asset"
              style={{
                display: isPlaying ? 'none' : 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              className="square-media-asset"
              style={{
                display: isPlaying ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-black-soft)',
                color: 'rgba(243, 240, 232, 0.4)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {project.title}
            </div>
          )}

          {/* In-page Video Player (Active when playing) */}
          {hasVideo && (
            <video
              ref={videoRef}
              src={project.videoUrl}
              poster={posterUrl}
              preload="none"
              playsInline
              muted={isMuted}
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="square-media-asset"
              style={{
                display: isPlaying ? 'block' : 'none',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              aria-label={`${project.title} video`}
            />
          )}

          {/* Controls overlay for video cards */}
          {hasVideo && (
            <div className="square-media-controls" onClick={(e) => e.stopPropagation()}>
              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="square-ctrl-btn"
                aria-label={isPlaying ? `Pause ${project.title}` : `Play ${project.title}`}
              >
                {isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                )}
              </button>

              {/* Volume / Sound Toggle Button */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={toggleSound}
                  className="square-ctrl-btn"
                  aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
                >
                  {isMuted ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Category Tag Overlay */}
          <div className="square-category-tag">
            {project.categoryLabel || project.category}
          </div>
        </div>

        {/* Concise Production Metadata */}
        <div className="square-meta-box">
          <h3 className="square-project-title">
            <Link to={`/work/${project.slug?.current || project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <div className="square-project-line">
            <span>{project.categoryLabel || project.category}</span>
            {project.clientOrArtist && (
              <>
                <span className="meta-separator">·</span>
                <span>{project.clientOrArtist}</span>
              </>
            )}
          </div>

          <div className="square-project-subline tabular-nums">
            {project.location && <span>{project.location}</span>}
            {project.location && project.dateFormatted && (
              <span className="meta-separator">·</span>
            )}
            {project.dateFormatted && <span>{project.dateFormatted}</span>}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
