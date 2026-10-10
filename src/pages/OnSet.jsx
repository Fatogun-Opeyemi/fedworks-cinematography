import React, {
  useEffect,
  useState,
} from 'react'

import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../libs/sanity.js'
import { Link } from 'react-router-dom'

export default function OnSet() {
  const [btsItems, setBtsItems] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let mounted = true

    async function loadBtsContent() {
      try {
        setError('')

        const data =
          await getProjectsByCategory("bts")

        if (!mounted) return

        setBtsItems(
          Array.isArray(data)
            ? data
            : [],
        )

        setLoading(false)
      } catch (err) {
        console.error(
          'Failed to load BTS content:',
          err,
        )

        if (!mounted) return

        setBtsItems([])
        setError(
          'Unable to load bts media.',
        )
        setLoading(false)
      }
    }

    loadBtsContent()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div
      className="selected-work-section archive-media-grid"
      style={{
        minHeight: '80vh',
        paddingTop: '2rem',
      }}
    >
      <div className="site-container">
        <div className="mobile-section-intro">
          <SectionHeader title="Bts" />

          <Link to="/" className="mobile-back-home">
            ← Back Home
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              padding: '4rem 0',
              color:
                'rgba(10, 10, 10, 0.5)',
              fontSize: '0.875rem',
            }}
          >
            Loading on-set archive...
          </div>
        ) : error ? (
          <div
            style={{
              padding: '4rem 0',
              color:
                'rgba(10, 10, 10, 0.6)',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        ) : btsItems.length === 0 ? (
          <div
            style={{
              padding: '4rem 0',
              color:
                'rgba(10, 10, 10, 0.6)',
              fontSize: '0.875rem',
            }}
          >
            No behind-the-scenes media
            has been published yet.
          </div>
        ) : (
          <MediaSquareGrid
            projects={btsItems}
            showFilters={false}
            showCategory={false}
            showMetadata={false}
          />
        )}
      </div>
    </div>
  )
}