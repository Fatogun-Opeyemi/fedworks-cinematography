// import React, { useState } from 'react'

// import MediaSquareCard from './MediaSquareCard.jsx'

// export default function MediaSquareGrid({
//   projects = [],
//   showFilters = false,
//   activeFilter = 'all',
//   onFilterChange,
//   showCategory = true,
//   showMetadata = true,
// }) {
//   const [internalFilter, setInternalFilter] =
//     useState('all')

//   const currentFilter =
//     onFilterChange
//       ? activeFilter
//       : internalFilter

//   const filterTabs = [
//     {
//       id: 'all',
//       label: 'ALL',
//     },
//     {
//       id: 'music-video',
//       label: 'MUSIC VIDEO',
//     },
//     {
//       id: 'documentary',
//       label: 'DOCUMENTARY',
//     },
//     {
//       id: 'commercial',
//       label: 'COMMERCIAL',
//     },
//     {
//       id: 'narrative',
//       label: 'NARRATIVE',
//     },
//     {
//       id: 'social-content',
//       label: 'SOCIAL CONTENT',
//     },
//     {
//       id: 'bts',
//       label: 'BTS',
//     },
//   ]

//   const handleTabClick = (id) => {
//     if (onFilterChange) {
//       onFilterChange(id)
//     } else {
//       setInternalFilter(id)
//     }
//   }

//   const filteredProjects =
//     currentFilter === 'all'
//       ? projects
//       : projects.filter((project) => {
//         const filter = String(
//           currentFilter || '',
//         ).toLowerCase()

//         const categories = Array.isArray(
//           project.categories,
//         )
//           ? project.categories
//           : []

//         return categories.some(
//           (category) =>
//             String(category).toLowerCase() ===
//             filter,
//         )
//       })

//   return (
//     <div className="square-grid-container">
//       {showFilters && (
//         <div
//           className="square-filter-bar"
//           role="tablist"
//           aria-label="Filter works"
//         >
//           {filterTabs.map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               role="tab"
//               aria-selected={
//                 currentFilter === tab.id
//               }
//               onClick={() =>
//                 handleTabClick(tab.id)
//               }
//               className={`square-filter-btn ${currentFilter === tab.id
//                 ? 'active'
//                 : ''
//                 }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       )}

//       {filteredProjects.length === 0 ? (
//         <div
//           style={{
//             padding: '3.5rem 0',
//             color: 'rgba(10, 10, 10, 0.6)',
//             fontSize: '0.875rem',
//           }}
//         >
//           No projects currently listed
//           under this selection.
//         </div>
//       ) : (
//         <div className="square-media-grid">
//           {filteredProjects.map(
//             (project, index) => (
//               <MediaSquareCard
//                 key={
//                   project._id ||
//                   `${project.title}-${index}`
//                 }
//                 showMetadata={showMetadata}
//                 project={project}
//                 showCategory={showCategory}
//                 delay={Math.min(
//                   index * 0.05,
//                   0.25,
//                 )}

//               />
//             ),
//           )}
//         </div>
//       )}
//     </div>
//   )
// }




import React, { useState } from 'react'
import MediaSquareCard from './MediaSquareCard.jsx'

export default function MediaSquareGrid({
  projects = [],
  showFilters = false,
  activeFilter = 'all',
  onFilterChange,
  showCategory = true,
  showMetadata = true,
  isLoading = false,
}) {
  const [internalFilter, setInternalFilter] = useState('all')

  const currentFilter = onFilterChange
    ? activeFilter
    : internalFilter

  const filterTabs = [
    { id: 'all', label: 'ALL' },
    { id: 'music-video', label: 'MUSIC VIDEO' },
    { id: 'documentary', label: 'DOCUMENTARY' },
    { id: 'commercial', label: 'COMMERCIAL' },
    { id: 'narrative', label: 'NARRATIVE' },
    { id: 'social-content', label: 'SOCIAL CONTENT' },
    { id: 'bts', label: 'BTS' },
  ]

  const handleTabClick = (id) => {
    if (onFilterChange) {
      onFilterChange(id)
    } else {
      setInternalFilter(id)
    }
  }

  const filteredProjects =
    currentFilter === 'all'
      ? projects
      : projects.filter((project) => {
        const filter = String(currentFilter || '').toLowerCase()
        const categories = Array.isArray(project.categories)
          ? project.categories
          : []

        return categories.some(
          (category) =>
            String(category).toLowerCase() === filter,
        )
      })

  return (
    <div className="square-grid-container">
      <style>{`
        .square-grid-skeleton {
          min-width: 0;
          animation: square-skeleton-enter 0.2s ease-out both;
        }

        .square-grid-skeleton .skeleton-media {
          display: block;
          width: 100%;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: linear-gradient(
            100deg,
            #e9e7e3 25%,
            #f4f2ef 45%,
            #e9e7e3 65%
          );
          background-size: 300% 100%;
          animation: square-skeleton-shimmer 1.5s ease-in-out infinite;
        }

        .square-grid-skeleton .skeleton-meta {
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding-top: 12px;
        }

        .square-grid-skeleton .skeleton-line {
          display: block;
          height: 10px;
          width: 58%;
          border-radius: 2px;
          background: linear-gradient(
            100deg,
            #e9e7e3 25%,
            #f4f2ef 45%,
            #e9e7e3 65%
          );
          background-size: 300% 100%;
          animation: square-skeleton-shimmer 1.5s ease-in-out infinite;
        }

        .square-grid-skeleton .skeleton-line-short {
          width: 36%;
          height: 8px;
        }

        @keyframes square-skeleton-shimmer {
          from { background-position: 100% 0; }
          to { background-position: -100% 0; }
        }

        @keyframes square-skeleton-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .square-grid-skeleton,
          .square-grid-skeleton .skeleton-media,
          .square-grid-skeleton .skeleton-line {
            animation: none;
          }
        }
      `}</style>

      {showFilters && (
        <div
          className="square-filter-bar"
          role="tablist"
          aria-label="Filter works"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={currentFilter === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`square-filter-btn ${currentFilter === tab.id ? 'active' : ''
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div
          className="square-media-grid"
          aria-label="Loading projects"
          aria-busy="true"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={`skeleton-${index}`}
              className="square-grid-skeleton"
              aria-hidden="true"
            >
              <div className="skeleton-media" />
              {showMetadata && (
                <div className="skeleton-meta">
                  <span className="skeleton-line" />
                  <span className="skeleton-line skeleton-line-short" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 0',
            color: 'rgba(10, 10, 10, 0.6)',
            fontSize: '0.875rem',
          }}
        >
          No projects currently listed
          under this selection.
        </div>
      ) : (
        <div className="square-media-grid">
          {filteredProjects.map((project, index) => (
            <MediaSquareCard
              key={project._id || `${project.title}-${index}`}
              showMetadata={showMetadata}
              project={project}
              showCategory={showCategory}
              delay={Math.min(index * 0.05, 0.25)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
