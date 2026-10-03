import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../lib/sanity/queries.js'

export default function Narrative() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getProjectsByCategory('narrative').then(data => {
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
    <div className="narrative-strip-section" style={{ minHeight: '80vh', paddingTop: '7.5rem' }}>
      <div className="site-container">
        <SectionHeader
          kicker="Scripted Cinema"
          title="Narrative Work"
          subtitle="Feature films, narrative drama shorts, and scripted visual storytelling. Focused on psychological atmosphere, optical depth, and motivated light."
        />

        {loading ? (
          <div style={{ padding: '4rem 0', color: 'rgba(243, 240, 232, 0.5)', fontSize: '0.875rem' }}>
            Loading narrative archive...
          </div>
        ) : (
          <MediaSquareGrid projects={projects} />
        )}
      </div>
    </div>
  )
}
