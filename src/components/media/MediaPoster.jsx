import React from 'react'
import MediaImage from './MediaImage.jsx'

export default function MediaPoster({
  poster,
  src,
  alt = 'Cinematography project poster',
  aspectRatio = '16/9',
  category,
  className = '',
}) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-black-soft)',
        aspectRatio,
      }}
      className={`media-poster-container ${className}`}
    >
      <MediaImage
        image={poster}
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
      />

      {category && (
        <span
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(10, 10, 10, 0.88)',
            color: 'var(--color-off-white)',
            padding: '0.25rem 0.6rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          {category}
        </span>
      )}
    </div>
  )
}
