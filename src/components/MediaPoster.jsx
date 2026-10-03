import React from 'react'

export default function MediaPoster({
  src,
  alt = 'Project poster preview',
  aspectRatio = '16/9',
  category,
}) {
  return (
    <div className="project-poster-holder" style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="project-poster-img"
      />
      {category && (
        <span className="project-category-badge">{category}</span>
      )}
    </div>
  )
}
