import React from 'react'
import VideoPlayer from './VideoPlayer.jsx'
import { urlForImage } from '../../lib/sanity/image.js'

export default function MediaVideo({
  video,
  poster,
  provider = 'sanity',
  aspectRatio = '16/9',
  title = 'Cinematography sequence',
  className = '',
  controls = true,
  muted = false,
  loop = false,
  autoPlay = false,
}) {
  // Provider currently sanity
  if (provider !== 'sanity') {
    console.warn(`[MediaVideo] Provider "${provider}" is not supported. Using sanity.`)
  }

  const resolvedVideoSrc =
    video?.asset?.url ||
    (typeof video === 'string' ? video : '') ||
    '/placeholders/placeholder-video.mp4'

  const resolvedPosterSrc =
    poster?.asset?.url ||
    (poster ? urlForImage(poster) : '') ||
    '/placeholders/placeholder-01.svg'

  return (
    <VideoPlayer
      videoSrc={resolvedVideoSrc}
      posterSrc={resolvedPosterSrc}
      aspectRatio={aspectRatio}
      title={title}
      className={className}
      controls={controls}
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
    />
  )
}
