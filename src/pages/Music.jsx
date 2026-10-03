import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import MediaRail from '../components/media/MediaRail.jsx'
import { getProjectsByCategory } from '../lib/sanity/queries.js'

export default function Music() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getProjectsByCategory('music').then(data => {
      if (mounted) {
        setProjects(data)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-off-white)', minHeight: '100vh', paddingTop: '7.5rem' }}>
      <div className="site-container">
        <SectionHeader
          kicker="Vision & Sound"
          title="Music Videos"
          subtitle="Experimental lighting design, optical grain, and rhythmic camera choreography created for recording artists."
        />
      </div>

      {/* Controllable Sliding Horizontal Rail */}
      {projects.length > 0 && (
        <MediaRail
          items={projects}
          title="Featured Music Frames"
          kicker="Motion Reel"
          seeAllLink=""
          seeAllText=""
        />
      )}

      <div className="site-container" style={{ paddingBottom: '6rem', paddingTop: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', color: 'var(--color-off-white)' }}>
          Music Video Archive
        </h3>

        {loading ? (
          <div style={{ padding: '3rem 0', color: 'rgba(243, 240, 232, 0.5)', fontSize: '0.875rem' }}>
            Loading music catalog...
          </div>
        ) : (
          <MediaSquareGrid projects={projects} />
        )}
      </div>
    </div>
  )
}
