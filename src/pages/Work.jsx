// import React, { useEffect, useState } from 'react'

// import SectionHeader from '../components/SectionHeader.jsx'
// import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'

// import {
//   getFeaturedProjects,
// } from '../lib/sanity/queries.js'

// export default function Work() {
//   const [projects, setProjects] = useState([])
//   const [activeCategory, setActiveCategory] = useState('all')
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let mounted = true

//     async function loadFeaturedProjects() {
//       try {
//         const data = await getFeaturedProjects()

//         if (!mounted) return

//         setProjects(data || [])
//       } catch (error) {
//         console.error('Failed to load selected work:', error)

//         if (mounted) {
//           setProjects([])
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false)
//         }
//       }
//     }

//     loadFeaturedProjects()

//     return () => {
//       mounted = false
//     }
//   }, [])

//   return (
//     <div className="selected-work-page">
//       <section className="selected-work-intro">
//         <div className="site-container">
//           <SectionHeader
//             kicker="Selected Work"
//             title="Selected Work"
//             subtitle="A curated selection of cinematography, narrative, commercial, and music projects."
//           />
//         </div>
//       </section>

//       <section className="selected-work-projects">
//         <div className="site-container">
//           {loading ? (
//             <div className="selected-work-loading">
//               Retrieving selected work...
//             </div>
//           ) : (
//             <MediaSquareGrid
//               projects={projects}
//               showFilters={true}
//               activeFilter={activeCategory}
//               onFilterChange={setActiveCategory}
//             />
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'

import SectionHeader from '../components/SectionHeader.jsx'

import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { Link } from 'react-router-dom'

import {
  getFeaturedProjects,
} from '../libs/sanity.js'

export default function Work() {
  const [projects, setProjects] = useState([])

  // const [activeCategory, setActiveCategory] = useState('all')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadFeaturedProjects() {
      try {
        const data = await getFeaturedProjects()

        if (!mounted) return

        setProjects(data || [])
      } catch (error) {
        console.error(
          'Failed to load selected work:',
          error
        )

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

      <section className="selected-work-projects">
        <div className="site-container">
          {loading ? (
            <div className="selected-work-loading">
              Retrieving selected work...
            </div>
          ) : (

            <MediaSquareGrid
              projects={projects}
              showFilters={false}
            />
          )}
        </div>
      </section>
    </div>
  )
}
