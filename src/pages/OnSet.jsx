// import React, { useEffect, useState } from 'react'
// import SectionHeader from '../components/SectionHeader.jsx'
// import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
// import { getBtsMedia, urlFor, getProjectsByCategory } from '../libs/sanity.js'
// import MediaViewer from '../components/media/MediaViewer.jsx'
// // import { getProjectsByCategory } from '../libs/sanity.js'
// import { Link } from 'react-router-dom'

// export default function OnSet() {
//   const [btsItems, setBtsItems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     let mounted = true

//     async function loadBtsContent() {
//       try {
//         setError('')

//         const data = await getProjectsByCategory('bts')

//         if (!mounted) return

//         setBtsItems(Array.isArray(data) ? data : [])
//       } catch (err) {
//         console.error('Failed to load BTS content:', err)

//         if (!mounted) return

//         setBtsItems([])
//         setError('Unable to load BTS media.')
//       } finally {
//         if (mounted) {
//           setLoading(false)
//         }
//       }
//     }

//     loadBtsContent()

//     return () => {
//       mounted = false
//     }
//   }, [])

//   console.log(btsItems);


//   return (
//     <div
//       className="selected-work-section archive-media-grid"
//       style={{
//         minHeight: '80vh',
//         paddingTop: '2rem',
//       }}
//     >
//       <div className="site-container">
//         <div className="mobile-section-intro">
//           <SectionHeader title="Bts" />

//           <Link to="/" className="mobile-back-home">
//             ← Back Home
//           </Link>
//         </div>

//         {loading ? (
//           <MediaSquareGrid
//             projects={[]}
//             showFilters={false}
//             showCategory={false}
//             showMetadata={false}
//             isLoading={true}
//           />
//         ) : error ? (
//           <div
//             style={{
//               padding: '4rem 0',
//               color: 'rgba(10, 10, 10, 0.6)',
//               fontSize: '0.875rem',
//             }}
//           >
//             {error}
//           </div>
//         ) : btsItems.length === 0 ? (
//           <div
//             style={{
//               padding: '4rem 0',
//               color: 'rgba(10, 10, 10, 0.6)',
//               fontSize: '0.875rem',
//             }}
//           >
//             No behind-the-scenes media has been published yet.
//           </div>
//         ) : (
//           <MediaSquareGrid
//             projects={btsItems}
//             showFilters={false}
//             showCategory={false}
//             showMetadata={false}
//           />
//         )}
//       </div>
//     </div>
//   )
// }




import React, { useCallback, useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import MediaViewer from '../components/media/MediaViewer.jsx'
import {
  getProjectsByCategory,
  urlFor,
  getFileUrl,
} from '../libs/sanity.js'
import { Link } from 'react-router-dom'

export default function OnSet() {
  const [btsItems, setBtsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadBtsContent() {
      try {
        setError('')

        const data = await getProjectsByCategory('bts')

        if (!mounted) return

        setBtsItems(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load BTS content:', err)

        if (!mounted) return

        setBtsItems([])
        setError('Unable to load BTS media.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadBtsContent()

    return () => {
      mounted = false
    }
  }, [])

  // Only projects with actual cover media are navigable.
  const galleryItems = btsItems.filter((project) => {
    const media = project?.coverMedia

    const slug =
      typeof project?.slug === 'string'
        ? project.slug
        : project?.slug?.current

    const hasUsableMedia =
      (media?.type === 'image' && media?.image) ||
      (media?.type === 'video' && media?.video)

    return Boolean(slug && hasUsableMedia)
  })

  const openBtsMedia = useCallback((project) => {
    const index = galleryItems.findIndex((item) => {
      if (item._id && project._id) {
        return item._id === project._id
      }

      return item === project
    })

    if (index !== -1) {
      setSelectedIndex(index)
    }
  }, [galleryItems])

  const closeViewer = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || galleryItems.length === 0) {
        return current
      }

      return (current + 1) % galleryItems.length
    })
  }, [galleryItems.length])

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || galleryItems.length === 0) {
        return current
      }

      return (
        current - 1 + galleryItems.length
      ) % galleryItems.length
    })
  }, [galleryItems.length])

  const selectedProject =
    selectedIndex !== null
      ? galleryItems[selectedIndex]
      : null

  const selectedMedia = selectedProject?.coverMedia

  const selectedIsVideo =
    selectedMedia?.type === 'video'

  // The viewer uses the original image URL, not the cropped thumbnail URL.
  const viewerImageUrl =
    selectedMedia?.type === 'image' && selectedMedia?.image
      ? urlFor(selectedMedia.image)
        .quality(90)
        .auto('format')
        .url()
      : null

  const viewerVideoUrl =
    selectedIsVideo && selectedMedia?.video
      ? getFileUrl(selectedMedia.video)
      : null

  const viewerPosterUrl =
    selectedIsVideo && selectedMedia?.poster
      ? urlFor(selectedMedia.poster)
        .quality(90)
        .auto('format')
        .url()
      : null

  const viewerMediaSrc = selectedIsVideo
    ? viewerVideoUrl
    : viewerImageUrl

  return (
    <>
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
            <MediaSquareGrid
              projects={[]}
              showFilters={false}
              showCategory={false}
              showMetadata={false}
              isLoading={true}
            />
          ) : error ? (
            <div
              style={{
                padding: '4rem 0',
                color: 'rgba(10, 10, 10, 0.6)',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          ) : btsItems.length === 0 ? (
            <div
              style={{
                padding: '4rem 0',
                color: 'rgba(10, 10, 10, 0.6)',
                fontSize: '0.875rem',
              }}
            >
              No behind-the-scenes media has been published yet.
            </div>
          ) : (
            <MediaSquareGrid
              projects={btsItems}
              showFilters={false}
              showCategory={false}
              showMetadata={false}
              onBtsMediaClick={openBtsMedia}
            />
          )}
        </div>
      </div>

      {selectedProject && (
        <MediaViewer
          isOpen={true}
          onClose={closeViewer}
          mediaType={selectedIsVideo ? 'video' : 'image'}
          mediaSrc={viewerMediaSrc}
          posterSrc={viewerPosterUrl}
          mediaAlt={
            selectedMedia?.alt ||
            selectedProject.title ||
            'Behind the scenes'
          }
          title={selectedProject.title || 'Behind the scenes'}
          caption="Behind the scenes"
          showControls={selectedIsVideo}
          onNext={showNext}
          onPrevious={showPrevious}
          currentIndex={selectedIndex}
          totalItems={galleryItems.length}
        />
      )}
    </>
  )
}
