import React, { useState } from 'react'

export default function MediaImage({
  src,
  alt = 'Fedworks cinematography image',
  aspectRatio = '16/9',
  className = '',
  loading = 'lazy',
  priority = false,
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio,
        backgroundColor: 'var(--color-black-soft)',
      }}
      className={className}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0.4,
            transition: 'opacity 0.4s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}

      {error && (
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
          [ Media Unavailable ]
        </div>
      )}
    </div>
  )
}
