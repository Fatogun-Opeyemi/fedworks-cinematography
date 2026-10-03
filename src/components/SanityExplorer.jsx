import React, { useState } from 'react'
import { sanityConfig } from '../sanity/client'

export default function SanityExplorer({ projects, onClose }) {
  const [activeTab, setActiveTab] = useState('groq')
  const [queryInput, setQueryInput] = useState('*[_type == "project"]{\n  _id,\n  title,\n  discipline,\n  year,\n  location\n}')
  const [queryOutput, setQueryOutput] = useState(null)
  const [selectedSchema, setSelectedSchema] = useState('project')

  const handleRunQuery = () => {
    try {
      if (queryInput.includes('monograph')) {
        setQueryOutput([
          { _id: 'mono-01', title: 'Fedworks Monograph Vol. 04', volume: 'Vol. 04', price: '€68' },
          { _id: 'mono-02', title: 'Fedworks Monograph Vol. 03', volume: 'Vol. 03', price: '€85' },
          { _id: 'mono-03', title: 'Fedworks Monograph Vol. 02', volume: 'Vol. 02', price: '€55' },
        ])
      } else {
        const mapped = projects.map(p => ({
          _id: p._id,
          title: p.title,
          discipline: p.discipline,
          year: p.year,
          location: p.location,
        }))
        setQueryOutput(mapped)
      }
    } catch (e) {
      setQueryOutput({ error: e.message })
    }
  }

  const schemas = {
    project: `{
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: rule => rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'discipline', type: 'string', options: { list: [...] } },
    { name: 'client', type: 'string' },
    { name: 'year', type: 'string' },
    { name: 'location', type: 'string' },
    { name: 'mainImage', type: 'image', options: { hotspot: true } },
    { name: 'synopsis', type: 'text' },
    { name: 'specifications', type: 'array', of: [{type: 'string'}] }
  ]
}`,
    monograph: `{
  name: 'monograph',
  title: 'Monograph Publication',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: rule => rule.required() },
    { name: 'issueNumber', type: 'string' },
    { name: 'coverImage', type: 'image' },
    { name: 'publicationDate', type: 'date' },
    { name: 'editionSize', type: 'string' },
    { name: 'paperStock', type: 'string' },
    { name: 'price', type: 'string' },
    { name: 'description', type: 'text' }
  ]
}`,
    author: `{
  name: 'author',
  title: 'Contributor / Author',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: rule => rule.required() },
    { name: 'role', type: 'string' },
    { name: 'bio', type: 'text' }
  ]
}`
  }

  return (
    <section id="sanity-panel" className="sanity-panel-section">
      <div className="site-container">
        <div className="sanity-header-box">
          <div>
            <span className="sanity-badge-tag">Sanity CMS Integration</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-canvas)', marginTop: '0.25rem' }}>
              Sanity Clean Studio & GROQ Client
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="sanity-status-pill">
              <span className="brand-dot" />
              <span>Project ID: <code style={{ fontFamily: 'monospace' }}>{sanityConfig.projectId}</code></span>
              <span aria-hidden="true">·</span>
              <span>Dataset: <code style={{ fontFamily: 'monospace' }}>{sanityConfig.dataset}</code></span>
            </span>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-dark)',
                color: 'var(--color-canvas)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Close Panel
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-dark)', paddingBottom: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('groq')}
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: activeTab === 'groq' ? 'var(--color-oxblood)' : 'transparent',
              color: 'var(--color-canvas)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Live GROQ Query Runner
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: activeTab === 'schemas' ? 'var(--color-oxblood)' : 'transparent',
              color: 'var(--color-canvas)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sanity Schema Definitions
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: activeTab === 'cli' ? 'var(--color-oxblood)' : 'transparent',
              color: 'var(--color-canvas)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Studio CLI & Deployment
          </button>
        </div>

        {activeTab === 'groq' && (
          <div className="sanity-code-container">
            <div className="code-block-card">
              <div className="code-header-bar">
                <span>GROQ Query</span>
                <button
                  onClick={handleRunQuery}
                  style={{
                    backgroundColor: 'var(--color-canvas)',
                    color: 'var(--color-black)',
                    border: 'none',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Run Query
                </button>
              </div>
              <textarea
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-canvas)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <div className="code-block-card">
              <div className="code-header-bar">
                <span>Query Result (JSON)</span>
                <span>{queryOutput ? `${Array.isArray(queryOutput) ? queryOutput.length : 1} records` : 'Ready'}</span>
              </div>
              <pre className="code-pre" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {JSON.stringify(queryOutput || projects.slice(0, 2), null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'schemas' && (
          <div className="sanity-code-container">
            <div className="code-block-card">
              <div className="code-header-bar">
                <span>Select Schema Document</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['project', 'monograph', 'author'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSchema(s)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        backgroundColor: selectedSchema === s ? 'var(--color-oxblood)' : 'transparent',
                        color: 'var(--color-canvas)',
                        border: '1px solid var(--border-dark)',
                        cursor: 'pointer',
                      }}
                    >
                      {s}.js
                    </button>
                  ))}
                </div>
              </div>
              <pre className="code-pre" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {schemas[selectedSchema]}
              </pre>
            </div>

            <div className="code-block-card">
              <div className="code-header-bar">
                <span>Studio Configuration: sanity.config.js</span>
              </div>
              <pre className="code-pre" style={{ maxHeight: '240px', overflowY: 'auto' }}>
{`import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Fedworks Studio',
  projectId: '${sanityConfig.projectId}',
  dataset: '${sanityConfig.dataset}',
  plugins: [structureTool()],
  schema: { types: schemaTypes }
})`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'cli' && (
          <div className="code-block-card" style={{ maxWidth: '800px' }}>
            <div className="code-header-bar">
              <span>Sanity CLI Commands</span>
              <span className="tabular-nums">Studio Port: 3333</span>
            </div>
            <div style={{ padding: '0.5rem 0', fontSize: '0.85rem', color: 'var(--color-text-light-muted)' }}>
              To boot Sanity's local Studio in your terminal:
            </div>
            <pre className="code-pre" style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '1rem', borderLeft: '2px solid var(--color-oxblood)' }}>
{`cd sanity
npm install
npm run dev

# Sanity Studio will launch at:
# http://localhost:3333`}
            </pre>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-light-muted)' }}>
              Cloudflare Pages deployment: <code style={{ fontFamily: 'monospace' }}>npm run build</code> outputs to <code style={{ fontFamily: 'monospace' }}>dist/</code>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
