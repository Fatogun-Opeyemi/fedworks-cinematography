import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'

export default function MediaRail({
  items = [],
  title = 'Featured Frames',
  kicker = 'Visual Motion',
  seeAllLink = '/work',
  seeAllText = 'View Archive →',
}) {
  const scrollRef = useRef(null)
  const isReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Gentle subtle automatic sliding motion (~32px/sec)
  useEffect(() => {
    if (isReducedMotion || isHovered || isDragging) return

    let animationFrameId
    let lastTime = performance.now()

    const step = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 32 * delta
        // Reset when reaching end
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 5
        ) {
          scrollRef.current.scrollLeft = 0
        }
      }
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isReducedMotion, isHovered, isDragging])

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovered(false)
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!scrollRef.current) return
    if (e.key === 'ArrowRight') {
      scrollRef.current.scrollLeft += 280
    } else if (e.key === 'ArrowLeft') {
      scrollRef.current.scrollLeft -= 280
    }
  }

  // Repeat items for continuous sliding
  const displayItems = items.length > 0 ? [...items, ...items, ...items] : []

  return (
    <section className="media-rail-section" aria-label={title}>
      <div className="site-container">
        <div className="media-rail-header">
          <div>
            {kicker && (
              <div className="section-kicker">
                <span className="section-kicker-dot" aria-hidden="true" />
                <span>{kicker}</span>
              </div>
            )}
            <h2 className="media-rail-heading">{title}</h2>
          </div>

          {seeAllLink && (
            <Link to={seeAllLink} className="media-rail-link">
              {seeAllText}
            </Link>
          )}
        </div>
      </div>

      {/* Controllable Track */}
      <div
        className="media-rail-viewport"
        onMouseEnter={() => setIsHovered(true)}
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
          onMouseUp={handleMouseUp}
          className={`media-rail-track ${isDragging ? 'is-dragging' : ''}`}
        >
          {displayItems.map((item, idx) => {
            const posterSrc =
              item.posterUrl ||
              item.poster?.asset?.url ||
              item.poster ||
              item.image?.asset?.url ||
              item.image ||
              ''

            const projectUrl = item.slug
              ? `/work/${item.slug.current || item.slug}`
              : '/work'

            return (
              <div key={`${item._id || idx}-${idx}`} className="media-rail-card">
                <Link to={projectUrl} draggable={false} className="media-rail-anchor">
                  <div className="media-rail-square">
                    <img
                      src={posterSrc}
                      alt={item.title || item.caption || 'Cinematography frame'}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="media-rail-img"
                    />
                    <div className="media-rail-badge">
                      {item.categoryLabel || item.category || 'Frame'}
                    </div>
                  </div>

                  <div className="media-rail-meta">
                    <div className="media-rail-title">{item.title || item.caption}</div>
                    <div className="media-rail-subline tabular-nums">
                      {item.location || item.clientOrArtist || 'International'}
                      {item.dateFormatted ? ` · ${item.dateFormatted}` : ''}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
