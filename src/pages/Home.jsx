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
  getMentoringContent,
  getAboutContent,
} from '../lib/sanity.js'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [btsItems, setBtsItems] = useState([])
  const [siteSettings, setSiteSettings] = useState(null)
  const [mentoring, setMentoring] = useState(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const [feat, all, bts, settings, ment] = await Promise.all([
          getFeaturedProjects(),
          getAllProjects(),
          getBtsItems(),
          getSiteSettings(),
          getMentoringContent(),
        ])
        if (mounted) {
          setFeaturedProjects(feat)
          setAllProjects(all)
          setBtsItems(bts)
          setSiteSettings(settings)
          setMentoring(ment)
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

  // Build sections array
  const sections = []

  // 2. SELECTED WORKS
  if (featuredProjects.length > 0) {
    sections.push(
      <section key="selected-works" className="selected-work-section">
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
    )
  }

  // 3. NARRATIVE
  if (filmProjects.length > 0) {
    sections.push(
      <section key="narrative" className="narrative-strip-section">
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Scripted Cinema"
              title="Narrative"
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
              View All Narrative →
            </Link>
          </div>

          <MediaSquareGrid projects={filmProjects} />
        </div>
      </section>
    )
  }

  // 4. COMMERCIAL
  if (commercialProjects.length > 0) {
    sections.push(
      <section key="commercial" className="selected-work-section" style={{ borderBottom: 'none' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Commissions"
              title="Commercial"
              subtitle="Precision tabletop, macro optics, high-speed movement, and location lighting."
            />
            <Link
              to="/commercials"
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
              View All Commercials →
            </Link>
          </div>

          <MediaSquareGrid projects={commercialProjects} />
        </div>
      </section>
    )
  }

  // 5. MUSIC
  if (musicVideoProjects.length > 0) {
    sections.push(
      <section key="music" className="narrative-strip-section">
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Rhythm & Sound"
              title="Music"
              subtitle="Experimental lighting design, optical grain, and rhythmic camera choreography created for recording artists."
            />
            <Link
              to="/music"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                // color: 'var(--color-off-white)',
                color: 'var(--color-black)',
                textDecoration: 'underline',
                paddingBottom: '0.5rem',
              }}
            >
              View All Music Videos →
            </Link>
          </div>

          <MediaSquareGrid projects={musicVideoProjects} />
        </div>
      </section>
    )
  }

  // 6. BTS
  if (btsItems.length > 0) {
    sections.push(
      <section key="bts" className="selected-work-section" style={{ borderBottom: 'none' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Camera Department"
              title="BTS"
              subtitle="Behind-the-scenes moments, camera rigs, optical tests, and images of the cinematographer working in the field."
            />
            <Link
              to="/on-set"
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
              View All BTS →
            </Link>
          </div>

          <MediaSquareGrid
            projects={btsItems.map(item => ({
              ...item,
              title: item.caption,
              posterUrl: item.image?.asset?.url,
              videoUrl: item.video?.asset?.url,
              categoryLabel: 'BTS',
            }))}
          />
        </div>
      </section>
    )
  }

  // 7. MENTORING
  if (mentoring) {
    sections.push(
      <section key="mentoring" className="selected-work-section" style={{ borderBottom: 'none' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Shadow a shoot"
              title="Mentoring"
              subtitle="Dedicated shadowing program offering emerging camera assistants and cinematographers direct access to active working sets, lighting setups, and optical camera tests."
            />
            <Link
              to="/mentoring"
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
              Learn About Mentoring →
            </Link>
          </div>

          {/* Mentoring content */}
          <div style={{ marginTop: '3.5rem' }}>
            {mentoring.mentoringHeading && (
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-black)' }}>
                {mentoring.mentoringHeading}
              </h2>
            )}
            {mentoring.mentoringBody && (
              <div style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 300, lineHeight: 1.6, color: 'rgba(10, 10, 10, 0.8)', maxWidth: '58ch' }}>
                {mentoring.mentoringBody}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // 8. ABOUT
  if (siteSettings) {
    sections.push(
      <section key="about" className="selected-work-section" style={{ borderBottom: 'none' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Practice & Ethos"
              title="About"
              subtitle="Director of Photography working internationally across narrative features, music films, commercials, and documentary projects."
            />
            <Link
              to="/about"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                // color: 'var(--color-off-white)',
                color: 'var(--color-black)',
                textDecoration: 'underline',
                paddingBottom: '0.5rem',
              }}
            >
              About Fedworks →
            </Link>
          </div>

          {/* About content */}
          <div style={{ marginTop: '3.5rem' }}>
            {siteSettings.aboutHeading && (
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-black)' }}>
                {siteSettings.aboutHeading}
              </h2>
            )}
            {siteSettings.aboutBody && (
              <div style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 300, lineHeight: 1.6, color: 'rgba(10, 10, 10, 0.8)', maxWidth: '58ch' }}>
                {siteSettings.aboutBody}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // 9. CONTACT
  if (siteSettings) {
    sections.push(
      <section key="contact" className="selected-work-section" style={{ borderBottom: 'none' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              kicker="Get in touch"
              title="Contact"
              subtitle="For inquiries, collaborations, or questions."
            />
            <Link
              to="/contact"
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
              Contact Fedworks →
            </Link>
          </div>

          {/* Contact details */}
          <div style={{ marginTop: '3.5rem' }}>
            {siteSettings.contactEmail && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>Email:</span>
                <a href={`mailto:${siteSettings.contactEmail}`} style={{ color: 'var(--color-off-white)', textDecoration: 'underline' }}>
                  {siteSettings.contactEmail}
                </a>
              </div>
            )}
            {siteSettings.phone && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>Phone:</span>
                <span style={{ color: 'var(--color-off-white)' }}>{siteSettings.phone}</span>
              </div>
            )}
            {siteSettings.instagramUrl && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>Instagram:</span>
                <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-off-white)', textDecoration: 'underline' }}>
                  {siteSettings.instagramUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ==================================================================
          1. HERO SHOWREEL EXPERIENCE (Master Prompt #2 & #3)
          Actual video montage & poster, Chukwuka Edeogu (Fedworks) + DIRECTOR OF PHOTOGRAPHY
          ================================================================== */}
      <HeroReel
        videoSrc={heroVideoUrl}
        posterSrc={heroPosterUrl}
        onWatchReel={heroVideoUrl ? () => setIsViewerOpen(true) : undefined}
      />

      {/* Render sections with dividers between them */}
      {/* {sections.map((section, index) => (
        <React.Fragment key={section.key || index}>
          {section}
          {index < sections.length - 1 && (
            <div
              style={{
                // borderTop: '1px solid var(--color-red)',
                height: '1px',
                width: '100%',
                margin: '0',
              }}
            />
          )}
        </React.Fragment>
      ))} */}

      {sections.map((section) => section)}

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