

import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'SELECTED WORK', path: '/work' },
  { label: 'NARRATIVE', path: '/narrative' },
  { label: 'DOCUMENTARY', path: '/documentary' },
  { label: 'COMMERCIALS', path: '/commercials' },
  { label: 'MUSIC VIDEOS', path: '/music' },
  { label: 'SOCIAL CONTENT', path: '/social-content' },
  { label: 'ON-SET', path: '/on-set' },
  { label: 'MENTORING & SHADOWING', path: '/mentoring' },
  { label: 'ME', path: '/about' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="desktop-sidebar" aria-label="Primary Desktop Navigation">
      <div className="sidebar-brand-block">
        <Link
          to="/"
          className="sidebar-brand-link"
          aria-label="FEDWORKS — Home"
        >
          <span className="sidebar-brand-name">
            Chukwuka Edeogu (Fedworks)
          </span>
        </Link>

        <div className="sidebar-brand-sub">
          DIRECTOR OF PHOTOGRAPHY
        </div>
      </div>

      <nav className="sidebar-nav-container">
        <ul className="sidebar-nav-list">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' &&
                location.pathname.startsWith(item.path + '/'))

            return (
              <li key={item.path} className="sidebar-nav-item">
                <Link
                  to={item.path}
                  className={`sidebar-nav-link ${isActive ? 'is-active' : ''
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sidebar-nav-label">
                    {item.label}
                  </span>

                  {isActive && (
                    <span
                      className="sidebar-active-mark"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar-footer-block">
        <div className="sidebar-footer-contact">
          <a
            href="mailto:seyiayobami14@gmail.com"
            className="sidebar-footer-email"
          >
            fed@fedworks.film
          </a>
        </div>

        <div className="sidebar-footer-copy tabular-nums">
          © {new Date().getFullYear()} FEDWORKS
        </div>
      </div>
    </aside>
  )
}
