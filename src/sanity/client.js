import { createClient } from '@sanity/client'
// import imageUrlBuilder from '@sanity/image-url'
import { createImageUrlBuilder } from '@sanity/image-url'

// Environment-driven Sanity configuration (no secrets exposed)
export const sanityConfig = {
  // projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'fedworks-studio',
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '4t9t903j',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  // apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-03-01',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2026-10-03',
  useCdn: true,
}

export const client = createClient(sanityConfig)

// const builder = imageUrlBuilder(client)
const builder = createImageUrlBuilder(client)

export function urlFor(source) {
  if (!source) return ''
  if (typeof source === 'string') return source
  if (source.asset && source.asset._ref) {
    try {
      return builder.image(source).auto('format').fit('max').url()
    } catch {
      return source.asset.url || ''
    }
  }
  return source.url || ''
}

// Development placeholder projects adhering to AGENTS.md rules:
// Obvious placeholder naming; no fake clients, awards, or false professional claims.
export const placeholderProjects = [
  {
    _id: 'proj-01',
    _type: 'project',
    title: 'PLACEHOLDER PROJECT 01',
    slug: { current: 'placeholder-project-01' },
    category: 'narrative',
    categoryLabel: 'Narrative',
    year: '2025',
    poster: '/src/assets/images/project_film_cinematography_1790959704756.jpg',
    videoUrl: '',
    aspectRatio: '16/9',
    featured: true,
    synopsis: 'Placeholder narrative cinematography study focused on natural low-light interiors and optical prime spherical rendering.',
    credits: [
      { role: 'Role', name: 'Cinematographer / Director' },
      { role: 'Format', name: '35mm Spherical' },
      { role: 'Status', name: 'Placeholder Content (Pending Sanity Sync)' },
    ],
    stills: [
      '/src/assets/images/project_film_cinematography_1790959704756.jpg',
      '/src/assets/images/hero_fedworks_installation_1790959674854.jpg',
    ],
  },
  {
    _id: 'proj-02',
    _type: 'project',
    title: 'PLACEHOLDER PROJECT 02',
    slug: { current: 'placeholder-project-02' },
    category: 'commercials',
    categoryLabel: 'Commercial',
    year: '2025',
    poster: '/src/assets/images/project_industrial_object_1790959717315.jpg',
    videoUrl: '',
    aspectRatio: '16/9',
    featured: true,
    synopsis: 'Placeholder commercial cinematography work emphasizing controlled macro lighting, reflective metallic surfaces, and mechanical camera precision.',
    credits: [
      { role: 'Role', name: 'Cinematographer' },
      { role: 'Format', name: 'Digital Large Format' },
      { role: 'Status', name: 'Placeholder Content' },
    ],
    stills: [
      '/src/assets/images/project_industrial_object_1790959717315.jpg',
      '/src/assets/images/project_spatial_pavilion_1790959695432.jpg',
    ],
  },
  {
    _id: 'proj-03',
    _type: 'project',
    title: 'PLACEHOLDER PROJECT 03',
    slug: { current: 'placeholder-project-03' },
    category: 'music',
    categoryLabel: 'Music Video',
    year: '2024',
    poster: '/src/assets/images/hero_fedworks_installation_1790959674854.jpg',
    videoUrl: '',
    aspectRatio: '16/9',
    featured: true,
    synopsis: 'Placeholder music video visual project experimenting with monochrome high-contrast silhouettes and atmospheric spatial depth.',
    credits: [
      { role: 'Role', name: 'Director & Cinematographer' },
      { role: 'Format', name: '16mm & Digital' },
      { role: 'Status', name: 'Placeholder Content' },
    ],
    stills: [
      '/src/assets/images/hero_fedworks_installation_1790959674854.jpg',
    ],
  },
  {
    _id: 'proj-04',
    _type: 'project',
    title: 'PLACEHOLDER PROJECT 04',
    slug: { current: 'placeholder-project-04' },
    category: 'narrative',
    categoryLabel: 'Narrative',
    year: '2024',
    poster: '/src/assets/images/project_spatial_pavilion_1790959695432.jpg',
    videoUrl: '',
    aspectRatio: '16/9',
    featured: false,
    synopsis: 'Placeholder narrative cinema sequence examining architectural geometry, structural shadows, and character blocking.',
    credits: [
      { role: 'Role', name: 'Director of Photography' },
      { role: 'Format', name: 'Anamorphic 2.39:1' },
      { role: 'Status', name: 'Placeholder Content' },
    ],
    stills: [
      '/src/assets/images/project_spatial_pavilion_1790959695432.jpg',
    ],
  },
  {
    _id: 'proj-05',
    _type: 'project',
    title: 'PLACEHOLDER PROJECT 05',
    slug: { current: 'placeholder-project-05' },
    category: 'onset',
    categoryLabel: 'On Set / BTS',
    year: '2024',
    poster: '/src/assets/images/project_editorial_monograph_1790959685078.jpg',
    videoUrl: '',
    aspectRatio: '4/3',
    featured: false,
    synopsis: 'Placeholder documentary and behind-the-scenes archival photography chronicling technical camera rigs and lighting setups.',
    credits: [
      { role: 'Documentary', name: 'Behind The Scenes' },
      { role: 'Format', name: 'Medium Format Stills' },
      { role: 'Status', name: 'Placeholder Content' },
    ],
    stills: [
      '/src/assets/images/project_editorial_monograph_1790959685078.jpg',
    ],
  },
  {
    _id: 'proj-06',
    _type: 'project',
    title: 'PLACEHOLDER PROJECT 06',
    slug: { current: 'placeholder-project-06' },
    category: 'commercials',
    categoryLabel: 'Commercial',
    year: '2023',
    poster: '/src/assets/images/project_industrial_object_1790959717315.jpg',
    videoUrl: '',
    aspectRatio: '16/9',
    featured: false,
    synopsis: 'Placeholder high-speed cinematography test exploring fluid dynamics, tactile surfaces, and precision motion control.',
    credits: [
      { role: 'Role', name: 'Cinematographer' },
      { role: 'Format', name: 'Phantom High Speed' },
      { role: 'Status', name: 'Placeholder Content' },
    ],
    stills: [
      '/src/assets/images/project_industrial_object_1790959717315.jpg',
    ],
  },
]
