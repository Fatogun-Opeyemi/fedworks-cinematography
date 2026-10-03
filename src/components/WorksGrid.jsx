import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function WorksGrid({ projects, onSelectProject }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = [
    'All',
    'Spatial Architecture',
    'Monograph & Print',
    'Cinema & Direction',
    'Industrial Design',
  ]

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.discipline === selectedCategory)

  return (
    <section id="works" className="works-section">
      <div className="site-container">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <span className="section-label">Selected Portfolio</span>
            <h2 className="section-heading">Built Works & Documents</h2>
          </div>

          {/* Interactive filter controls */}
          <div className="filter-tabs-container" role="tablist" aria-label="Filter works by discipline">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Works Grid */}
        <div className="works-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                layout
                key={project._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="work-card"
                onClick={() => onSelectProject(project)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectProject(project)
                  }
                }}
              >
                <div className="work-card-media">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="work-card-image"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="work-card-tag">{project.discipline}</div>
                </div>

                <div className="work-card-meta">
                  <span className="tabular-nums">{project.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.client}</span>
                </div>

                <h3 className="work-card-title">
                  <span>{project.title}</span>
                  <span className="work-card-arrow" aria-hidden="true">→</span>
                </h3>

                <p className="work-card-desc">{project.synopsis}</p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
