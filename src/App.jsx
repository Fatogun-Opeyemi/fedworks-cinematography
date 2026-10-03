import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/navigation/Sidebar.jsx'
import MobileHeader from './components/navigation/MobileHeader.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import Narrative from './pages/Narrative.jsx'
import Commercials from './pages/Commercials.jsx'
import Music from './pages/Music.jsx'
import OnSet from './pages/OnSet.jsx'
import Mentoring from './pages/Mentoring.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import NotFound from './pages/NotFound.jsx'

function RouteTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)

    // Dynamic Route SEO titles
    const titles = {
      '/': 'FEDWORKS — Director of Photography',
      '/work': 'Work Archive — FEDWORKS',
      '/narrative': 'Narrative Work — FEDWORKS',
      '/commercials': 'Commercials — FEDWORKS',
      '/music': 'Music Videos — FEDWORKS',
      '/on-set': 'On Set & Behind The Scenes — FEDWORKS',
      '/mentoring': 'Mentoring & Shadowing — FEDWORKS',
      '/about': 'About Practice — FEDWORKS',
      '/contact': 'Contact Studio — FEDWORKS',
    }

    if (titles[pathname]) {
      document.title = titles[pathname]
    } else if (pathname.startsWith('/work/')) {
      document.title = 'Project Detail — FEDWORKS'
    } else {
      document.title = '404 Frame Not Found — FEDWORKS'
    }
  }, [pathname])

  return null
}

export default function App() {
  return (
    <div className="site-layout-wrapper">
      <RouteTracker />

      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <div className="site-main-area">
        <main className="site-content-flow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/narrative" element={<Narrative />} />
            <Route path="/commercials" element={<Commercials />} />
            <Route path="/music" element={<Music />} />
            <Route path="/on-set" element={<OnSet />} />
            <Route path="/mentoring" element={<Mentoring />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  )
}
