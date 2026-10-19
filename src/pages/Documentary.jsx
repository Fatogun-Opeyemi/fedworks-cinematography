
import React, { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import { getProjectsByCategory } from '../libs/sanity.js'
import { Link } from 'react-router-dom'

export default function Documentary() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        async function loadDocumentaryProjects() {
            try {
                const data = await getProjectsByCategory('documentary')

                if (mounted) {
                    setProjects(data || [])
                }
            } catch (error) {
                console.error('Failed to load documentary projects:', error)

                if (mounted) {
                    setProjects([])
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadDocumentaryProjects()

        return () => {
            mounted = false
        }
    }, [])

    return (
        <div className="selected-work-page">
            <section className="selected-work-intro">
                <div className="site-container">
                    <div className="mobile-section-intro">
                        <SectionHeader title="Documentary" />

                        <Link to="/" className="mobile-back-home">
                            ← Back Home
                        </Link>
                    </div>
                </div>
            </section>

            <section className="selected-work-projects">
                <div className="site-container">
                    <MediaSquareGrid
                        projects={projects}
                        showFilters={false}
                        showCategory={false}
                        isLoading={loading}
                    />
                </div>
            </section>
        </div>
    )
}
