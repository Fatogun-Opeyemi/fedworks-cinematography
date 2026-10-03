import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getPublishedProjects } from '../lib/sanity/queries.js'

export default function Work() {
  const [projects, setProjects] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getPublishedProjects().then(data => {
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
    <div className="selected-work-section" style={{ minHeight: '80vh', paddingTop: '7.5rem' }}>
      <div className="site-container">
        <SectionHeader
          kicker="Complete Archive"
          title="All Projects"
          subtitle="Chronological archive of cinematography commissions, narrative films, commercials, and music videos."
        />

        {loading ? (
          <div style={{ padding: '4rem 0', color: 'rgba(10, 10, 10, 0.5)', fontSize: '0.875rem' }}>
            Retrieving archive from Sanity...
          </div>
        ) : (
          <MediaSquareGrid
            projects={projects}
            showFilters={true}
            activeFilter={activeCategory}
            onFilterChange={setActiveCategory}
          />
        )}
      </div>
    </div>
  )
}
