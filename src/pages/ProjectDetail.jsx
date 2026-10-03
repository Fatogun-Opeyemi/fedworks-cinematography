import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import VideoPlayer from '../components/media/VideoPlayer.jsx'
import MediaImage from '../components/media/MediaImage.jsx'
import MediaViewer from '../components/media/MediaViewer.jsx'
import { getProjectBySlug, getPublishedProjects } from '../lib/sanity/queries.js'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [nextProject, setNextProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    Promise.all([getProjectBySlug(slug), getPublishedProjects()]).then(([current, all]) => {
      if (!mounted) return
      setProject(current)

      if (current && all && all.length > 1) {
        // Sort projects by sortOrder
        const sorted = [...all].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
        const currentIndex = sorted.findIndex(p => p._id === current._id)
        const next = sorted[(currentIndex + 1) % sorted.length]
        setNextProject(next)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="editorial-page-section" style={{ minHeight: '80vh', paddingTop: '8rem' }}>
        <div className="site-container">
          <p style={{ color: 'rgba(10, 10, 10, 0.5)', fontSize: '0.875rem' }}>
            Loading project document...
          </p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="editorial-page-section" style={{ minHeight: '80vh', paddingTop: '8rem' }}>
        <div className="site-container">
          <SectionHeader
            kicker="Document Status"
            title="Project Not Found"
            subtitle="The requested cinematography commission does not exist or has been archived."
          />
          <div style={{ marginTop: '2rem' }}>
            <Link to="/work" className="btn-primary-action">
              ← Return to Archive
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const hasVideo = Boolean(project.videoUrl)
  const galleryStills = project.gallery || []

  return (
    <div className="editorial-page-section" style={{ paddingTop: '7rem' }}>
      <div className="site-container">
        {/* Back Link */}
        <Link
          to="/work"
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(10, 10, 10, 0.6)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          ← Return to All Work
        </Link>

        {/* Title & Metadata */}
        <SectionHeader
          kicker={`${project.categoryLabel} · ${project.year || ''}`}
          title={project.title}
        />

        {/* Primary Media (Inline Video or Poster) */}
        <Reveal delay={0.08}>
          <div style={{ marginTop: '2.5rem', marginBottom: '3.5rem' }}>
            {hasVideo ? (
              <VideoPlayer
                videoSrc={project.videoUrl}
                posterSrc={project.posterUrl || project.poster}
                aspectRatio="16/9"
                title={project.title}
              />
            ) : (
              <MediaImage
                src={project.posterUrl || project.poster}
                alt={project.title}
                aspectRatio="16/9"
              />
            )}
          </div>
        </Reveal>

        {/* Description & Credits */}
        <div className="editorial-split" style={{ marginBottom: '4rem' }}>
          <div>
            <div className="section-kicker">
              <span className="section-kicker-dot" aria-hidden="true" />
              <span>Synopsis & Approach</span>
            </div>
            <p className="editorial-body-text">
              {project.description || project.synopsis}
            </p>
          </div>

          <div className="editorial-spec-block">
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Credits & Technical Notes
            </div>

            <div className="editorial-spec-row">
              <span className="editorial-spec-label">Category</span>
              <span className="editorial-spec-val">{project.categoryLabel}</span>
            </div>
            <div className="editorial-spec-row">
              <span className="editorial-spec-label">Year</span>
              <span className="editorial-spec-val tabular-nums">{project.year || '—'}</span>
            </div>

            {project.credits && project.credits.map((credit, idx) => (
              <div key={idx} className="editorial-spec-row">
                <span className="editorial-spec-label">{credit.role}</span>
                <span className="editorial-spec-val">{credit.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stills Gallery */}
        {galleryStills.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <SectionHeader
              kicker="Frame Stills"
              title="Optical Frames & Details"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {galleryStills.map((still, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImage(still)}
                  style={{ cursor: 'pointer', overflow: 'hidden', backgroundColor: 'var(--color-black-soft)', aspectRatio: '16/9' }}
                >
                  <MediaImage
                    src={still}
                    alt={`${project.title} still ${idx + 1}`}
                    aspectRatio="16/9"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Project Link */}
        {nextProject && (
          <div style={{ paddingTop: '3rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(10, 10, 10, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Next Project
              </div>
              <Link
                to={`/work/${nextProject.slug?.current || nextProject.slug}`}
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-black)', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}
              >
                <span>{nextProject.title}</span>
                <span style={{ color: 'var(--color-red)' }}>→</span>
              </Link>
            </div>

            <Link
              to="/work"
              style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'underline' }}
            >
              All Projects
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox for Stills Gallery */}
      <MediaViewer
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        mediaType="image"
        mediaSrc={lightboxImage}
        title={project.title}
        caption="Film still archive."
      />
    </div>
  )
}
