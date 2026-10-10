
// // import React, { useEffect, useState } from 'react'

// // import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
// // import Reveal from '../components/Reveal.jsx'

// // import { getProjectsByCategory } from '../lib/sanity/queries.js'

// // export default function Music() {
// //   const [projects, setProjects] = useState([])
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     let mounted = true

// //     getProjectsByCategory('music')
// //       .then((data) => {
// //         if (mounted) {
// //           setProjects(data)
// //           setLoading(false)
// //         }
// //       })
// //       .catch(() => {
// //         if (mounted) {
// //           setProjects([])
// //           setLoading(false)
// //         }
// //       })

// //     return () => {
// //       mounted = false
// //     }
// //   }, [])

// //   return (
// //     <main className="music-page media-grid">
// //       <style>{`
// //         /* =====================================================
// //            FEDWORKS — MUSIC ARCHIVE
// //            ===================================================== */

// //         .music-page {
// //           --music-gutter: clamp(1.5rem, 5vw, 5rem);

// //           min-height: 100svh;
// //           padding-top: 2rem;
// //           padding-bottom: clamp(5rem, 9vw, 9rem);

// //           background: var(--color-off-white);
// //           color: var(--color-black);
// //         }

// //         .music-container {
// //           width: min(
// //             calc(100% - (var(--music-gutter) * 2)),
// //             1500px
// //           );

// //           margin-inline: auto;
// //         }

// //         /* =====================================================
// //            HEADER
// //            ===================================================== */

// //         .music-header {
// //           margin-bottom: clamp(2.75rem, 4vw, 4.5rem);
// //         }

// //         .music-title {
// //           margin: 0;

// //           font-size: clamp(2.25rem, 3.8vw, 4rem);
// //           font-weight: 500;
// //           line-height: 0.95;
// //           letter-spacing: -0.045em;
// //         }

// //         /* =====================================================
// //            GRID
// //            ===================================================== */

// //         .music-grid {
// //           width: 100%;
// //         }

// //         .music-loading {
// //           min-height: 40vh;

// //           display: flex;
// //           align-items: center;
// //           justify-content: center;

// //           font-size: 0.78rem;
// //           font-weight: 400;
// //           letter-spacing: 0.04em;

// //           color: rgba(0, 0, 0, 0.4);
// //         }

// //         /* =====================================================
// //            LARGE SCREENS
// //            ===================================================== */

// //         @media (min-width: 1600px) {
// //           .music-container {
// //             max-width: 1600px;
// //           }
// //         }

// //         /* =====================================================
// //            TABLET
// //            ===================================================== */

// //         @media (max-width: 1199px) {
// //           .music-page {
// //             --music-gutter: clamp(2rem, 4vw, 3.5rem);

// //             padding-top: 2rem;
// //             padding-bottom: 6.5rem;
// //           }

// //           .music-title {
// //             font-size: clamp(2.25rem, 4.5vw, 3.5rem);
// //           }

// //           .music-header {
// //             margin-bottom: 3.5rem;
// //           }
// //         }

// //         /* =====================================================
// //            MOBILE
// //            ===================================================== */

// //         @media (max-width: 767px) {
// //           .music-page {
// //             --music-gutter: 1.5rem;

// //             padding-top: 2rem;
// //             padding-bottom: 5rem;
// //           }

// //           .music-container {
// //             width: calc(100% - (var(--music-gutter) * 2));
// //             max-width: 640px;
// //           }

// //           .music-header {
// //             margin-bottom: 2.5rem;
// //           }

// //           .music-title {
// //             font-size: clamp(2.35rem, 10vw, 3.4rem);
// //             line-height: 0.95;
// //           }
// //         }

// //         /* =====================================================
// //            SMALL PHONES
// //            ===================================================== */

// //         @media (max-width: 480px) {
// //           .music-page {
// //             --music-gutter: 1.25rem;

// //             padding-top: 2rem;
// //             padding-bottom: 4.5rem;
// //           }

// //           .music-container {
// //             width: calc(100% - (var(--music-gutter) * 2));
// //           }

// //           .music-header {
// //             margin-bottom: 2.25rem;
// //           }

// //           .music-title {
// //             font-size: clamp(2.2rem, 11vw, 3rem);
// //           }
// //         }

// //         /* =====================================================
// //    GRID
// //    ===================================================== */

// // .music-grid {
// //   width: 100%;
// // }

// // .music-grid .square-media-grid {
// //   grid-template-columns: 1fr;
// // }

// // @media (min-width: 500px) and (max-width: 799px) {
// //   .music-grid .square-media-grid {
// //     grid-template-columns: repeat(2, minmax(0, 1fr));
// //   }
// // }

// // @media (min-width: 800px) and (max-width: 1023px) {
// //   .music-grid .square-media-grid {
// //     grid-template-columns: repeat(4, minmax(0, 1fr));
// //   }
// // }

// // @media (min-width: 1024px) {
// //   .music-grid .square-media-grid {
// //     grid-template-columns: repeat(3, minmax(0, 1fr));
// //   }
// // }
// //         /* =====================================================
// //            REDUCED MOTION
// //            ===================================================== */

// //         @media (prefers-reduced-motion: reduce) {
// //           .music-page * {
// //             scroll-behavior: auto;
// //           }


// //         }
// //       `}</style>

// //       <div className="music-container">
// //         <Reveal>
// //           <header className="music-header">
// //             <h1 className="music-title">
// //               Music Videos
// //             </h1>
// //           </header>
// //         </Reveal>

// //         <section className="music-grid">
// //           {loading ? (
// //             <div className="music-loading">
// //               Loading...
// //             </div>
// //           ) : (
// //             <MediaSquareGrid projects={projects} />
// //           )}
// //         </section>
// //       </div>
// //     </main>
// //   )
// // }


// import React, { useEffect, useState } from 'react'
// import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
// import Reveal from '../components/Reveal.jsx'
// import { getProjectsByCategory } from '../libs/sanity.js'

// export default function Music() {
//   const [projects, setProjects] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let mounted = true

//     getProjectsByCategory('music-video')
//       .then((data) => {
//         if (mounted) {
//           setProjects(data)
//           setLoading(false)
//         }
//       })
//       .catch(() => {
//         if (mounted) {
//           setProjects([])
//           setLoading(false)
//         }
//       })

//     return () => {
//       mounted = false
//     }
//   }, [])

//   return (
//     <main className="music-page">
//       <style>{`
//         .music-page {
//           --music-gutter: clamp(1.5rem, 5vw, 5rem);
//           min-height: 100svh;
//           padding-top: 2rem;
//           padding-bottom: clamp(5rem, 9vw, 9rem);
//           background: var(--color-off-white);
//           color: var(--color-black);
//         }

//         .music-container {
//           width: min(
//             calc(100% - (var(--music-gutter) * 2)),
//             1500px
//           );
//           margin-inline: auto;
//         }

//         .music-header {
//           margin-bottom: clamp(2.75rem, 4vw, 4.5rem);
//         }

//         .music-title {
//           margin: 0;
//           font-size: clamp(2.25rem, 3.8vw, 4rem);
//           font-weight: 600;
//           line-height: 0.95;
//           letter-spacing: -0.045em;
//         }

//         .music-grid {
//           width: 100%;
//         }

//         .music-loading {
//           min-height: 40vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 0.78rem;
//           font-weight: 400;
//           letter-spacing: 0.04em;
//           color: rgba(0, 0, 0, 0.4);
//         }

//         .music-grid .square-media-grid {
//           grid-template-columns: 1fr;
//         }

//         @media (min-width: 500px) and (max-width: 799px) {
//           .music-grid .square-media-grid {
//             grid-template-columns: repeat(2, minmax(0, 1fr));
//           }
//         }

//         @media (min-width: 800px) and (max-width: 1023px) {
//           .music-grid .square-media-grid {
//             grid-template-columns: repeat(4, minmax(0, 1fr));
//           }
//         }

//         @media (min-width: 1024px) {
//           .music-grid .square-media-grid {
//             grid-template-columns: repeat(3, minmax(0, 1fr));
//           }
//         }

//         @media (max-width: 767px) {
//           .music-page {
//             --music-gutter: 1.5rem;
//             padding-top: 2rem;
//             padding-bottom: 5rem;
//           }

//           .music-header {
//             margin-bottom: 2.5rem;
//           }

//           .music-title {
//             font-size: clamp(2.35rem, 10vw, 3.4rem);
//           }
//         }

//         @media (max-width: 480px) {
//           .music-page {
//             --music-gutter: 1.25rem;
//             padding-top: 2rem;
//             padding-bottom: 4.5rem;
//           }

//           .music-header {
//             margin-bottom: 2.25rem;
//           }

//           .music-title {
//             font-size: clamp(2.2rem, 11vw, 3rem);
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .music-page * {
//             scroll-behavior: auto;
//           }
//         }
//       `}</style>

//       <div className="music-container">
//         <Reveal>
//           {/* <header className="music-header">
//             <h1 className="music-title">Music Videos</h1>
//           </header> */}
//         </Reveal>

//         <section className="music-grid">
//           {loading ? (
//             <div className="music-loading">
//               Loading...
//             </div>
//           ) : (
//             <MediaSquareGrid
//               projects={projects}
//               showCategory={false}
//             />
//           )}
//         </section>
//       </div>
//     </main>
//   )
// }


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

            <Link
              to="/"
              className="mobile-back-home"
            >
              ← Back Home
            </Link>

          </div>

        </div>

      </section>

      <section className="selected-work-projects">

        <div className="site-container">

          {loading ? (

            <div className="selected-work-loading">

              Retrieving music video work...

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
