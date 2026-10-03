import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import MediaImage from './media/MediaImage.jsx'

export default function MusicRail({ items = [] }) {
  const scrollRef = useRef(null)
  const isReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Auto-scroll loop (~40px/sec)
  useEffect(() => {
    if (isReducedMotion || isHovered || isDragging) return

    let animationFrameId
    let lastTime = performance.now()

    const step = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 40 * delta
        // Seamless loop wrap when reaching near the end
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
        ) {
          scrollRef.current.scrollLeft = 0
        }
      }
      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isReducedMotion, isHovered, isDragging])

  // Mouse Drag Handlers
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
      scrollRef.current.scrollLeft += 240
    } else if (e.key === 'ArrowLeft') {
      scrollRef.current.scrollLeft -= 240
    }
  }

  // Quadruple items to allow continuous smooth linear scrolling
  const displayItems = [...items, ...items, ...items, ...items]

  return (
    <div
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Music videos interactive media rail. Use left and right arrow keys to navigate."
    >
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          paddingLeft: 'var(--site-gutter)',
          paddingRight: 'var(--site-gutter)',
        }}
      >
        {displayItems.map((item, index) => (
          <div key={`${item._id}-${index}`} className="music-rail-item">
            <Link
              to={`/work/${item.slug?.current || item.slug || ''}`}
              draggable={false}
              style={{ display: 'block' }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: 'var(--color-black-soft)' }}>
                <MediaImage
                  image={item.poster}
                  src={item.poster?.asset?.url || item.poster}
                  alt={item.title}
                  aspectRatio="16/9"
                />
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(243, 240, 232, 0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {item.year || '2024'} · Music Video
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-off-white)', marginTop: '0.2rem' }}>
                  {item.title}
                </h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
