import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import VideoPlayer from '../components/media/VideoPlayer.jsx'
import MediaImage from '../components/media/MediaImage.jsx'
import MediaViewer from '../components/media/MediaViewer.jsx'

import {
  getProjectBySlug,
  getProjects,
  urlFor,
  getFileUrl,
  getCategoryLabel,
  formatProjectDate,
} from '../libs/sanity.js'

export default function ProjectDetail() {
  const { slug } = useParams()

  const [project, setProject] = useState(null)
  const [nextProject, setNextProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    let mounted = true

    setLoading(true)

    async function loadProject() {
      try {
        const [current, all] = await Promise.all([
          getProjectBySlug(slug),
          getProjects(),
        ])

        if (!mounted) return

        setProject(current)

        if (
          current &&
          Array.isArray(all) &&
          all.length > 1
        ) {
          const sorted = [...all].sort(
            (a, b) =>
              (a.sortOrder ?? 99) -
              (b.sortOrder ?? 99),
          )

          const currentIndex = sorted.findIndex(
            (p) => p._id === current._id,
          )

          if (currentIndex !== -1) {
            const next =
              sorted[
              (currentIndex + 1) % sorted.length
              ]

            setNextProject(next)
          } else {
            setNextProject(null)
          }
        } else {
          setNextProject(null)
        }
      } catch (error) {
        console.error(
          'Failed to load project:',
          error,
        )

        if (!mounted) return

        setProject(null)
        setNextProject(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProject()

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div
        className="editorial-page-section"
        style={{
          minHeight: '80vh',
          paddingTop: '8rem',
        }}
      >
        <div className="site-container">
          <p
            style={{
              color: 'rgba(10, 10, 10, 0.5)',
              fontSize: '0.875rem',
            }}
          >
            Loading project document...
          </p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div
        className="editorial-page-section"
        style={{
          minHeight: '80vh',
          paddingTop: '8rem',
        }}
      >
        <div className="site-container">
          <SectionHeader
            kicker="Document Status"
            title="Project Not Found"
            subtitle="The requested cinematography commission does not exist or has been archived."
          />

          <div style={{ marginTop: '2rem' }}>
            <Link
              to="/work"
              className="btn-primary-action"
            >
              ← Return to Archive
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Project Metadata
  |--------------------------------------------------------------------------
  */

  const categories = Array.isArray(project.categories)
    ? project.categories
    : []

  const categoryLabel =
    categories.length > 0
      ? categories
        .map((category) =>
          getCategoryLabel(category),
        )
        .join(' · ')
      : ''

  const dateFormatted = formatProjectDate(
    project.month,
    project.year,
  )

  /*
  |--------------------------------------------------------------------------
  | Cover Media
  |--------------------------------------------------------------------------
  */

  const coverMedia = project.coverMedia || null

  const coverVideoUrl =
    coverMedia?.type === 'video'
      ? getFileUrl(coverMedia.video)
      : null

  const coverPosterUrl =
    coverMedia?.type === 'video'
      ? coverMedia.poster
        ? urlFor(coverMedia.poster)?.url()
        : null
      : null

  const coverImageUrl =
    coverMedia?.type === 'image'
      ? coverMedia.image
        ? urlFor(coverMedia.image)?.url()
        : null
      : null

  const hasVideo = Boolean(coverVideoUrl)

  const coverImage =
    coverImageUrl || coverPosterUrl || ''

  /*
  |--------------------------------------------------------------------------
  | Gallery Media
  |--------------------------------------------------------------------------
  */

  const galleryStills = Array.isArray(project.media)
    ? project.media
      .filter(
        (item) =>
          item?.type === 'image' &&
          item?.image,
      )
      .sort(
        (a, b) =>
          (a.order ?? 0) -
          (b.order ?? 0),
      )
      .map((item) => ({
        src:
          urlFor(item.image)?.url() || '',
        alt:
          item.alt ||
          `${project.title} still`,
        caption: item.caption || '',
      }))
      .filter((item) => item.src)
    : []

  /*
  |--------------------------------------------------------------------------
  | Credits
  |--------------------------------------------------------------------------
  */

  const credits = Array.isArray(project.credits)
    ? project.credits
    : []

  const roleLabelMap = {
    director: 'Director',
    'director-of-photography':
      'Director of Photography',
    producer: 'Producer',
    'first-ac': '1st AC',
    gaffer: 'Gaffer',
    editor: 'Editor',
    colorist: 'Colorist',
    'production-designer':
      'Production Designer',
    sound: 'Sound',
    stylist: 'Stylist',
    other: 'Other',
  }

  return (
    <div
      className="editorial-page-section project-detail-page"
      style={{ paddingTop: '2rem' }}
    >
      <div className="site-container">
        {/*
        |--------------------------------------------------------------------------
        | Title & Metadata
        |--------------------------------------------------------------------------
        */}

        <SectionHeader
          kicker={`${categoryLabel}${dateFormatted
            ? ` · ${dateFormatted}`
            : ''
            }`}
          title={project.title}
        />

        {/*
        |--------------------------------------------------------------------------
        | Primary Media + Credits
        |--------------------------------------------------------------------------
        |
        | Media deliberately occupies roughly half the available width.
        | Credits sit directly beside it.
        |
        */}

        <Reveal delay={0.08}>
          <div
            className="project-detail-primary"
            style={{
              marginBottom: '5rem'
            }}
          >
            <div className="project-detail-primary-media">
              {hasVideo ? (
                <VideoPlayer
                  videoSrc={coverVideoUrl}
                  posterSrc={coverPosterUrl}
                  aspectRatio="1.45"
                  title={project.title}
                />
              ) : coverImage ? (
                <MediaImage
                  src={coverImage}
                  alt={
                    coverMedia?.alt ||
                    project.title
                  }
                  aspectRatio="1.45"
                />
              ) : null}
            </div>

            <div className="project-detail-primary-info">
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                Credits & Technical Notes
              </div>

              <div className="editorial-spec-row">
                <span className="editorial-spec-label">
                  Category
                </span>

                <span className="editorial-spec-val">
                  {categoryLabel || '—'}
                </span>
              </div>

              <div className="editorial-spec-row">
                <span className="editorial-spec-label">
                  Year
                </span>

                <span className="editorial-spec-val tabular-nums">
                  {project.year || '—'}
                </span>
              </div>

              {project.clientOrArtist && (
                <div className="editorial-spec-row">
                  <span className="editorial-spec-label">
                    Client / Artist
                  </span>

                  <span className="editorial-spec-val">
                    {project.clientOrArtist}
                  </span>
                </div>
              )}

              {project.location && (
                <div className="editorial-spec-row">
                  <span className="editorial-spec-label">
                    Location
                  </span>

                  <span className="editorial-spec-val">
                    {project.location}
                  </span>
                </div>
              )}

              {credits.length > 0 && (
                <div
                  className="project-detail-credit-divider"
                  aria-hidden="true"
                />
              )}

              {credits.map((credit, idx) => {
                const role =
                  credit.role === 'other'
                    ? credit.customRole ||
                    'Other'
                    : credit.role

                return (
                  <div
                    key={
                      credit._key ||
                      `${credit.name}-${idx}`
                    }
                    className="editorial-spec-row"
                  >
                    <span className="editorial-spec-label">
                      {roleLabelMap[role] ||
                        role}
                    </span>

                    <span className="editorial-spec-val">
                      {credit.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/*
        |--------------------------------------------------------------------------
        | Stills Gallery
        |--------------------------------------------------------------------------
        */}

        {galleryStills.length > 0 && (
          <div
            className="project-detail-stills"
            style={{ marginBottom: '5rem' }}
          >
            <SectionHeader
              kicker="Frame Stills"
              title="Optical Frames & Details"
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginTop: '1.5rem',
              }}
            >
              {galleryStills.map(
                (still, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setLightboxImage(
                        still.src,
                      )
                    }
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      backgroundColor:
                        'var(--color-black-soft)',
                      aspectRatio: '2',
                    }}
                  >
                    <MediaImage
                      src={still.src}
                      alt={
                        still.alt ||
                        `${project.title} still ${idx + 1
                        }`
                      }
                      aspectRatio="16/9"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/*
        |--------------------------------------------------------------------------
        | Next Project
        |--------------------------------------------------------------------------
        */}

        {nextProject && (
          <div
            style={{
              paddingTop: '3rem',
              borderTop:
                '1px solid var(--border-light)',
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'rgba(10, 10, 10, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Next Project
              </div>

              <Link
                to={`/work/${nextProject.slug?.current ||
                  nextProject.slug
                  }`}
                style={{
                  fontSize:
                    'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 500,
                  color: 'var(--color-black)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                <span>
                  {nextProject.title}
                </span>

                <span
                  style={{
                    color: 'var(--color-red)',
                  }}
                >
                </span>
              </Link>
            </div>

            <Link
              to="/work"
              style={{
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'underline',
              }}
            >
              All Projects
            </Link>
          </div>
        )}
      </div>

      {/*
      |--------------------------------------------------------------------------
      | Lightbox
      |--------------------------------------------------------------------------
      */}

      <MediaViewer
        isOpen={Boolean(lightboxImage)}
        onClose={() =>
          setLightboxImage(null)
        }
        mediaType="image"
        mediaSrc={lightboxImage}
        title={project.title}
        caption="Film still archive."
      />

      <style>{`
        /*
        |--------------------------------------------------------------------------
        | Primary project area
        |--------------------------------------------------------------------------
        */

        .project-detail-primary {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.72fr);
          gap: clamp(2.5rem, 6vw, 7rem);
          align-items: start;
        }

        /*
        The media is intentionally much smaller than the old full-width hero.
        The first column is the visual anchor; the second column is the credits.
        */

        .project-detail-primary-media {
          width: 100%;
          max-width: 760px;
        }

        .project-detail-primary-info {
          width: 100%;
          max-width: 520px;
          padding-top: 0.25rem;
        }

        .project-detail-primary-info
          .editorial-spec-row {
          display: grid;
          grid-template-columns: 145px minmax(0, 1fr);
          column-gap: 1.5rem;
          padding: 0.9rem 0;
          border-top: 1px solid
            rgba(10, 10, 10, 0.12);
        }

        .project-detail-primary-info
          .editorial-spec-row:last-child {
          border-bottom: 1px solid
            rgba(10, 10, 10, 0.12);
        }

        .project-detail-credit-divider {
          height: 2rem;
        }

        .project-detail-primary-info
          .editorial-spec-label {
          font-size: 0.65rem;
          line-height: 1.4;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.5);
        }

        .project-detail-primary-info
          .editorial-spec-val {
          min-width: 0;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        /*
        |--------------------------------------------------------------------------
        | Stills
        |--------------------------------------------------------------------------
        */

        .project-detail-stills {
          padding-top: 1rem;
        }

        /*
        |--------------------------------------------------------------------------
        | Tablet
        |--------------------------------------------------------------------------
        */

        @media (max-width: 900px) {
          .project-detail-primary {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(240px, 0.65fr);
            gap: 2.5rem;
          }

          .project-detail-primary-info
            .editorial-spec-row {
            grid-template-columns: 115px minmax(0, 1fr);
            column-gap: 1rem;
          }
        }

        /*
        |--------------------------------------------------------------------------
        | Mobile
        |--------------------------------------------------------------------------
        */

        @media (max-width: 700px) {
          .project-detail-primary {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .project-detail-primary-media {
            max-width: 100%;
          }

          .project-detail-primary-info {
            max-width: 100%;
          }

          .project-detail-primary-info
            .editorial-spec-row {
            grid-template-columns:
              130px minmax(0, 1fr);
          }
        }

        @media (max-width: 500px) {
          .project-detail-primary {
            margin-top: 2rem !important;
            margin-bottom: 4rem !important;
          }

          .project-detail-primary-info
            .editorial-spec-row {
            grid-template-columns: 1fr;
            gap: 0.3rem;
          }

          .project-detail-primary-info
            .editorial-spec-label {
            font-size: 0.6rem;
          }

          .project-detail-primary-info
            .editorial-spec-val {
            font-size: 0.8rem;
          }

          .project-detail-credit-divider {
            height: 1rem;
          }
        }
      `}</style>
    </div>
  )
}