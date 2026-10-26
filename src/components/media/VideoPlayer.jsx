import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { videoCoordinator } from './videoCoordinator.js'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const totalSeconds = Math.floor(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      secs,
    ).padStart(2, '0')}`
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`
}

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    videoSrc = '',
    posterSrc = '',
    aspectRatio = '16/9',
    title = 'Cinematography sequence',
    controls = true,
    showVolumeControls = true,
    muted = false,
    loop = false,
    autoPlay = false,
    playsInline = true,
    preload = 'metadata',
    className = '',
    onPlay,
    onPause,
    onEnded,
    onError,
  },
  forwardedRef,
) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const seekBarRef = useRef(null)
  const hideControlsTimeout = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(Boolean(muted))
  const [volume, setVolume] = useState(muted ? 0 : 1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showControls, setShowControls] = useState(true)

  /*
   * Expose the underlying <video> element to parents.
   */
  useEffect(() => {
    if (!forwardedRef) return undefined

    if (typeof forwardedRef === 'function') {
      forwardedRef(videoRef.current)

      return () => {
        forwardedRef(null)
      }
    }

    forwardedRef.current = videoRef.current

    return () => {
      forwardedRef.current = null
    }
  }, [forwardedRef])

  /*
   * Register with the FedWorks video coordinator.
   */
  useEffect(() => {
    const video = videoRef.current

    if (!video) return undefined

    videoCoordinator.register(video)

    return () => {
      videoCoordinator.unregister(video)
    }
  }, [])

  /*
   * Synchronize media properties.
   */
  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    video.muted = isMuted
    video.volume = isMuted ? 0 : volume
    video.loop = loop
  }, [isMuted, volume, loop])

  /*
   * Reset when the source changes.
   */
  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    setHasError(false)
    setIsLoaded(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    video.load()

    if (autoPlay && videoSrc) {
      video.play().catch(() => {
        // Browser autoplay policy may reject playback.
      })
    }
  }, [videoSrc, autoPlay])

  /*
   * Autoplay when requested.
   */
  useEffect(() => {
    const video = videoRef.current

    if (!video || !autoPlay || !videoSrc) {
      return undefined
    }

    const attemptAutoplay = () => {
      video.play().catch(() => {
        // Expected when autoplay is blocked.
      })
    }

    if (video.readyState >= 2) {
      attemptAutoplay()
    }

    video.addEventListener('canplay', attemptAutoplay, {
      once: true,
    })

    return () => {
      video.removeEventListener('canplay', attemptAutoplay)
    }
  }, [autoPlay, videoSrc])

  const clearHideControlsTimer = useCallback(() => {
    if (hideControlsTimeout.current) {
      window.clearTimeout(hideControlsTimeout.current)
      hideControlsTimeout.current = null
    }
  }, [])

  const scheduleHideControls = useCallback(() => {
    clearHideControlsTimer()

    if (!isPlaying) return

    hideControlsTimeout.current = window.setTimeout(() => {
      setShowControls(false)
    }, 2500)
  }, [clearHideControlsTimer, isPlaying])

  const revealControls = useCallback(() => {
    setShowControls(true)
    scheduleHideControls()
  }, [scheduleHideControls])

  useEffect(() => {
    return () => {
      clearHideControlsTimer()
    }
  }, [clearHideControlsTimer])

  /*
   * Playback.
   */
  const handlePlay = useCallback(async () => {
    const video = videoRef.current

    if (!video || hasError) return

    try {
      videoCoordinator.notifyPlay(video)
      await video.play()
    } catch {
      setIsPlaying(false)
    }
  }, [hasError])

  const handlePause = useCallback(() => {
    const video = videoRef.current

    if (!video) return

    video.pause()
  }, [])

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current

    if (!video || hasError) return

    if (video.paused) {
      handlePlay()
    } else {
      handlePause()
    }

    revealControls()
  }, [
    handlePause,
    handlePlay,
    hasError,
    revealControls,
  ])

  /*
   * Native media events.
   */
  const handlePlayEvent = useCallback(() => {
    const video = videoRef.current

    if (video) {
      videoCoordinator.notifyPlay(video)
    }

    setIsPlaying(true)
    setHasError(false)
    setShowControls(true)

    onPlay?.()

    scheduleHideControls()
  }, [onPlay, scheduleHideControls])

  const handlePauseEvent = useCallback(() => {
    setIsPlaying(false)
    setShowControls(true)
    clearHideControlsTimer()

    onPause?.()
  }, [clearHideControlsTimer, onPause])

  const handleEndedEvent = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setShowControls(true)
    clearHideControlsTimer()

    onEnded?.()
  }, [clearHideControlsTimer, onEnded])

  const handleTimeUpdateEvent = useCallback(() => {
    const video = videoRef.current

    if (!video || isSeeking) return

    setCurrentTime(video.currentTime)
  }, [isSeeking])

  const handleLoadedMetadataEvent = useCallback(() => {
    const video = videoRef.current

    if (!video) return

    setDuration(
      Number.isFinite(video.duration)
        ? video.duration
        : 0,
    )

    setCurrentTime(video.currentTime || 0)
    setIsLoaded(true)
    setHasError(false)
  }, [])

  const handleCanPlayEvent = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleWaitingEvent = useCallback(() => {
    setIsLoaded(false)
  }, [])

  // const handleErrorEvent = useCallback(
  //   (event) => {
  //     setHasError(true)
  //     setIsPlaying(false)
  //     setIsLoaded(false)
  //     setShowControls(true)

  //     onError?.(event)
  //   },
  //   [onError],
  // )

  const handleErrorEvent = useCallback(
    (event) => {
      const video = event.currentTarget
      const error = video.error

      console.error('[FEDWORKS] Video playback failed', {
        title,
        src: video.currentSrc || video.src,
        code: error?.code,
        message: error?.message || 'No browser error message',
        networkState: video.networkState,
        readyState: video.readyState,
      })

      setHasError(true)
      setIsPlaying(false)
      setIsLoaded(false)
      setShowControls(true)

      onError?.(event)
    },
    [onError, title],
  )

  /*
   * Seeking.
   */
  const seekFromClientX = useCallback(
    (clientX) => {
      const seekBar = seekBarRef.current

      if (!seekBar || !duration) return

      const rect = seekBar.getBoundingClientRect()

      if (!rect.width) return

      const percentage = Math.max(
        0,
        Math.min(
          1,
          (clientX - rect.left) / rect.width,
        ),
      )

      const newTime = percentage * duration
      const video = videoRef.current

      if (video) {
        video.currentTime = newTime
      }

      setCurrentTime(newTime)
    },
    [duration],
  )

  const handleSeekPointerDown = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      setIsSeeking(true)
      setShowControls(true)

      seekBarRef.current?.setPointerCapture?.(
        event.pointerId,
      )

      seekFromClientX(event.clientX)
    },
    [seekFromClientX],
  )

  const handleSeekPointerMove = useCallback(
    (event) => {
      if (!isSeeking) return

      event.preventDefault()

      seekFromClientX(event.clientX)
    },
    [isSeeking, seekFromClientX],
  )

  const handleSeekPointerUp = useCallback(
    (event) => {
      if (!isSeeking) return

      event.preventDefault()

      seekBarRef.current?.releasePointerCapture?.(
        event.pointerId,
      )

      setIsSeeking(false)
    },
    [isSeeking],
  )

  const handleSeekKeyDown = useCallback(
    (event) => {
      if (!duration) return

      const video = videoRef.current

      if (!video) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()

        video.currentTime = Math.max(
          0,
          video.currentTime - 5,
        )

        setCurrentTime(video.currentTime)
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()

        video.currentTime = Math.min(
          duration,
          video.currentTime + 5,
        )

        setCurrentTime(video.currentTime)
      }
    },
    [duration],
  )

  /*
   * Volume.
   */
  const handleVolumeChange = useCallback(
    (event) => {
      event.stopPropagation()

      const nextVolume = Number(event.target.value)
      const video = videoRef.current

      setVolume(nextVolume)

      if (!video) return

      video.volume = nextVolume

      if (nextVolume <= 0) {
        video.muted = true
        setIsMuted(true)
      } else {
        video.muted = false
        setIsMuted(false)
      }

      revealControls()
    },
    [revealControls],
  )

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current

    if (!video) return

    if (video.muted || video.volume === 0) {
      const restoredVolume = volume > 0 ? volume : 1

      video.muted = false
      video.volume = restoredVolume

      setVolume(restoredVolume)
      setIsMuted(false)
    } else {
      video.muted = true
      setIsMuted(true)
    }

    revealControls()
  }, [revealControls, volume])

  /*
   * Fullscreen.
   */
  const handleFullscreenToggle = useCallback(
    async () => {
      const player = playerRef.current

      if (!player) return

      try {
        if (!document.fullscreenElement) {
          if (player.requestFullscreen) {
            await player.requestFullscreen()
          } else if (player.webkitRequestFullscreen) {
            await player.webkitRequestFullscreen()
          } else if (player.msRequestFullscreen) {
            await player.msRequestFullscreen()
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            await document.msExitFullscreen()
          }
        }
      } catch {
        // Fullscreen may be rejected by the browser.
      }

      revealControls()
    },
    [revealControls],
  )

  /*
   * Keep React fullscreen state synchronized
   * with the browser's actual fullscreen state.
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement

      setIsFullscreen(
        fullscreenElement === playerRef.current,
      )
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange,
    )

    document.addEventListener(
      'webkitfullscreenchange',
      handleFullscreenChange,
    )

    document.addEventListener(
      'mozfullscreenchange',
      handleFullscreenChange,
    )

    document.addEventListener(
      'MSFullscreenChange',
      handleFullscreenChange,
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
      )

      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange,
      )

      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange,
      )

      document.removeEventListener(
        'MSFullscreenChange',
        handleFullscreenChange,
      )
    }
  }, [])

  /*
   * Keyboard controls.
   */
  const handlePlayerKeyDown = useCallback(
    (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLButtonElement
      ) {
        return
      }

      switch (event.key) {
        case ' ':
        case 'k':
        case 'K':
          event.preventDefault()
          handleTogglePlay()
          break

        case 'ArrowLeft': {
          event.preventDefault()

          const video = videoRef.current

          if (video) {
            video.currentTime = Math.max(
              0,
              video.currentTime - 5,
            )

            setCurrentTime(video.currentTime)
          }

          break
        }

        case 'ArrowRight': {
          event.preventDefault()

          const video = videoRef.current

          if (video) {
            video.currentTime = Math.min(
              duration,
              video.currentTime + 5,
            )

            setCurrentTime(video.currentTime)
          }

          break
        }

        case 'ArrowUp': {
          event.preventDefault()

          const video = videoRef.current
          const nextVolume = Math.min(
            1,
            volume + 0.1,
          )

          setVolume(nextVolume)
          setIsMuted(false)

          if (video) {
            video.volume = nextVolume
            video.muted = false
          }

          break
        }

        case 'ArrowDown': {
          event.preventDefault()

          const video = videoRef.current
          const nextVolume = Math.max(
            0,
            volume - 0.1,
          )

          setVolume(nextVolume)
          setIsMuted(nextVolume === 0)

          if (video) {
            video.volume = nextVolume
            video.muted = nextVolume === 0
          }

          break
        }

        case 'm':
        case 'M':
          event.preventDefault()
          handleMuteToggle()
          break

        case 'f':
        case 'F':
          event.preventDefault()
          handleFullscreenToggle()
          break

        default:
          break
      }
    },
    [
      duration,
      handleFullscreenToggle,
      handleMuteToggle,
      handleTogglePlay,
      volume,
    ],
  )

  const progressPercentage =
    duration > 0
      ? Math.min(
        100,
        Math.max(
          0,
          (currentTime / duration) * 100,
        ),
      )
      : 0

  /*
   * Empty state.
   */
  if (!videoSrc) {
    return (
      <div
        className={`video-player-root video-player-empty ${className}`}
        style={{ aspectRatio }}
      >
        {posterSrc && (
          <img
            src={posterSrc}
            alt=""
            className="video-player-poster"
          />
        )}
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className={`video-player-root ${isFullscreen ? 'is-fullscreen' : ''
        } ${className}`}
      style={{ aspectRatio }}
      tabIndex={0}
      role="region"
      aria-label={title}
      onKeyDown={handlePlayerKeyDown}
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
      onTouchStart={revealControls}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc || undefined}
        preload={preload}
        playsInline={playsInline}
        muted={isMuted}
        loop={loop}
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onEnded={handleEndedEvent}
        onTimeUpdate={handleTimeUpdateEvent}
        onLoadedMetadata={handleLoadedMetadataEvent}
        onCanPlay={handleCanPlayEvent}
        onWaiting={handleWaitingEvent}
        onError={handleErrorEvent}
        onClick={(event) => {
          event.stopPropagation()
          handleTogglePlay()
        }}
        className="video-player-video"
        aria-label={title}
      />

      {posterSrc && !isPlaying && !hasError && (
        <div
          className="video-player-poster-layer"
          style={{
            backgroundImage: `url("${posterSrc}")`,
          }}
          aria-hidden="true"
        />
      )}

      {!isLoaded && !hasError && (
        <div
          className="video-player-loading"
          aria-hidden="true"
        >
          <span className="video-player-spinner" />
        </div>
      )}

      {hasError && (
        <div className="video-player-error">
          <span>Video unavailable</span>
        </div>
      )}

      {!isPlaying && !hasError && (
        <button
          type="button"
          className="video-player-center-button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleTogglePlay()
          }}
          aria-label="Play video"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {controls && !hasError && (
        <div
          className={`video-player-controls ${showControls || !isPlaying
            ? 'is-visible'
            : ''
            }`}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onMouseMove={revealControls}
        >
          {/* Stylish full-width seek row */}
          <div
            ref={seekBarRef}
            className="video-player-seek"
            role="slider"
            tabIndex={0}
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            onPointerDown={handleSeekPointerDown}
            onPointerMove={handleSeekPointerMove}
            onPointerUp={handleSeekPointerUp}
            onPointerCancel={handleSeekPointerUp}
            onKeyDown={handleSeekKeyDown}
          >
            <div className="video-player-seek-track">
              <div
                className="video-player-seek-fill"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

              <div
                className="video-player-seek-thumb"
                style={{
                  left: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* Compact bottom controls */}
          <div className="video-player-controls-row">
            <div className="video-player-controls-left">
              <button
                type="button"
                className="video-player-control"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleTogglePlay()
                }}
                aria-label={
                  isPlaying
                    ? 'Pause video'
                    : 'Play video'
                }
              >
                {isPlaying ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <rect
                      x="6"
                      y="5"
                      width="4"
                      height="14"
                    />
                    <rect
                      x="14"
                      y="5"
                      width="4"
                      height="14"
                    />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {showVolumeControls && (
                <>
                  <button
                    type="button"
                    className="video-player-control"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleMuteToggle()
                    }}
                    aria-label={
                      isMuted
                        ? 'Unmute video'
                        : 'Mute video'
                    }
                  >
                    {isMuted ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line
                          x1="23"
                          y1="9"
                          x2="17"
                          y2="15"
                        />
                        <line
                          x1="17"
                          y1="9"
                          x2="23"
                          y2="15"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M19 5a9.5 9.5 0 0 1 0 14" />
                      </svg>
                    )}
                  </button>

                  <input
                    className="video-player-volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    onClick={(event) => {
                      event.stopPropagation()
                    }}
                    aria-label="Volume"
                  />
                </>
              )}
              <span className="video-player-time">
                {formatTime(currentTime)}
                {' / '}
                {formatTime(duration)}
              </span>
            </div>

            <button
              type="button"
              className="video-player-control"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handleFullscreenToggle()
              }}
              aria-label={
                isFullscreen
                  ? 'Exit fullscreen'
                  : 'Enter fullscreen'
              }
            >
              {isFullscreen ? (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 15H5v4" />
                  <path d="M5 15l5 5" />
                  <path d="M15 9h4V5" />
                  <path d="M19 9l-5-5" />
                </svg>
              ) : (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                  <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .video-player-root {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #080808;
          color: #f3f0e8;
          isolation: isolate;
          outline: none;
        }

        .video-player-root:focus-visible {
          outline: 1px solid rgba(255, 255, 255, 0.7);
          outline-offset: -1px;
        }

        /*
         * Actual fullscreen state.
         * Do not use :fullscreen here because the component
         * also explicitly tracks fullscreen with .is-fullscreen.
         */
        .video-player-root.is-fullscreen {
          width: 100vw;
          height: 100vh;
          aspect-ratio: auto !important;
          background: #000;
        }

        .video-player-root.is-fullscreen
          .video-player-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .video-player-video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #080808;
        }

        .video-player-poster-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-size: cover;
          background-position: center;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .video-player-loading {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: grid;
          place-items: center;
          pointer-events: none;
        }

        .video-player-spinner {
          width: 25px;
          height: 25px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: fedworks-video-spin 0.75s linear infinite;
        }

        .video-player-error {
          position: absolute;
          inset: 0;
          z-index: 6;
          display: grid;
          place-items: center;
          background: #080808;
          color: rgba(243, 240, 232, 0.55);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /*
         * Large centered play button.
         */
        .video-player-center-button {
          position: absolute;
          z-index: 4;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.24);
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
        }

        .video-player-center-button:hover {
          background: rgba(0, 0, 0, 0.48);
          transform: translate(-50%, -50%) scale(1.04);
        }

        /*
         * Bottom control system.
         *
         * Seek bar gets its own row.
         * Controls sit immediately underneath it.
         */
        .video-player-controls {
          position: absolute;
          z-index: 7;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0 14px 12px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.82),
            rgba(0, 0, 0, 0)
          );
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .video-player-controls.is-visible,
        .video-player-root:hover
          .video-player-controls,
        .video-player-root:focus-within
          .video-player-controls {
          opacity: 1;
          pointer-events: auto;
        }

        /*
         * Thin, stylish seek bar.
         */
        .video-player-seek {
          position: relative;
          height: 18px;
          display: flex;
          align-items: center;
          cursor: pointer;
          touch-action: none;
          outline: none;
        }

        .video-player-seek-track {
          position: relative;
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.28);
          transition: height 0.15s ease;
        }

        .video-player-seek:hover
          .video-player-seek-track {
          height: 3px;
        }

        .video-player-seek-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: #fff;
        }

        .video-player-seek-thumb {
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .video-player-seek:hover
          .video-player-seek-thumb,
        .video-player-seek:focus-visible
          .video-player-seek-thumb {
          opacity: 1;
        }

        /*
         * Bottom controls.
         */
        .video-player-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .video-player-controls-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .video-player-control {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .video-player-control:hover {
          opacity: 0.65;
        }

        .video-player-volume {
          width: 72px;
          height: 4px;
          margin: 0 3px;
          accent-color: currentColor;
          cursor: pointer;
        }

        .video-player-time {
          white-space: nowrap;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 10px;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          opacity: 0.9;
        }

        @keyframes fedworks-video-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 767px) {
          .video-player-controls {
            padding: 0 9px 9px;
          }

          .video-player-volume {
            display: none;
          }

          .video-player-time {
            font-size: 9px;
          }

          .video-player-center-button {
            width: 48px;
            height: 48px;
          }

          .video-player-control {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  )
})

export default VideoPlayer