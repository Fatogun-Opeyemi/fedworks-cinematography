
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'
import VideoPlayer from './VideoPlayer.jsx'
import MediaViewer from './MediaViewer.jsx'

import {
  urlForRect,
  getFileUrl,
  getCategoryLabel,
  formatProjectDate,
} from '../../libs/sanity.js'

export default function MediaSquareCard({
  project,
  delay = 0,
  hideCategoryTag = false,
  showOnlyTitle = false,
  showCategory = true,
  showMetadata = true,
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const [videoActive, setVideoActive] = useState(false)
  const [isBtsViewerOpen, setIsBtsViewerOpen] = useState(false)

  const slug =
    typeof project?.slug === 'string'
      ? project.slug
      : project?.slug?.current

  /*
   * Cover media
   */
  const coverMedia = project?.coverMedia || null

  const hasVideo =
    coverMedia?.type === 'video' &&
    Boolean(coverMedia?.video)

  const videoUrl = hasVideo
    ? getFileUrl(coverMedia.video)
    : null

  const posterUrl =
    coverMedia?.type === 'video'
      ? coverMedia?.poster
        ? urlForRect(coverMedia.poster)
        : ''
      : coverMedia?.type === 'image'
        ? coverMedia?.image
          ? urlForRect(coverMedia.image)
          : ''
        : ''

  /*
   * Project metadata
   */
  const categories = Array.isArray(project?.categories)
    ? project.categories
    : []

  const isBts = categories.some(
    (category) =>
      String(category).toLowerCase() === 'bts',
  )

  const categoryLabel =
    categories.length > 0
      ? categories
        .map((category) => getCategoryLabel(category))
        .join(' · ')
      : ''

  const dateFormatted = formatProjectDate(
    project?.month,
    project?.year,
  )

  /*
   * BTS media viewer
   */
  const openBtsViewer = () => {
    if (isBts && (videoUrl || posterUrl)) {
      setIsBtsViewerOpen(true)
    }
  }

  /*
   * Pause active video when card leaves viewport
   */
  useEffect(() => {
    if (!hasVideo || !videoActive) return

    const container = containerRef.current
    const video = videoRef.current

    if (!container || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [hasVideo, videoActive])

  if (!project) return null
  if (!slug && !isBts) return null

  const activateVideo = () => {
    if (!videoUrl) return

    if (isBts) {
      openBtsViewer()
      return
    }

    setVideoActive(true)
  }

  /*
   * Media content
   */
  let mediaContent

  if (hasVideo && videoUrl) {
    if (videoActive) {
      mediaContent = (
        <VideoPlayer
          ref={videoRef}
          videoSrc={videoUrl}
          posterSrc={posterUrl}
          aspectRatio="3/2"
          title={project.title || 'Project video'}
          controls
          playsInline
          preload="none"
          autoPlay
        />
      )
    } else {
      mediaContent = (
        <button
          type="button"
          className="square-video-poster"
          onClick={activateVideo}
          aria-label={
            isBts
              ? `View ${project.title || 'behind the scenes'}`
              : `Play ${project.title || 'project video'}`
          }
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={
                coverMedia?.alt ||
                project.title ||
                'Project'
              }
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="square-media-asset"
            />
          ) : (
            <span className="square-image-placeholder">
              <span>{project.title || 'Project'}</span>
            </span>
          )}

          <span
            className="square-video-play"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6.5L18 12L9 17.5V6.5Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      )
    }
  } else if (posterUrl) {
    if (isBts) {
      mediaContent = (
        <button
          type="button"
          className="square-image-link bts-media-trigger"
          onClick={openBtsViewer}
          aria-label={`View ${project.title || 'BTS media'}`}
        >
          <img
            src={posterUrl}
            alt={
              coverMedia?.alt ||
              project.title ||
              'Project'
            }
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="square-media-asset"
          />
        </button>
      )
    } else {
      mediaContent = (
        <Link
          to={`/work/${slug}`}
          className="square-image-link"
          aria-label={`View ${project.title || 'project'}`}
        >
          <img
            src={posterUrl}
            alt={
              coverMedia?.alt ||
              project.title ||
              'Project'
            }
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="square-media-asset"
          />
        </Link>
      )
    }
  } else {
    if (isBts) {
      mediaContent = (
        <div className="square-image-placeholder">
          <span>{project.title || 'Project'}</span>
        </div>
      )
    } else {
      mediaContent = (
        <Link
          to={`/work/${slug}`}
          className="square-image-placeholder"
          aria-label={`View ${project.title || 'project'}`}
        >
          <span>{project.title || 'Project'}</span>
        </Link>
      )
    }
  }

  /*
   * Render
   */
  return (
    <>
      <style>{`
        .bts-media-trigger {
          display: block;
          width: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: inherit;
          font: inherit;
          appearance: none;
          -webkit-appearance: none;
        }

        .bts-media-trigger img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bts-media-trigger:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 4px;
        }
      `}</style>

      <Reveal delay={delay}>
        <article
          ref={containerRef}
          className="media-square-card"
        >
          <div className="square-media-box">
            {mediaContent}

            {showMetadata &&
              showCategory &&
              !hideCategoryTag &&
              categoryLabel && (
                <div className="square-category-tag">
                  {categoryLabel}
                </div>
              )}
          </div>

          {showMetadata && (
            <div className="square-meta-box">
              {showOnlyTitle ? (
                <h3 className="square-project-title">
                  {isBts ? (
                    project.title
                  ) : (
                    <Link to={`/work/${slug}`}>
                      {project.title}
                    </Link>
                  )}
                </h3>
              ) : (
                <>
                  <h3 className="square-project-title">
                    {isBts ? (
                      project.title
                    ) : (
                      <Link to={`/work/${slug}`}>
                        {project.title}
                      </Link>
                    )}
                  </h3>

                  <div className="square-project-line">
                    {showCategory && categoryLabel}

                    {showCategory &&
                      categoryLabel &&
                      project.clientOrArtist && (
                        <span className="meta-separator">
                          ·
                        </span>
                      )}

                    {project.clientOrArtist && (
                      <span>{project.clientOrArtist}</span>
                    )}
                  </div>

                  <div className="square-project-subline tabular-nums">
                    {project.location && (
                      <span>{project.location}</span>
                    )}

                    {project.location &&
                      dateFormatted && (
                        <span className="meta-separator">
                          ·
                        </span>
                      )}

                    {dateFormatted && (
                      <span>{dateFormatted}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </article>
      </Reveal>

      {isBts && (
        <MediaViewer
          isOpen={isBtsViewerOpen}
          onClose={() => setIsBtsViewerOpen(false)}
          mediaType={hasVideo ? 'video' : 'image'}
          mediaSrc={hasVideo ? videoUrl : posterUrl}
          posterSrc={posterUrl}
          title={project.title || 'Behind the scenes'}
          caption="Behind the scenes"
          showControls={hasVideo}
        />
      )}
    </>
  )
}