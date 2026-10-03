import React, { useRef, useState } from 'react'

export default function VideoPlayer({
  videoSrc,
  posterSrc,
  aspectRatio = '16/9',
  title = 'Cinematography sequence',
  className = '',
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      // Pause any other playing videos on the page
      document.querySelectorAll('video').forEach((v) => {
        if (v !== videoRef.current) {
          v.pause()
        }
      })
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div
      className={`video-player-container ${className}`}
      style={{ aspectRatio }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={videoSrc || undefined}
        poster={posterSrc}
        preload="none"
        playsInline
        controls={isPlaying}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        className="video-element"
        aria-label={title}
      />

      {!isPlaying && (
        <button
          type="button"
          className="video-overlay-play-btn"
          aria-label={`Play ${title}`}
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      )}
    </div>
  )
}
