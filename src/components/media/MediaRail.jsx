import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'

const AUTO_SCROLL_SPEED = 120
const DRAG_MULTIPLIER = 1.5
const KEYBOARD_STEP = 280

export default function MediaRail({
  items = [],
  title = 'Featured Frames',
  kicker = 'Visual Motion',
  seeAllLink = '/work',
  seeAllText = 'View Archive →',
  homeMode = false,
}) {
  const scrollRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastTimeRef = useRef(0)
  const setWidthRef = useRef(0)

  const videoRefs = useRef({})

  const isReducedMotion = useReducedMotion()

  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [playingVideoId, setPlayingVideoId] =
    useState(null)

  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
  })

  /*
   * Three copies create enough material on either side
   * for the invisible continuous loop.
   */
  const displayItems =
    items.length > 0
      ? [...items, ...items, ...items]
      : []

  /*
   * Resolve the project's video URL from the data returned
   * by Sanity.
   *
   * Supports the common shapes used by the existing project.
   */
  const getVideoSrc = (item) => {
    if (!item) {
      return ''
    }

    return (
      item.videoUrl ||
      item.video?.asset?.url ||
      item.video?.url ||
      item.media?.video?.asset?.url ||
      item.media?.video?.url ||
      item.media?.asset?.url ||
      item.media?.url ||
      ''
    )
  }

  /*
   * Resolve the poster/image used for the media.
   */
  const getPosterSrc = (item) => {
    if (!item) {
      return ''
    }

    return (
      item.posterUrl ||
      item.poster?.asset?.url ||
      item.poster ||
      item.image?.asset?.url ||
      item.image ||
      item.coverMedia?.asset?.url ||
      item.coverMedia?.url ||
      ''
    )
  }

  /*
   * Some Sanity schemas return category as an array.
   * Keep the existing behavior without changing the data.
   */
  const getCategoryLabel = (item) => {
    if (!item) {
      return 'Frame'
    }

    if (item.categoryLabel) {
      return item.categoryLabel
    }

    if (Array.isArray(item.category)) {
      return item.category.join(' · ')
    }

    return item.category || 'Frame'
  }

  /*
   * Measure exactly one complete copy of the items.
   */
  const measureSetWidth = useCallback(() => {
    const track = scrollRef.current

    if (!track || items.length === 0) {
      return 0
    }

    const cards = track.children

    if (cards.length <= items.length) {
      return 0
    }

    const firstCard = cards[0]
    const firstCardOfSecondSet = cards[items.length]

    if (!firstCard || !firstCardOfSecondSet) {
      return 0
    }

    const width =
      firstCardOfSecondSet.offsetLeft -
      firstCard.offsetLeft

    setWidthRef.current = width

    return width
  }, [items.length])

  /*
   * Start in the middle copy.
   */
  useEffect(() => {
    if (!scrollRef.current || !items.length) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const setWidth = measureSetWidth()

      if (!setWidth || !scrollRef.current) {
        return
      }

      scrollRef.current.scrollLeft = setWidth
    })

    return () => cancelAnimationFrame(frame)
  }, [items.length, measureSetWidth])

  /*
   * Invisible loop/recycling.
   *
   * When the user reaches either side of the middle copy,
   * shift by exactly one complete copy.
   *
   * Because the adjacent copy is identical, the visual
   * position remains continuous.
   */
  const recyclePosition = useCallback(() => {
    const track = scrollRef.current
    const setWidth =
      setWidthRef.current || measureSetWidth()

    if (!track || !setWidth) {
      return
    }

    const current = track.scrollLeft

    if (current >= setWidth * 2) {
      track.scrollLeft = current - setWidth
      return
    }

    if (current < setWidth) {
      track.scrollLeft = current + setWidth
    }
  }, [measureSetWidth])

  /*
   * Responsive recalculation.
   */
  useEffect(() => {
    const handleResize = () => {
      const track = scrollRef.current

      if (!track || !items.length) {
        return
      }

      const oldSetWidth = setWidthRef.current
      const newSetWidth = measureSetWidth()

      if (
        oldSetWidth &&
        newSetWidth &&
        track.scrollLeft > 0
      ) {
        const relativePosition =
          track.scrollLeft / oldSetWidth

        track.scrollLeft =
          relativePosition * newSetWidth
      }
    }

    window.addEventListener(
      'resize',
      handleResize
    )

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      )
  }, [items.length, measureSetWidth])

  /*
   * Continuous automatic movement.
   */
  useEffect(() => {
    if (
      isReducedMotion ||
      isHovered ||
      isDragging ||
      !items.length
    ) {
      return
    }

    const step = (now) => {
      const track = scrollRef.current

      if (!track) {
        return
      }

      if (!lastTimeRef.current) {
        lastTimeRef.current = now
      }

      const delta = Math.min(
        (now - lastTimeRef.current) / 1000,
        0.1
      )

      lastTimeRef.current = now

      track.scrollLeft +=
        AUTO_SCROLL_SPEED * delta

      recyclePosition()

      animationFrameRef.current =
        requestAnimationFrame(step)
    }

    lastTimeRef.current = performance.now()

    animationFrameRef.current =
      requestAnimationFrame(step)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        )
      }

      animationFrameRef.current = null
      lastTimeRef.current = 0
    }
  }, [
    isReducedMotion,
    isHovered,
    isDragging,
    items.length,
    recyclePosition,
  ])

  /*
   * Normalize native/manual scrolling.
   */
  useEffect(() => {
    const track = scrollRef.current

    if (!track || !items.length) {
      return
    }

    let timeoutId = null

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        recyclePosition()
      }, 20)
    }

    track.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    )

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      track.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [items.length, recyclePosition])

  /*
   * Pause every video except the selected one.
   */
  const pauseOtherVideos = (videoId) => {
    Object.entries(videoRefs.current).forEach(
      ([id, video]) => {
        if (
          id !== String(videoId) &&
          video
        ) {
          video.pause()
        }
      }
    )
  }

  /*
   * Play/pause the selected homepage video.
   */
  const toggleVideo = async (videoId) => {
    const video =
      videoRefs.current[String(videoId)]

    if (!video) {
      return
    }

    if (!video.paused) {
      video.pause()
      setPlayingVideoId(null)
      return
    }

    pauseOtherVideos(videoId)

    try {
      await video.play()
      setPlayingVideoId(String(videoId))
    } catch {
      setPlayingVideoId(null)
    }
  }

  /*
   * Mouse dragging.
   */
  const handleMouseDown = (event) => {
    const track = scrollRef.current

    if (!track) {
      return
    }

    dragStateRef.current = {
      active: true,
      startX:
        event.pageX - track.offsetLeft,
      startScrollLeft:
        track.scrollLeft,
    }

    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    const track = scrollRef.current
    const dragState = dragStateRef.current

    if (!track || !dragState.active) {
      return
    }

    event.preventDefault()

    const x =
      event.pageX - track.offsetLeft

    const walk =
      (x - dragState.startX) *
      DRAG_MULTIPLIER

    track.scrollLeft =
      dragState.startScrollLeft - walk

    recyclePosition()
  }

  const stopDragging = () => {
    dragStateRef.current.active = false
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    stopDragging()
    setIsHovered(false)
  }

  /*
   * Keyboard navigation.
   */
  const handleKeyDown = (event) => {
    const track = scrollRef.current

    if (!track) {
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      track.scrollLeft += KEYBOARD_STEP
      recyclePosition()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      track.scrollLeft -= KEYBOARD_STEP
      recyclePosition()
    }
  }

  if (!items.length) {
    return null
  }

  return (
    <section
      className={`media-rail-section ${homeMode ? 'media-rail-home' : ''
        }`}
      aria-label={title}
    >
      <div className="site-container">
        <div className="media-rail-header">
          <div>
            {kicker && (
              <div className="section-kicker">
                <span
                  className="section-kicker-dot"
                  aria-hidden="true"
                />
                <span>{kicker}</span>
              </div>
            )}

            <h2 className="media-rail-heading">
              {title}
            </h2>
          </div>

          {seeAllLink && (
            <Link
              to={seeAllLink}
              className="media-rail-link"
            >
              {seeAllText}
            </Link>
          )}
        </div>
      </div>

      <div
        className="media-rail-viewport"
        onMouseEnter={() =>
          setIsHovered(true)
        }
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Controllable horizontal media carousel. Use touch, drag or arrow keys."
      >
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={() => {
            if (
              dragStateRef.current.active
            ) {
              stopDragging()
            }
          }}
          className={`media-rail-track ${isDragging
            ? 'is-dragging'
            : ''
            }`}
        >
          {displayItems.map(
            (item, idx) => {
              const posterSrc =
                getPosterSrc(item)

              const videoSrc =
                getVideoSrc(item)

              const isVideo =
                Boolean(videoSrc)

              const projectUrl =
                item.slug
                  ? `/work/${item.slug.current ||
                  item.slug
                  }`
                  : '/work'

              const itemId = String(
                item._id || idx
              )

              const titleText =
                item.title ||
                item.caption ||
                ''

              const artistOrClient =
                item.clientOrArtist ||
                item.artist ||
                item.client ||
                item.organisation ||
                item.organization ||
                ''

              const isPlaying =
                playingVideoId === itemId

              return (
                <div
                  key={`${itemId}-${idx}`}
                  className="media-rail-card"
                >
                  <Link
                    to={projectUrl}
                    draggable={false}
                    className="media-rail-anchor"
                    onDragStart={(event) =>
                      event.preventDefault()
                    }
                  >
                    <div className="media-rail-square">
                      {isVideo ? (
                        <video
                          ref={(element) => {
                            if (element) {
                              videoRefs.current[
                                itemId
                              ] = element
                            } else {
                              delete videoRefs.current[
                                itemId
                              ]
                            }
                          }}
                          src={videoSrc}
                          poster={posterSrc}
                          muted
                          playsInline
                          preload="metadata"
                          className="media-rail-img media-rail-video"
                          onPlay={() => {
                            setPlayingVideoId(
                              itemId
                            )
                          }}
                          onPause={() => {
                            setPlayingVideoId(
                              (current) =>
                                current ===
                                  itemId
                                  ? null
                                  : current
                            )
                          }}
                          onEnded={() => {
                            setPlayingVideoId(
                              (current) =>
                                current ===
                                  itemId
                                  ? null
                                  : current
                            )
                          }}
                          draggable={false}
                        />
                      ) : (
                        <img
                          src={posterSrc}
                          alt={
                            titleText ||
                            'Cinematography frame'
                          }
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="media-rail-img"
                          draggable={false}
                        />
                      )}

                      {!homeMode && (
                        <div className="media-rail-badge">
                          {getCategoryLabel(item)}
                        </div>
                      )}

                      {homeMode && isVideo && (
                        <button
                          type="button"
                          className={`media-rail-play ${isPlaying
                            ? 'is-playing'
                            : ''
                            }`}
                          aria-label={
                            isPlaying
                              ? `Pause ${titleText ||
                              'video'
                              }`
                              : `Play ${titleText ||
                              'video'
                              }`
                          }
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()

                            toggleVideo(
                              itemId
                            )
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                          }}
                        >
                          {isPlaying ? (
                            <span
                              className="media-rail-pause-icon"
                              aria-hidden="true"
                            >
                              <span />
                              <span />
                            </span>
                          ) : (
                            <span
                              className="media-rail-play-icon"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      )}

                      {homeMode && (
                        <div className="media-rail-home-details">
                          {titleText && (
                            <div className="media-rail-home-title">
                              {titleText}
                            </div>
                          )}

                          {artistOrClient && (
                            <div className="media-rail-home-client">
                              {artistOrClient}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!homeMode && (
                      <div className="media-rail-meta">
                        <div className="media-rail-title">
                          {titleText}
                        </div>

                        <div className="media-rail-subline tabular-nums">
                          {item.location ||
                            item.clientOrArtist ||
                            'International'}

                          {item.dateFormatted
                            ? ` · ${item.dateFormatted}`
                            : ''}
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}