
import React, { useEffect, useState } from 'react'

import MediaSquareGrid from '../components/media/MediaSquareGrid.jsx'
import Reveal from '../components/Reveal.jsx'
import { getProjectsByCategory } from '../lib/sanity/queries.js'

export default function Music() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getProjectsByCategory('music')
      .then((data) => {
        if (mounted) {
          setProjects(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setProjects([])
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="music-page">
      <style>{`
  /* =====================================================
     FEDWORKS — MUSIC ARCHIVE
     ===================================================== */

  .music - page {
  --music - gutter: clamp(1.5rem, 5vw, 5rem);

  min - height: 100svh;

  padding - top: clamp(6rem, 9vw, 9rem);
  padding - bottom: clamp(5rem, 10vw, 10rem);

  background: var(--color - off - white);
  color: var(--color - black);
}

        .music - container {
  width: min(
    calc(100 % - (var(--music - gutter) * 2)),
  1500px
          );

  margin - inline: auto;
}

        /* =====================================================
           HEADER
           ===================================================== */

        .music - header {
  display: flex;
  align - items: flex - end;
  justify - content: space - between;

  gap: 3rem;

  margin - bottom: clamp(3rem, 5vw, 5.5rem);
}

        .music - title {
  margin: 0;

  font - size: clamp(3.25rem, 6vw, 6.5rem);
  font - weight: 600;
  line - height: 0.9;
  letter - spacing: -0.06em;
}

        .music - header - meta {
  display: flex;
  align - items: center;
  gap: 0.6rem;

  padding - bottom: 0.35rem;

  font - size: 0.66rem;
  font - weight: 600;
  letter - spacing: 0.13em;
  text - transform: uppercase;

  color: rgba(0, 0, 0, 0.42);
}

        .music - header - dot {
  width: 6px;
  height: 6px;

  flex: 0 0 auto;

  background: var(--color - red);
}

        /* =====================================================
           WORK
           ===================================================== */

        .music - grid {
  width: 100 %;
}

        .music - loading {
  min - height: 40vh;

  display: flex;
  align - items: center;

  font - size: 0.78rem;
  letter - spacing: 0.04em;

  color: rgba(0, 0, 0, 0.4);
}

/* =====================================================
   TABLET
   ===================================================== */

@media(max - width: 1199px) {
          .music - page {
    --music - gutter: clamp(1.5rem, 4vw, 3rem);

    padding - top: 6.5rem;
  }

          .music - title {
    font - size: clamp(3rem, 6vw, 5.5rem);
  }

          .music - header {
    margin - bottom: 4rem;
  }
}

/* =====================================================
   MOBILE
   ===================================================== */

@media(max - width: 767px) {
          .music - page {
    --music - gutter: 1.5rem;

    padding - top: 5.5rem;
    padding - bottom: 5rem;
  }

          .music - container {
    width: calc(100 % - (var(--music - gutter) * 2));
    max - width: 640px;
  }

          .music - header {
    align - items: flex - start;
    flex - direction: column;

    gap: 1.25rem;

    margin - bottom: 3rem;
  }

          .music - title {
    font - size: clamp(2.8rem, 12vw, 4.2rem);
    line - height: 0.92;
  }

          .music - header - meta {
    padding - bottom: 0;
  }
}

/* =====================================================
   SMALL PHONES
   ===================================================== */

@media(max - width: 480px) {
          .music - page {
    --music - gutter: 1.25rem;

    padding - top: 5rem;
  }

          .music - container {
    width: calc(100 % - (var(--music - gutter) * 2));
  }

          .music - title {
    font - size: clamp(2.55rem, 12.5vw, 3.7rem);
  }

          .music - header {
    margin - bottom: 2.5rem;
  }
}

/* =====================================================
   REDUCED MOTION
   ===================================================== */

@media(prefers - reduced - motion: reduce) {
          .music - page * {
    scroll- behavior: auto;
}
        }
`}</style>

      <div className="music-container">

        <Reveal>
          <header className="music-header">
            <h1 className="music-title">
              Music Videos
            </h1>

            <div className="music-header-meta">
              <span className="music-header-dot" />
              FedWorks
            </div>
          </header>
        </Reveal>

        <section className="music-grid">
          {loading ? (
            <div className="music-loading">
              Loading...
            </div>
          ) : (
            <MediaSquareGrid projects={projects} />
          )}
        </section>

      </div>
    </main>
  )
}
