import React, { useEffect, useState } from 'react'
import HeroReel from '../components/HeroReel.jsx'
import MediaSquareCard from '../components/media/MediaSquareCard.jsx'
import MediaViewer from '../components/media/MediaViewer.jsx'
import CinematicLoader from '../components/CinematicLoader.jsx'
import {
  getFeaturedProjects,
  getSiteSettings,
  getFileUrl,
  urlFor,
} from '../libs/sanity.js'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [siteSettings, setSiteSettings] = useState(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    let mounted = true
    let releaseTimeout = null

    const startedAt = Date.now()
    const minimumDisplayTime = 850

    const safetyTimeout = window.setTimeout(() => {
      if (mounted) {
        setIsLoading(false)
      }
    }, 7000)

    async function loadData() {
      const results = await Promise.allSettled([
        getFeaturedProjects(),
        getSiteSettings(),
      ])

      if (!mounted) return

      const [featuredResult, settingsResult] = results

      if (featuredResult.status === 'fulfilled') {
        setFeaturedProjects(featuredResult.value || [])
      } else {
        console.error(
          'Failed to load featured projects:',
          featuredResult.reason,
        )
      }

      if (settingsResult.status === 'fulfilled') {
        setSiteSettings(settingsResult.value || null)
      } else {
        console.error(
          'Failed to load site settings:',
          settingsResult.reason,
        )
      }

      window.clearTimeout(safetyTimeout)

      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, minimumDisplayTime - elapsed)

      releaseTimeout = window.setTimeout(() => {
        if (mounted) {
          setIsLoading(false)
        }
      }, remaining)
    }

    loadData()

    return () => {
      mounted = false
      window.clearTimeout(safetyTimeout)

      if (releaseTimeout !== null) {
        window.clearTimeout(releaseTimeout)
      }
    }
  }, [])

  const heroVideoUrl = siteSettings?.heroVideoUrl || ''
  const heroPosterUrl = siteSettings?.heroPosterUrl || ''

  console.log('Hero video URL:', heroVideoUrl)
  console.log('Hero poster URL:', heroPosterUrl)
  return (
    <div className="fedworks-home">
      <CinematicLoader visible={isLoading} />

      {/* HERO */}
      <HeroReel
        videoSrc={heroVideoUrl}
        posterSrc={heroPosterUrl}
        onWatchReel={
          heroVideoUrl
            ? () => setIsViewerOpen(true)
            : undefined
        }
      />

      {/* SELECTED WORKS */}
      {featuredProjects.length > 0 && (
        <section className="home-section home-section-selected">
          <div className="site-container">
            <div className="home-section-header">
              <h2
                id="selected-works-heading"
                className="home-section-title"
              >
                Selected Works
              </h2>
            </div>

            {/* Selected Works Grid */}
            <div className="home-selected-work-grid">
              {featuredProjects.map((project, index) => (
                <div
                  key={project._id}
                  className="home-selected-work-item"
                >
                  <MediaSquareCard
                    project={project}
                    delay={Math.min(index * 0.05, 0.25)}
                    hideCategoryTag={true}
                    showOnlyTitle={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHOWREEL VIEWER */}
      {heroVideoUrl && (
        <MediaViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          mediaType="video"
          mediaSrc={heroVideoUrl}
          posterSrc={heroPosterUrl}
          title="Chukwuka Edeogu Showreel"
          caption="Portfolio reel"
          showControls={false}
        />

      )}

      <style>{`
        .fedworks-home {
          width: 100%;
          overflow-x: hidden;
          background: var(--color-off-white);
          color: var(--color-black);
        }

        .home-section {
          padding: 2rem 0;
        }

        .home-section-selected {
          padding-top: 2rem;
        }

         .home-section-header {
            margin-bottom: clamp(2rem, 4vw, 3.5rem);
         }

        .home-section-title {
          margin: 0;
          color: var(--color-black);
          font-size: clamp(1.5rem, 2.5vw, 2.25rem);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        /*
         * SELECTED WORKS GRID
         */

        .home-selected-work-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .home-selected-work-item {
          min-width: 0;
        }

        /*
         * MEDIA FRAME
         *
         * Keeps the zoomed media inside its frame.
         */

        .home-selected-work-item .media-square-card .square-media-asset {
          overflow: hidden;
        }

        /*
         * MEDIA — NORMAL STATE
         *
         * Both images and videos start at their natural scale.
         */

        .home-selected-work-item .media-square-card .square-media-asset img,
        .home-selected-work-item .media-square-card .square-media-asset video,
        .home-selected-work-item .media-square-card video {
          transform: scale(1);
          transition: transform 0.5s cubic-bezier(0.2, 0.65, 0.3, 1);
          will-change: transform;
        }

        /*
         * MEDIA — HOVER STATE
         *
         * Change 1.05 to control the amount of zoom.
         *
         * 1.01 = extremely subtle
         * 1.02 = subtle
         * 1.03 = refined
         * 1.05 = noticeable
         * 1.08 = strong
         * 1.10 = dramatic
         */

        .home-selected-work-item:hover .media-square-card .square-media-asset img,
        .home-selected-work-item:hover .media-square-card .square-media-asset video,
        .home-selected-work-item:hover .media-square-card video {
          transform: scale(1.05) !important;
        }

        /*
         * HIDE META BOX BY DEFAULT
         */

        .home-selected-work-item .media-square-card .square-meta-box {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        /*
         * REVEAL TITLE ON HOVER
         */

        .home-selected-work-item:hover .media-square-card .square-meta-box {
          max-height: 100px;
        }

        /*
         * REDUCED MOTION
         */

        @media (prefers-reduced-motion: reduce) {
          .home-selected-work-item .media-square-card .square-media-asset img,
          .home-selected-work-item .media-square-card .square-media-asset video,
          .home-selected-work-item .media-square-card video {
            transition: none;
          }

          .home-selected-work-item .media-square-card .square-meta-box {
            transition: none;
          }
        }

        .home-selected-work-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 499px) {
          .home-selected-work-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }

        @media (min-width: 500px) and (max-width: 799px) {
          .home-selected-work-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 800px) and (max-width: 1023px) {
          .home-selected-work-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /*
         * TABLET
         */

        @media (min-width: 1024px) {
          .home-selected-work-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /*
         * MOBILE
         */

        @media (max-width: 767px) {
          .home-section {
            padding: 2rem 0;
          }

          .home-section-selected {
            padding-top: 1.75rem;
          }

          .home-section-header {
            margin-bottom: 2rem;
          }

          .home-section-title {
            font-size: 1.4rem;
          }
        }

        /*
         * TOUCH DEVICES
         *
         * No hover zoom on touch devices.
         */

        @media (hover: none) {
          .home-selected-work-item .media-square-card .square-meta-box {
            max-height: 0;
          }

          .home-selected-work-item .media-square-card .square-media-asset img,
          .home-selected-work-item .media-square-card .square-media-asset video,
          .home-selected-work-item .media-square-card video {
            transform: scale(1) !important;
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}