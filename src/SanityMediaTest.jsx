import { useEffect, useState } from 'react'

import {
    getProjects,
    urlFor,
    getFileUrl,
    formatProjectDate,
    getCategoryLabel,
} from './libs/sanity.js'
export default function SanityMediaTest() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadProjects() {
            try {
                setLoading(true)
                setError(null)

                const data = await getProjects()

                if (!cancelled) {
                    setProjects(data || [])
                }
            } catch (err) {
                console.error('Failed to load Sanity projects:', err)

                if (!cancelled) {
                    setError(err)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadProjects()

        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return (
            <main style={styles.page}>
                <p style={styles.status}>Loading projects…</p>
            </main>
        )
    }

    if (error) {
        return (
            <main style={styles.page}>
                <div style={styles.error}>
                    <h1>Sanity connection failed</h1>
                    <p>{error.message}</p>
                </div>
            </main>
        )
    }

    if (!projects.length) {
        return (
            <main style={styles.page}>
                <p style={styles.status}>
                    No published projects found.
                </p>
            </main>
        )
    }

    return (
        <main style={styles.page}>
            <header style={styles.header}>
                <p style={styles.eyebrow}>FEDWORKS / SANITY</p>
                <h1>Projects</h1>
                <p style={styles.intro}>
                    Content coming directly from the Sanity Content Lake.
                </p>
            </header>

            <section style={styles.grid}>
                {projects.map(project => {
                    const cover = project.coverMedia

                    const coverImage =
                        cover?.type === 'image' && cover.image
                            ? urlFor(cover.image)
                                .width(1600)
                                .auto('format')
                                .url()
                            : null

                    const coverVideo =
                        cover?.type === 'video'
                            ? getFileUrl(cover.video)
                            : null

                    const poster =
                        cover?.type === 'video' && cover.poster
                            ? urlFor(cover.poster)
                                .width(1600)
                                .auto('format')
                                .url()
                            : null

                    return (
                        <article
                            key={project._id}
                            style={styles.card}
                        >
                            <div style={styles.media}>
                                {cover?.type === 'video' && coverVideo ? (
                                    <video
                                        src={coverVideo}
                                        poster={poster || undefined}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls
                                        style={styles.video}
                                    />
                                ) : coverImage ? (
                                    <img
                                        src={coverImage}
                                        alt={
                                            cover.alt ||
                                            project.title ||
                                            'FEDWORKS project'
                                        }
                                        style={styles.image}
                                    />
                                ) : (
                                    <div style={styles.noMedia}>
                                        No cover media
                                    </div>
                                )}
                            </div>

                            <div style={styles.info}>
                                <div style={styles.meta}>
                                    <span>
                                        {formatProjectDate(
                                            project.month,
                                            project.year
                                        )}
                                    </span>

                                    {project.categories?.map(category => (
                                        <span key={category}>
                                            {getCategoryLabel(category)}
                                        </span>
                                    ))}
                                </div>

                                <h2>{project.title}</h2>

                                {project.clientOrArtist && (
                                    <p style={styles.client}>
                                        {project.clientOrArtist}
                                    </p>
                                )}

                                {project.description && (
                                    <p style={styles.description}>
                                        {project.description}
                                    </p>
                                )}

                                <p style={styles.slug}>
                                    /work/{project.slug?.current}
                                </p>
                            </div>
                        </article>
                    )
                })}
            </section>
        </main>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        padding: '40px 24px 80px',
        background: '#F3F0E8',
        color: '#0A0A0A',
        fontFamily: 'Futura, sans-serif',
    },

    header: {
        maxWidth: '1600px',
        margin: '0 auto 48px',
    },

    eyebrow: {
        margin: '0 0 12px',
        fontSize: '12px',
        letterSpacing: '0.14em',
        color: '#9E2F2B',
    },

    headerH1: {
        margin: 0,
    },

    intro: {
        maxWidth: '600px',
        marginTop: '12px',
        lineHeight: 1.5,
        opacity: 0.65,
    },

    grid: {
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px 24px',
    },

    card: {
        minWidth: 0,
    },

    media: {
        width: '100%',
        aspectRatio: '16 / 10',
        background: '#151515',
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },

    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },

    noMedia: {
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        color: '#F3F0E8',
        opacity: 0.5,
    },

    info: {
        paddingTop: '16px',
    },

    meta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 14px',
        marginBottom: '10px',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#9E2F2B',
    },

    client: {
        margin: '8px 0 0',
        opacity: 0.7,
    },

    description: {
        maxWidth: '600px',
        margin: '12px 0 0',
        lineHeight: 1.5,
        opacity: 0.7,
    },

    slug: {
        marginTop: '16px',
        fontSize: '11px',
        opacity: 0.45,
    },

    status: {
        padding: '40px',
    },

    error: {
        maxWidth: '700px',
        margin: '80px auto',
    },
}