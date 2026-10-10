import React, { useState } from 'react'
import { urlFor } from '../../libs/sanity.js'

export default function MediaImage({
  image,
  src,
  alt = 'Fedworks cinematography still',
  aspectRatio = '16/9',
  className = '',
  loading = 'lazy',
  priority = false,
  style = {},
  width = 1600,
  quality = 82,
  sizes = '100vw',
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const transformedImageUrl = image
    ? urlFor(image)
      ?.width(width)
      .quality(quality)
      .auto('format')
      .url()
    : ''

  const resolvedSrc =
    src ||
    transformedImageUrl ||
    '/placeholders/placeholder-01.svg'

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio,
        backgroundColor: 'var(--color-black-soft)',
        ...style,
      }}
      className={`media-image-holder ${className}`}
    >
      {!hasError && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0.2,
            transition:
              'opacity 0.4s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}

      {hasError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(243, 240, 232, 0.4)',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
          }}
        >
          [ FRAME ARCHIVED ]
        </div>
      )}
    </div>
  )
}