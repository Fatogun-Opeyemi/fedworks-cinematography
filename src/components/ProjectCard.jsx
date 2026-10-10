import React from 'react'
import { Link } from 'react-router-dom'
import MediaPoster from './MediaPoster.jsx'
import VideoPlayer from './media/VideoPlayer.jsx'
import Reveal from './Reveal.jsx'

export default function ProjectCard({ project, delay = 0 }) {
  if (!project) return null

  const slug =
    typeof project.slug === 'string'
      ? project.slug
      : project.slug?.current

  if (!slug) return null

  const hasVideo = Boolean(project.videoUrl)

  const posterUrl =
    project.posterUrl ||
    project.poster ||
    project.thumbnailUrl ||
    project.thumbnail ||
    ''

  const handleCardClick = (event) => {
    /*
     * Clicking video controls should operate the player,
     * not navigate to the project detail page.
     */
    if (event.target.closest('.video-player-root')) {
      event.preventDefault()
    }
  }

  return (
    <Reveal delay={delay}>
      <article className="project-card">
        <Link
          to={`/work/${slug}`}
          className="project-card-link"
          onClick={handleCardClick}
        >
          <div className="project-card-media">
            {hasVideo ? (
              <VideoPlayer
                videoSrc={project.videoUrl}
                posterSrc={posterUrl}
                aspectRatio="16/9"
                title={project.title || 'Project video'}
                controls
                playsInline
              />
            ) : (
              <MediaPoster
                src={posterUrl}
                alt={project.title || 'Project image'}
              />
            )}
          </div>

          <div className="project-meta-row">
            <div className="project-meta-primary">
              {project.title && (
                <h3 className="project-title">
                  {project.title}
                </h3>
              )}

              {project.clientOrArtist && (
                <span className="project-client">
                  {project.clientOrArtist}
                </span>
              )}
            </div>

            <div className="project-meta-secondary">
              {project.categoryLabel && (
                <span>{project.categoryLabel}</span>
              )}

              {project.dateFormatted && (
                <span>{project.dateFormatted}</span>
              )}

              {!project.dateFormatted && project.year && (
                <span>{project.year}</span>
              )}
            </div>
          </div>
        </Link>
      </article>
    </Reveal>
  )
}