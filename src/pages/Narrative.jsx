import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../libs/sanity.js'
import { Link } from 'react-router-dom'


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
    <div className="narrative-strip-section archive-media-grid" style={{ minHeight: '80vh', paddingTop: '2rem' }}>
      <div className="site-container">
        <div className="mobile-section-intro">
          <SectionHeader title="Narrative" />

          <Link to="/" className="mobile-back-home">
            ← Back Home
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '4rem 0', color: 'rgba(243, 240, 232, 0.5)', fontSize: '0.875rem' }}>
            Loading narrative archive...
          </div>
        ) : (
          <MediaSquareGrid projects={projects} showCategory={false} />
        )}
      </div>
    </div>
  )
}
