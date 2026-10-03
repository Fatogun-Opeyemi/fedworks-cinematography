import React, { useState } from 'react'
import ProjectCard from './ProjectCard.jsx'

export default function ProjectGrid({
  projects,
  showFilters = false,
  activeFilter = 'all',
  onFilterChange,
}) {
  const [internalFilter, setInternalFilter] = useState('all')
  const currentFilter = onFilterChange ? activeFilter : internalFilter

  const filterList = [
    { id: 'all', label: 'All Projects' },
    { id: 'narrative', label: 'Narrative' },
    { id: 'commercials', label: 'Commercials' },
    { id: 'music', label: 'Music' },
    { id: 'on-set', label: 'On Set' },
  ]

  const handleFilterClick = (id) => {
    if (onFilterChange) {
      onFilterChange(id)
    } else {
      setInternalFilter(id)
    }
  }

  const displayedProjects = currentFilter === 'all'
    ? projects
    : projects.filter(p => p.category === currentFilter)

  return (
    <div>
      {showFilters && (
        <div className="category-filter-bar" role="tablist" aria-label="Filter works by category">
          {filterList.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={currentFilter === tab.id}
              onClick={() => handleFilterClick(tab.id)}
              className={`category-filter-btn ${currentFilter === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="project-grid">
        {displayedProjects.map((project, index) => (
          <ProjectCard
            key={project._id}
            project={project}
            delay={Math.min(index * 0.06, 0.3)}
          />
        ))}
      </div>
    </div>
  )
}
