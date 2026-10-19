
import React, { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { Link } from 'react-router-dom'
import { getFeaturedProjects } from '../libs/sanity.js'

export default function Work() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadFeaturedProjects() {
      try {
        const data = await getFeaturedProjects()

        if (!mounted) return

        setProjects(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load selected work:', error)

        if (mounted) {
          setProjects([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadFeaturedProjects()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="selected-work-page">
      <section className="selected-work-intro">
        <div className="site-container">
          <div className="mobile-section-intro">
            <SectionHeader title="Selected works" />

            <Link to="/" className="mobile-back-home">
              ← Back Home
            </Link>
          </div>
        </div>
      </section>

      <section className="selected-work-projects archive-media-grid">
        <div className="site-container">
          <MediaSquareGrid
            projects={projects}
            showFilters={false}
            isLoading={loading}
          />
        </div>
      </section>
    </div>
  )
}
