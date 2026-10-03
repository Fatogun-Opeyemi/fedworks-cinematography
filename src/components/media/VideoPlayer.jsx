import React, { useRef, useState, useEffect } from 'react'
import { videoCoordinator } from './videoCoordinator.js'

export default function VideoPlayer({
  videoSrc,
  posterSrc,
  aspectRatio = '16/9',
  title = 'Cinematography sequence',
  controls = true,
  muted = false,
  loop = false,
  autoPlay = false,
  className = '',
  onPlay,
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const videoEl = videoRef.current
    if (videoEl) {
      videoCoordinator.register(videoEl)
    }
    return () => {
      if (videoEl) videoCoordinator.unregister(videoEl)
    }
  }, [])

  const handleToggle = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (videoEl.paused) {
      videoCoordinator.notifyPlay(videoEl)
      videoEl
        .play()
        .then(() => {
          setIsPlaying(true)
          if (onPlay) onPlay()
        })
        .catch(() => {
          setIsPlaying(false)
        })
    } else {
      videoEl.pause()
      setIsPlaying(false)
    }
  }

  const handlePlayEvent = () => {
    if (videoRef.current) videoCoordinator.notifyPlay(videoRef.current)
    setIsPlaying(true)
    if (onPlay) onPlay()
  }

  const handlePauseEvent = () => {
    setIsPlaying(false)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        backgroundColor: 'var(--color-black)',
        overflow: 'hidden',
        cursor: isPlaying ? 'default' : 'pointer',
      }}
      className={`video-player-root ${className}`}
      onClick={!isPlaying ? handleToggle : undefined}
    >
      {!hasError ? (
        <video
          ref={videoRef}
          src={videoSrc || undefined}
          poster={posterSrc}
          preload="none"
          playsInline
          muted={muted}
          loop={loop}
          controls={controls && isPlaying}
          onPlay={handlePlayEvent}
          onPause={handlePauseEvent}
          onEnded={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          aria-label={title}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(243, 240, 232, 0.4)',
            fontSize: '0.8125rem',
          }}
        >
          [ Video Media Offline ]
        </div>
      )}

      {!isPlaying && !hasError && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleToggle()
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            color: 'var(--color-off-white)',
            border: '1px solid rgba(243, 240, 232, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
          }}
          aria-label={`Play ${title}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-red)'
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.8)'
            e.currentTarget.style.transform = 'translate(-50%, -50%)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      )}
    </div>
  )
}
