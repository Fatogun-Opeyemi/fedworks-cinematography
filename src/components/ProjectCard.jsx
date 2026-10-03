import React from 'react'
import { Link } from 'react-router-dom'
import MediaPoster from './MediaPoster.jsx'
import Reveal from './Reveal.jsx'

export default function ProjectCard({ project, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="project-card">
        <Link
          to={`/work/${project.slug.current}`}
          aria-label={`View ${project.title} portfolio details`}
        >
          <MediaPoster
            src={project.poster}
            alt={project.title}
            category={project.categoryLabel}
            aspectRatio={project.aspectRatio || '16/9'}
          />

          <div className="project-meta-row">
            <span className="tabular-nums">{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{project.categoryLabel}</span>
          </div>

          <h3 className="project-title">
            <span>{project.title}</span>
            <span className="project-arrow" aria-hidden="true">→</span>
          </h3>

          <p className="project-synopsis">{project.synopsis}</p>
        </Link>
      </article>
    </Reveal>
  )
}
