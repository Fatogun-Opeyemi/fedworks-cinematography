
import React, { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../libs/sanity.js'
import { Link } from 'react-router-dom'

export default function Music() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadMusicProjects() {
      try {
        const data = await getProjectsByCategory('music-video')

        if (!mounted) return

        setProjects(data || [])
      } catch (error) {
        console.error('Failed to load music projects:', error)

        if (mounted) {
          setProjects([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMusicProjects()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="selected-work-page">
      <section className="selected-work-intro">
        <div className="site-container">
          <div className="mobile-section-intro">
            <SectionHeader title="Music Videos" />

            <Link to="/" className="mobile-back-home">
              ← Back Home
            </Link>
          </div>
        </div>
      </section>

      <section className="selected-work-projects">
        <div className="site-container">
          <MediaSquareGrid
            projects={projects}
            showFilters={false}
            showCategory={false}
            isLoading={loading}
          />
        </div>
      </section>
    </div>
  )
}
