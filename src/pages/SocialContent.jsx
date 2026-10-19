
import React, { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { Link } from 'react-router-dom'
import { getProjectsByCategory } from '../libs/sanity.js'

export default function SocialContent() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSocialContent() {
      try {
        const data = await getProjectsByCategory('social-content')

        if (mounted) {
          // Limit to 20 items
          setProjects(
            Array.isArray(data) ? data.slice(0, 20) : []
          )
        }
      } catch (error) {
        console.error('Failed to load social content:', error)

        if (mounted) {
          setProjects([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSocialContent()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="social-content-page">
      <section
        className="social-content-intro"
        style={{ paddingTop: '2rem' }}
      >
        <div className="site-container">
          <div className="mobile-section-intro">
            <SectionHeader title="Social content" />

            <Link to="/" className="mobile-back-home">
              ← Back Home
            </Link>
          </div>
        </div>
      </section>

      <section className="social-content-projects archive-media-grid">
        <div className="site-container">
          {loading ? (
            <MediaSquareGrid
              projects={[]}
              showFilters={false}
              showCategory={false}
              isLoading={true}
            />
          ) : projects.length === 0 ? (
            <div className="social-content-empty">
              No social content projects available.
            </div>
          ) : (
            <MediaSquareGrid
              projects={projects}
              showFilters={false}
              showCategory={false}
            />
          )}
        </div>
      </section>
    </div>
  )
}
