import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { NAV_ITEMS } from './navigation/Sidebar.jsx'

export default function MenuOverlay({ isOpen, onClose }) {
  const location = useLocation()
  const firstLinkRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.classList.add('menu-open')
      const timer = setTimeout(() => {
        firstLinkRef.current?.focus()
      }, 60)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('keydown', handleKeyDown)
        document.body.classList.remove('menu-open')
      }
    } else {
      document.body.classList.remove('menu-open')
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="menu-overlay-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          <div className="menu-header-bar">
            <Link
              to="/"
              onClick={onClose}
              className="nav-brand"
              style={{ color: 'var(--color-off-white)' }}
            >
              FEDWORKS
            </Link>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="menu-close-action"
              aria-label="Close navigation overlay"
            >
              CLOSE [ESC]
            </button>
          </div>

          <div className="menu-items-container">
            <nav className="menu-items-stack" aria-label="Mobile navigation directory">
              {NAV_ITEMS.map((item, idx) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path + '/'))
                const num = String(idx + 1).padStart(2, '0')

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    ref={idx === 0 ? firstLinkRef : null}
                    onClick={onClose}
                    className={`menu-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="menu-index-num tabular-nums">{num}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="menu-footer-bar">
            <div>DIRECTOR OF PHOTOGRAPHY</div>
            <div>Inquiries: studio@fedworks.com</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
