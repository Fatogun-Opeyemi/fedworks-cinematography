import React, { useState } from 'react'
import MediaSquareCard from './MediaSquareCard.jsx'

export default function MediaSquareGrid({
  projects = [],
  showFilters = false,
  activeFilter = 'all',
  onFilterChange,
}) {
  const [internalFilter, setInternalFilter] = useState('all')
  const currentFilter = onFilterChange ? activeFilter : internalFilter

  // Internal ids must match the canonical, slugified values emitted by
  // getCanonicalCategory()/normalizeProject(): music-video, documentary,
  // commercial, film, social-content.
  const filterTabs = [
    { id: 'all', label: 'ALL' },
    { id: 'music-video', label: 'MUSIC VIDEO' },
    { id: 'documentary', label: 'DOCUMENTARY' },
    { id: 'commercial', label: 'COMMERCIAL' },
    { id: 'film', label: 'FILM' },
    { id: 'social-content', label: 'SOCIAL CONTENT' },
  ]

  const handleTabClick = (id) => {
    if (onFilterChange) {
      onFilterChange(id)
    } else {
      setInternalFilter(id)
    }
  }

  const filteredProjects = currentFilter === 'all'
    ? projects
    : projects.filter(p => p.category === currentFilter)

  return (
    <div className="square-grid-container">
      {showFilters && (
        <div className="square-filter-bar" role="tablist" aria-label="Filter works">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={currentFilter === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`square-filter-btn ${currentFilter === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div style={{ padding: '3.5rem 0', color: 'rgba(10, 10, 10, 0.6)', fontSize: '0.875rem' }}>
          No projects currently listed under this selection.
        </div>
      ) : (
        <div className="square-media-grid">
          {filteredProjects.map((project, index) => (
            <MediaSquareCard
              key={project._id}
              project={project}
              delay={Math.min(index * 0.05, 0.25)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
