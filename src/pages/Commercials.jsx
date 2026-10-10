import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../libs/sanity.js'
import { Link } from 'react-router-dom'

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
    <div className="selected-work-section archive-media-grid" style={{ minHeight: '80vh', paddingTop: '2rem' }}>
      <div className="site-container">
        <div className="mobile-section-intro">
          <SectionHeader title="Commercials" />

          <Link to="/" className="mobile-back-home">
            ← Back Home
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '4rem 0', color: 'rgba(10, 10, 10, 0.5)', fontSize: '0.875rem' }}>
            Loading commercial commissions...
          </div>
        ) : (
          <MediaSquareGrid
            projects={projects}
            showCategory={false}

          />
        )}
      </div>
    </div>
  )
}
