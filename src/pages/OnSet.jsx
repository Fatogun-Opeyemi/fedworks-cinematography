import React, { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getBtsItems } from '../lib/sanity/queries.js'

export default function OnSet() {
  const [btsItems, setBtsItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getBtsItems().then(data => {
      if (mounted) {
        setBtsItems(data)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  // Format BTS items for MediaSquareGrid
  const btsProjects = btsItems.map(item => ({
    _id: item._id,
    title: item.caption || 'BTS Sequence',
    category: 'on-set',
    categoryLabel: 'BTS',
    clientOrArtist: item.location || 'Location Set',
    location: item.location,
    dateFormatted: item.dateFormatted,
    poster: item.image?.asset?.url || item.posterUrl || '',
    posterUrl: item.image?.asset?.url || item.posterUrl || '',
    videoUrl: item.video?.asset?.url || item.videoUrl || null,
    slug: { current: '' },
  }))

  return (
    <div className="selected-work-section" style={{ minHeight: '80vh', paddingTop: '7.5rem' }}>
      <div className="site-container">
         <SectionHeader
           kicker="Camera Department"
           title="BTS"
           subtitle="Behind-the-scenes moments, camera rigs, optical tests, and images of the cinematographer working in the field."
         />

        {loading ? (
          <div style={{ padding: '4rem 0', color: 'rgba(10, 10, 10, 0.5)', fontSize: '0.875rem' }}>
            Loading on-set archive...
          </div>
        ) : (
          <MediaSquareGrid projects={btsProjects} />
        )}
      </div>
    </div>
  )
}
