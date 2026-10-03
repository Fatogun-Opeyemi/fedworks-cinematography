import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroReel from '../components/HeroReel.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import MediaRail from '../components/media/MediaRail.jsx'
import MediaViewer from '../components/media/MediaViewer.jsx'
import {
  getFeaturedProjects,
  getAllProjects,
  getBtsItems,
  getSiteSettings,
} from '../lib/sanity.js'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [btsItems, setBtsItems] = useState([])
  const [siteSettings, setSiteSettings] = useState(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const [feat, all, bts, settings] = await Promise.all([
          getFeaturedProjects(),
          getAllProjects(),
          getBtsItems(),
          getSiteSettings(),
        ])
        if (mounted) {
          setFeaturedProjects(feat)
          setAllProjects(all)
          setBtsItems(bts)
          setSiteSettings(settings)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  // Canonical, slugified category values produced by getCanonicalCategory()/normalizeProject().
  // "Narrative" work is normalised to the canonical "film" bucket.
  const filmProjects = allProjects.filter(p => p.category === 'film')
  const commercialProjects = allProjects.filter(p => p.category === 'commercial')
  const musicVideoProjects = allProjects.filter(p => p.category === 'music-video')

  const heroVideoUrl = siteSettings?.heroVideoUrl || ''
  const heroPosterUrl = siteSettings?.heroPosterUrl || ''

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ==================================================================
          1. HERO SHOWREEL EXPERIENCE (Master Prompt #2 & #3)
          Actual video montage & poster, FEDWORKS + DIRECTOR OF PHOTOGRAPHY
          ================================================================== */}
      <HeroReel
        videoSrc={heroVideoUrl}
        posterSrc={heroPosterUrl}
        onWatchReel={heroVideoUrl ? () => setIsViewerOpen(true) : undefined}
      />

      {/* ==================================================================
          2. FEATURED WORKS — CURATED PREVIEW (featured == true in Sanity)
          aspect-ratio: 1/1, 3-col desktop, 2-col tablet, 1-2 col mobile
          ================================================================== */}
      <section className="selected-work-section">
        <div className="site-container">
          <div className="section-header-row-layout">
             <SectionHeader
               kicker=""
               title="Featured Works"
               subtitle="Cinematography commissions across narrative drama, commercials, and music films."
             />
            <Link to="/work" className="section-action-link">
              View All Work
            </Link>
          </div>

          <MediaSquareGrid projects={featuredProjects} />
        </div>
      </section>

      {/* ==================================================================
          3. CONTROLLABLE HORIZONTAL MEDIA RAIL (Master Prompt #11)
          Touch drag, mouse drag, keyboard arrows, subtle auto-movement
          ================================================================== */}
      {allProjects.length > 0 && (
        <MediaRail
          items={allProjects}
          title="Visual Movement & Rhythm"
          kicker="Motion Archive"
          seeAllLink="/music"
          seeAllText="Explore Music Videos →"
        />
      )}

      {/* ==================================================================
          4. MUSIC VIDEOS SECTION (When published projects exist)
          ================================================================== */}
      {musicVideoProjects.length > 0 && (
        <section className="narrative-strip-section">
          <div className="site-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <SectionHeader
                kicker="Rhythm & Sound"
                title="Music Videos"
                subtitle="Experimental lighting design, optical grain, and rhythmic camera choreography created for recording artists."
              />
              <Link
                to="/music"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-off-white)',
                  textDecoration: 'underline',
                  paddingBottom: '0.5rem',
                }}
              >
                All Music Videos →
              </Link>
            </div>

            <MediaSquareGrid
              projects={musicVideoProjects}
            />
          </div>
        </section>
      )}

      {/* ==================================================================
          5. NARRATIVE SECTION (Rendered when narrative work is published)
          ================================================================== */}
      {filmProjects.length > 0 && (
        <section className="narrative-strip-section">
          <div className="site-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <SectionHeader
                kicker="Scripted Cinema"
                title="Narrative Direction"
                subtitle="Atmospheric optical rendering, motivated light, and emotional duration."
              />
              <Link
                to="/narrative"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-off-white)',
                  textDecoration: 'underline',
                  paddingBottom: '0.5rem',
                }}
              >
                All Narrative Work →
              </Link>
            </div>

            <MediaSquareGrid
              projects={filmProjects}
            />
          </div>
        </section>
      )}

      {/* ==================================================================
          6. COMMERCIALS SECTION (Rendered when commercial work is published)
          ================================================================== */}
      {commercialProjects.length > 0 && (
        <section className="selected-work-section" style={{ borderBottom: 'none' }}>
          <div className="site-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <SectionHeader
                kicker="Commissions"
                title="Commercial Campaigns"
                subtitle="Precision tabletop, macro optics, high-speed movement, and location lighting."
              />
              <Link
                to="/commercials"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'underline',
                  paddingBottom: '0.5rem',
                }}
              >
                All Commercials →
              </Link>
            </div>

            <MediaSquareGrid
              projects={commercialProjects}
            />
          </div>
        </section>
      )}

      {/* ==================================================================
          7. BEHIND THE SCENES / ON SET RAIL
          ================================================================== */}
       {btsItems.length > 0 && (
         <MediaRail
           items={btsItems.map(item => ({
             ...item,
             title: item.caption,
             posterUrl: item.image?.asset?.url,
             videoUrl: item.video?.asset?.url,
             categoryLabel: 'BTS',
           }))}
           title="BTS & Camera Rigs"
           kicker="Behind The Scenes"
           seeAllLink="/on-set"
           seeAllText="All BTS Material →"
         />
       )}

      {/* Full-Screen Showreel Modal */}
       {heroVideoUrl && (
         <MediaViewer
           isOpen={isViewerOpen}
           onClose={() => setIsViewerOpen(false)}
           mediaType="video"
           mediaSrc={heroVideoUrl}
           posterSrc={heroPosterUrl}
           title="Chukwuka Edeogu (Fedworks) — Showreel"
           caption="Portfolio reel."
         />
       )}
    </div>
  )
}
