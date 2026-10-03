import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../lib/sanity/queries.js'

export default function Commercials() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getProjectsByCategory('commercial').then(data => {
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
          kicker="Commissions"
          title="Commercial Cinematography"
          subtitle="Precision tabletop, macro optics, high-speed movement, and location lighting. Engineered for clarity and brand elevation without visual clutter."
        />

        {loading ? (
          <div style={{ padding: '4rem 0', color: 'rgba(10, 10, 10, 0.5)', fontSize: '0.875rem' }}>
            Loading commercial commissions...
          </div>
        ) : (
          <MediaSquareGrid projects={projects} />
        )}
      </div>
    </div>
  )
}
