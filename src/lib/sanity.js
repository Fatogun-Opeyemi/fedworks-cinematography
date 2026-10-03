import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

/**
 * ============================================================================
 * SANITY CLIENT CONFIGURATION
 * Dedicated client for fetching published content from Sanity Content Lake.
 * Project ID: 1qg7m6y2 | Dataset: production
 * ============================================================================
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {})

const isBrowser = typeof window !== 'undefined'

export const sanityConfig = {
  projectId: env.VITE_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID || '1qg7m6y2',
  dataset: env.VITE_SANITY_DATASET || env.SANITY_DATASET || 'production',
  apiVersion: env.VITE_SANITY_API_VERSION || '2024-03-01',
  useCdn: false, // Ensure fresh published data
  // In the browser, proxy via Vite dev server to bypass Sanity CORS 403
  ...(isBrowser ? { apiHost: `${window.location.origin}/api/sanity`, useProjectHostname: false } : {}),
}

export const client = createClient(sanityConfig)

/**
 * ============================================================================
 * SANITY IMAGE HELPER
 * Resolves image asset references into optimized, responsive CDN URLs.
 * Always targets the official Sanity Image CDN directly.
 * ============================================================================
 */
const builder = createImageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
})

/**
 * Generates an image URL builder instance for any Sanity image reference or object.
 * @param {any} source - Sanity image source
 * @returns {any} ImageUrlBuilder
 */
export function urlFor(source) {
  if (!source) return null
  try {
    return builder.image(source)
  } catch {
    return null
  }
}

/**
 * Resolves a direct image URL string safely.
 * @param {any} source - Sanity image source or asset
 * @param {number} [width] - Optional width
 * @param {number} [height] - Optional height
 * @returns {string} URL string or empty string
 */
export function urlForImage(source, width, height) {
  if (!source) return ''
  try {
    // If it is already a direct string URL
    if (typeof source === 'string' && source.startsWith('http')) {
      return source
    }
    // If it's an object with asset.url
    if (source?.asset?.url) {
      return source.asset.url
    }
    let img = builder.image(source).auto('format').fit('max')
    if (width) img = img.width(width)
    if (height) img = img.height(height)
    return img.url()
  } catch {
    return source?.asset?.url || source?.url || ''
  }
}

/**
 * Helper to safely extract plain text from strings or Sanity portable text blocks.
 * @param {any} val
 * @returns {string}
 */
export function extractText(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (Array.isArray(val)) {
    return val
      .map(block => {
        if (block?.children && Array.isArray(block.children)) {
          return block.children.map(c => c.text || '').join('')
        }
        return typeof block === 'string' ? block : ''
      })
      .filter(Boolean)
      .join('\n\n')
  }
  return String(val)
}

/**
 * Safe fetch wrapper that handles dev server proxy and falls back to direct fetch.
 */
async function safeFetch(query, params = {}) {
  try {
    return await client.fetch(query, params)
  } catch (err) {
    // Secondary fallback: Direct fetch to apicdn.sanity.io
    try {
      let finalQuery = query
      if (params && Object.keys(params).length > 0) {
        for (const [k, v] of Object.entries(params)) {
          finalQuery = finalQuery.replace(new RegExp(`\\$${k}`, 'g'), JSON.stringify(v))
        }
      }
      const directUrl = `https://${sanityConfig.projectId}.apicdn.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}?query=${encodeURIComponent(finalQuery)}`
      const res = await fetch(directUrl)
      if (res.ok) {
        const json = await res.json()
        return json.result
      }
    } catch {}
    console.warn('[Sanity API] Query warning:', err.message)
    return null
  }
}

/**
 * Centralized GROQ projections matching the live Sanity schema (coverMedia, media, etc.)
 */
const mediaItemProjection = `
  _key,
  _type,
  type,
  order,
  caption,
  alt,
  image {
    ...,
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    }
  },
  video {
    asset-> {
      _id,
      url,
      originalFilename,
      mimeType,
      size
    }
  },
  poster {
    ...,
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    }
  }
`

const projectProjection = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  category,
  client,
  artist,
  clientOrArtist,
  location,
  date,
  monthYear,
  year,
  description,
  featured,
  coverMedia {
    ${mediaItemProjection}
  },
  media[] {
    ${mediaItemProjection}
  },
  thumbnail {
    ...,
    asset-> {
      _id,
      url
    }
  },
  poster {
    ...,
    asset-> {
      _id,
      url
    }
  },
  video {
    asset-> {
      _id,
      url,
      originalFilename,
      mimeType,
      size
    }
  },
  gallery[] {
    ...,
    asset-> {
      _id,
      url
    }
  },
  credits[] {
    role,
    name
  }
`

const siteSettingsProjection = `
  _id,
  _type,
  siteName,
  professionalTitle,
  contactEmail,
  phone,
  instagramUrl,
  copyrightYear,
  aboutHeading,
  aboutBody,
  mentoringHeading,
  mentoringBody,
  heroPoster {
    ...,
    asset-> {
      _id,
      url
    }
  },
  heroReel {
    asset-> {
      _id,
      url,
      originalFilename,
      mimeType,
      size
    }
  },
  heroVideo {
    asset-> {
      _id,
      url,
      originalFilename,
      mimeType,
      size
    }
  }
`

// Centralized GROQ Queries
export const siteSettingsQuery = `*[_type == "siteSettings"][0] { ${siteSettingsProjection} }`

// Note: projects do NOT have sortOrder; order by date or _createdAt
export const allProjectsQuery = `*[_type == "project"] | order(date desc, _createdAt desc) { ${projectProjection} }`

export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(date desc, _createdAt desc) { ${projectProjection} }`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] { ${projectProjection} }`

export const aboutQuery = `*[_type in ["about", "siteSettings"]][0] {
  aboutHeading,
  aboutBody,
  storytellingEthos,
  portraitImage {
    asset-> {
      _id,
      url
    }
  }
}`

export const mentoringQuery = `*[_type in ["mentoring", "siteSettings"]][0] {
  mentoringHeading,
  mentoringBody,
  programs[] {
    title,
    lead,
    description
  }
}`

export const CANONICAL_CATEGORIES = [
  'Music Video',
  'Documentary',
  'Commercial',
  'Film',
  'Social Content',
]

/**
 * Normalizes any category string or array into one of the 5 canonical categories:
 * - Music Video
 * - Documentary
 * - Commercial
 * - Film
 * - Social Content
 */
export function getCanonicalCategory(rawCategory) {
  let raw = Array.isArray(rawCategory) ? rawCategory : [rawCategory]
  const str = raw.filter(Boolean).map(c => String(c).toLowerCase()).join(' ')

  if (str.includes('music')) return 'Music Video'
  if (str.includes('doc')) return 'Documentary'
  if (str.includes('commercial')) return 'Commercial'
  if (str.includes('social')) return 'Social Content'
  if (str.includes('film') || str.includes('narrative')) return 'Film'

  return 'Film'
}

/**
 * ============================================================================
 * NORMALIZATION LAYER
 * Normalizes raw GROQ records into consistent shapes for React components.
 * Correctly reads coverMedia, mediaItem[], client, artist, date, and category[].
 * ============================================================================
 */
export function normalizeProject(raw) {
  if (!raw) return null

  // Canonical Category resolution
  const canonicalCategory = getCanonicalCategory(raw.category)
  const categoryLabel = canonicalCategory
  const category = canonicalCategory.toLowerCase().replace(/\s+/g, '-')

  // Cover image / poster URL resolution
  let posterUrl = ''
  let videoUrl = ''

  // 1. Check coverMedia (the primary media structure in the project schema)
  if (raw.coverMedia) {
    if (raw.coverMedia.image) {
      posterUrl = urlForImage(raw.coverMedia.image, 1600) || raw.coverMedia.image?.asset?.url || ''
    }
    if (!posterUrl && raw.coverMedia.poster) {
      posterUrl = urlForImage(raw.coverMedia.poster, 1600) || raw.coverMedia.poster?.asset?.url || ''
    }
    if (raw.coverMedia.video?.asset?.url) {
      videoUrl = raw.coverMedia.video.asset.url
    }
  }

  // 2. Check legacy top-level poster/thumbnail/video
  if (!posterUrl && raw.poster) {
    posterUrl = urlForImage(raw.poster, 1600) || raw.poster?.asset?.url || ''
  }
  if (!posterUrl && raw.thumbnail) {
    posterUrl = urlForImage(raw.thumbnail, 800) || raw.thumbnail?.asset?.url || ''
  }
  if (!videoUrl && raw.video?.asset?.url) {
    videoUrl = raw.video.asset.url
  }

  // 3. Check media items array for video/poster if still needed
  if (Array.isArray(raw.media)) {
    if (!videoUrl) {
      const videoItem = raw.media.find(m => m.type === 'video' && m.video?.asset?.url)
      if (videoItem) {
        videoUrl = videoItem.video.asset.url
        if (!posterUrl && videoItem.poster) {
          posterUrl = urlForImage(videoItem.poster, 1600) || videoItem.poster?.asset?.url || ''
        }
      }
    }
    if (!posterUrl) {
      const imgItem = raw.media.find(m => m.image)
      if (imgItem) {
        posterUrl = urlForImage(imgItem.image, 1600) || imgItem.image?.asset?.url || ''
      }
    }
  }

  // 4. Stills gallery: gather all high-res frames from coverMedia, media[], and legacy gallery
  const stills = []
  if (posterUrl) stills.push(posterUrl)

  if (Array.isArray(raw.media)) {
    for (const item of raw.media) {
      const img = item.image ? (urlForImage(item.image, 1800) || item.image?.asset?.url) : null
      const post = item.poster ? (urlForImage(item.poster, 1800) || item.poster?.asset?.url) : null
      if (img && !stills.includes(img)) stills.push(img)
      if (post && !stills.includes(post)) stills.push(post)
    }
  }

  if (Array.isArray(raw.gallery)) {
    for (const item of raw.gallery) {
      const url = urlForImage(item, 1800) || item?.asset?.url
      if (url && !stills.includes(url)) stills.push(url)
    }
  }

  // Client or Artist
  const clientOrArtist = raw.artist || raw.client || raw.clientOrArtist || ''

  // Location
  const location = raw.location || ''

  // Date / Year
  let dateFormatted = ''
  let year = ''
  if (raw.date) {
    const parts = String(raw.date).split('-')
    if (parts.length >= 2) {
      dateFormatted = `${parts[1]}.${parts[0]}`
      year = parts[0]
    } else {
      dateFormatted = String(raw.date)
      year = String(raw.date)
    }
  } else if (raw.monthYear) {
    dateFormatted = raw.monthYear
    year = raw.year ? String(raw.year) : ''
  } else if (raw.year) {
    dateFormatted = String(raw.year)
    year = String(raw.year)
  }

  const descText = extractText(raw.description)

  return {
    _id: raw._id,
    title: raw.title || 'Untitled Project',
    slug: raw.slug?.current ? raw.slug : { current: String(raw.slug || '') },
    category,
    categoryLabel,
    canonicalCategory,
    categoryCanonical: canonicalCategory,
    clientOrArtist,
    location,
    dateFormatted,
    year,
    description: descText,
    synopsis: descText,
    featured: Boolean(raw.featured),
    coverMedia: raw.coverMedia || null,
    poster: posterUrl,
    posterUrl,
    thumbnail: posterUrl,
    thumbnailUrl: posterUrl,
    videoUrl,
    aspectRatio: '1/1',
    credits: Array.isArray(raw.credits) ? raw.credits : [],
    gallery: stills,
    stills,
  }
}

export function normalizeSiteSettings(raw) {
  if (!raw) return null

  // Safely resolve hero video URL from dereferenced heroReel or heroVideo
  const heroVideoUrl =
    raw.heroReel?.asset?.url ||
    raw.heroVideo?.asset?.url ||
    (typeof raw.heroReel === 'string' ? raw.heroReel : '') ||
    ''

  // Safely resolve hero poster URL
  const heroPosterUrl = raw.heroPoster
    ? urlForImage(raw.heroPoster, 2400) || raw.heroPoster?.asset?.url || ''
    : ''

  return {
    _id: raw._id,
    siteName: raw.siteName || 'FEDWORKS',
    professionalTitle: raw.professionalTitle || 'DIRECTOR OF PHOTOGRAPHY',
    contactEmail: raw.contactEmail || 'studio@fedworks.com',
    phone: raw.phone || '',
    instagramUrl: raw.instagramUrl || '',
    copyrightYear: raw.copyrightYear || new Date().getFullYear(),
    aboutHeading: raw.aboutHeading || 'Cinematographer. Director. Storyteller.',
    aboutBody:
      raw.aboutBody ||
      'Working at the intersection of natural light, cultural texture, and physical movement. Every project is approached as an architectural study in light and duration, serving the core emotional rhythm of the narrative.',
    mentoringHeading: raw.mentoringHeading || 'Shadow a shoot. Practical set craft.',
    mentoringBody:
      raw.mentoringBody ||
      'Dedicated shadowing program offering emerging camera assistants and cinematographers direct access to active working sets, lighting setups, and optical camera tests.',
    heroPosterUrl,
    heroVideoUrl,
  }
}

/**
 * ============================================================================
 * EXPORTED DATA FETCHING API
 * Gracefully handles loading, empty dataset, and request errors without throwing.
 * ============================================================================
 */

/**
 * Retrieves the global Site Settings singleton document.
 */
export async function getSiteSettings() {
  const raw = await safeFetch(siteSettingsQuery)
  if (raw) return normalizeSiteSettings(raw)
  return normalizeSiteSettings(null)
}

/**
 * Retrieves all published projects.
 */
export async function getAllProjects() {
  const data = await safeFetch(allProjectsQuery)
  if (Array.isArray(data)) {
    return data.map(normalizeProject).filter(Boolean)
  }
  return []
}

export const getPublishedProjects = getAllProjects

/**
 * Retrieves featured projects for the homepage.
 * Featured Works is a curated selection: it never falls back to the full archive.
 */
export async function getFeaturedProjects() {
  const data = await safeFetch(featuredProjectsQuery)
  if (Array.isArray(data) && data.length > 0) {
    return data.map(normalizeProject).filter(Boolean)
  }
  return []
}

/**
 * Retrieves a single project by its slug string.
 * @param {string} slug
 */
export async function getProjectBySlug(slug) {
  if (!slug) return null
  const data = await safeFetch(projectBySlugQuery, { slug })
  if (data) return normalizeProject(data)
  return null
}

/**
 * Retrieves projects filtered by category.
 * @param {string} category
 */
export async function getProjectsByCategory(category) {
  const all = await getAllProjects()
  if (!category || category === 'all' || category === 'ALL') {
    return all
  }
  const cleanCat = String(category).toLowerCase()
  return all.filter(p => {
    const pCat = String(p.category || '').toLowerCase()
    const pCanonical = String(p.canonicalCategory || p.categoryLabel || '').toLowerCase()
    if (pCat === cleanCat || pCanonical === cleanCat) return true
    if (cleanCat.includes('music') && pCanonical.includes('music')) return true
    if (cleanCat.includes('narrative') && (pCanonical.includes('film') || pCat.includes('narrative'))) return true
    if (cleanCat.includes('film') && (pCanonical.includes('film') || pCat.includes('narrative'))) return true
    if (cleanCat.includes('commercial') && pCanonical.includes('commercial')) return true
    if (cleanCat.includes('doc') && pCanonical.includes('doc')) return true
    if (cleanCat.includes('social') && pCanonical.includes('social')) return true
    return false
  })
}

/**
 * Retrieves About content from Sanity.
 */
export async function getAboutContent() {
  const data = await safeFetch(aboutQuery)
  if (data && (data.aboutHeading || data.aboutBody)) {
    return {
      aboutHeading: data.aboutHeading || 'Cinematographer. Director. Storyteller.',
      aboutBody: extractText(data.aboutBody) || '',
      portraitImageUrl: data.portraitImage ? urlForImage(data.portraitImage, 1600) : '',
    }
  }
  const settings = await getSiteSettings()
  return {
    aboutHeading: settings.aboutHeading,
    aboutBody: settings.aboutBody,
    portraitImageUrl: '',
  }
}

/**
 * Retrieves Mentoring content from Sanity.
 */
export async function getMentoringContent() {
  const data = await safeFetch(mentoringQuery)
  if (data && (data.mentoringHeading || data.mentoringBody)) {
    return {
      mentoringHeading: data.mentoringHeading || 'Shadow a shoot. Practical set craft.',
      mentoringBody: extractText(data.mentoringBody) || '',
      programs: Array.isArray(data.programs) ? data.programs : [],
    }
  }
  const settings = await getSiteSettings()
  return {
    mentoringHeading: settings.mentoringHeading,
    mentoringBody: settings.mentoringBody,
    programs: [],
  }
}

/**
 * Retrieves BTS / On-Set items from Sanity (or derived from project media).
 */
export async function getBtsItems() {
  // 1. Try dedicated btsItem documents
  try {
    const query = `*[_type == "btsItem" && published != false] | order(_createdAt desc)`
    const data = await safeFetch(query)
    if (Array.isArray(data) && data.length > 0) return data
  } catch {}

  // 2. Derive BTS items from project media
  try {
    const projects = await getAllProjects()
    const btsList = []
    for (const proj of projects) {
      if (Array.isArray(proj.gallery) && proj.gallery.length > 0) {
        proj.gallery.forEach((stillUrl, idx) => {
          btsList.push({
            _id: `${proj._id}-bts-${idx}`,
            caption: `${proj.title} · On-Set Still ${idx + 1}`,
            location: proj.location,
            dateFormatted: proj.dateFormatted,
            image: { asset: { url: stillUrl } },
            video: proj.videoUrl ? { asset: { url: proj.videoUrl } } : null,
            project: { title: proj.title, slug: proj.slug },
          })
        })
      }
    }
    return btsList
  } catch {}

  return []
}
