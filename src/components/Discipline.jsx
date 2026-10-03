import React from 'react'

export default function Discipline() {
  const principles = [
    {
      index: '01 / STRUCTURE',
      title: 'Gravitational Weight',
      text: 'We reject ephemeral facade dressing. Architecture begins with mass, load transfers, and geological resistance. Our structures age with dignity under sunlight and rain.',
    },
    {
      index: '02 / ARCHIVE',
      title: 'The Tactile Monograph',
      text: 'Every commission is chronicled in physical print. We curate paper stocks, cold stampings, and typographic hierarchies that outlive digital obsolescence.',
    },
    {
      index: '03 / CINEMA',
      title: 'Silence & Duration',
      text: 'Our cinema documents eschew rapid montage. We capture spaces through enduring takes, optical prime glass, and natural light migrations across raw plaster.',
    },
    {
      index: '04 / PURITY',
      title: 'Material Honesty',
      text: 'Stone remains unpolished basalt. Timber is charred cypress. Steel is untreated hot-rolled billet. No artificial simulacra or superficial surface coatings.',
    },
  ]

  return (
    <section id="discipline" className="discipline-section">
      <div className="site-container">
        <div className="section-title-wrap">
          <span className="section-label">Studio Creed</span>
          <h2 className="section-heading">Four Immutable Principles</h2>
        </div>

        <div className="philosophy-grid">
          {principles.map((p, idx) => (
            <div key={idx} className="philosophy-card">
              <span className="philosophy-index tabular-nums">{p.index}</span>
              <h3 className="philosophy-title">{p.title}</h3>
              <p className="philosophy-text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
