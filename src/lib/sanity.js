import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

/**
 * ============================================================================
 * SANITY CLIENT CONFIGURATION
 * ============================================================================
 */

const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
      ? process.env
      : {}

export const sanityConfig = {
  projectId:
    env.VITE_SANITY_PROJECT_ID ||
    env.SANITY_PROJECT_ID ||
    '4t9t903j',

  dataset:
    env.VITE_SANITY_DATASET ||
    env.SANITY_DATASET ||
    'production',

  apiVersion:
    env.VITE_SANITY_API_VERSION ||
    '2024-03-01',

  useCdn: false,
}

export const client = createClient(sanityConfig)

/**
 * ============================================================================
 * SANITY IMAGE HELPERS
 * ============================================================================
 */

const builder = createImageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
})

export function urlFor(source) {
  if (!source) return null

  try {
    return builder.image(source)
  } catch {
    return null
  }
}

export function urlForImage(
  source,
  width,
  height,
) {
  if (!source) return ''

  try {
    if (
      typeof source === 'string' &&
      source.startsWith('http')
    ) {
      return source
    }

    if (source?.asset?.url) {
      return source.asset.url
    }

    let img = builder
      .image(source)
      .auto('format')
      .fit('max')

    if (width) {
      img = img.width(width)
    }

    if (height) {
      img = img.height(height)
    }

    return img.url()
  } catch {
    return (
      source?.asset?.url ||
      source?.url ||
      ''
    )
  }
}

/**
 * ============================================================================
 * PORTABLE TEXT
 * ============================================================================
 */

export function extractText(val) {
  if (!val) return ''

  if (typeof val === 'string') {
    return val
  }

  if (Array.isArray(val)) {
    return val
      .map((block) => {
        if (
          block?.children &&
          Array.isArray(block.children)
        ) {
          return block.children
            .map((child) => child.text || '')
            .join('')
        }

        return typeof block === 'string'
          ? block
          : ''
      })
      .filter(Boolean)
      .join('\n\n')
  }

  return String(val)
}

/**
 * ============================================================================
 * SAFE SANITY FETCH
 * ============================================================================
 */

async function safeFetch(
  query,
  params = {},
) {
  try {
    return await client.fetch(
      query,
      params,
    )
  } catch (err) {
    try {
      let finalQuery = query

      if (
        params &&
        Object.keys(params).length > 0
      ) {
        for (const [key, value] of Object.entries(
          params,
        )) {
          finalQuery = finalQuery.replace(
            new RegExp(`\\$${key}`, 'g'),
            JSON.stringify(value),
          )
        }
      }

      const directUrl =
        `https://${sanityConfig.projectId}.apicdn.sanity.io` +
        `/v${sanityConfig.apiVersion}` +
        `/data/query/${sanityConfig.dataset}` +
        `?query=${encodeURIComponent(finalQuery)}`

      const res = await fetch(directUrl)

      if (res.ok) {
        const json = await res.json()
        return json.result
      }
    } catch {
      // Ignore fallback errors.
    }

    console.warn(
      '[Sanity API] Query warning:',
      err?.message || err,
    )

    return null
  }
}

/**
 * ============================================================================
 * MEDIA PROJECTION
 * ============================================================================
 */

const mediaItemProjection = `
  _key,
  _type,
  type,
  role,
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

/**
 * ============================================================================
 * PROJECT PROJECTION
 * ============================================================================
 */

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
  location,
  date,

  description,
  featured,

  coverMedia {
    ${mediaItemProjection}
  },

  media[] {
    ${mediaItemProjection}
  },

  credits[] {
    role,
    name
  }
`

/**
 * ============================================================================
 * SITE SETTINGS
 * ============================================================================
 */

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

/**
 * ============================================================================
 * GROQ QUERIES
 * ============================================================================
 */

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    ${siteSettingsProjection}
  }
`

export const allProjectsQuery = `
  *[_type == "project"]
  | order(date desc, _createdAt desc) {
    ${projectProjection}
  }
`

export const featuredProjectsQuery = `
  *[_type == "project" && featured == true]
  | order(date desc, _createdAt desc) {
    ${projectProjection}
  }
`

export const projectBySlugQuery = `
  *[
    _type == "project" &&
    slug.current == $slug
  ][0] {
    ${projectProjection}
  }
`
export const aboutQuery = `
  *[_type == "about"][0] {
    portrait {
      asset-> {
        _id,
        url
      }
    },

    biography,

    supportingImages[] {
      asset-> {
        _id,
        url
      }
    },

    highlights
  }
`

export const mentoringQuery = `
  *[_type == "mentoring"][0] {
    title,
    introduction,
    description,

    programs[] {
      _key,
      type,
      title,
      description
    },

    supportingMedia,

    ctaText,

    ctaDestination {
      type,
      email,
      phone,
      externalUrl,
      formId
    }
  }
`

/**
 * ============================================================================
 * CANONICAL CATEGORIES
 * ============================================================================
 */

export const CANONICAL_CATEGORIES = [
  'Narrative',
  'Film',
  'Documentary',
  'Commercial',
  'Music Video',
  'Social Content',
  'BTS',
]

/**
 * ============================================================================
 * CATEGORY HELPERS
 * ============================================================================
 */

function normalizeCategoryValue(value) {
  if (!value) return ''

  const normalized = String(value)
    .trim()
    .toLowerCase()

  if (
    normalized === 'music video' ||
    normalized === 'music-video' ||
    normalized === 'music'
  ) {
    return 'Music Video'
  }

  if (
    normalized === 'documentary' ||
    normalized === 'doc'
  ) {
    return 'Documentary'
  }

  if (
    normalized === 'commercial' ||
    normalized === 'commercials'
  ) {
    return 'Commercial'
  }

  if (
    normalized === 'social content' ||
    normalized === 'social-content' ||
    normalized === 'social'
  ) {
    return 'Social Content'
  }

  if (
    normalized === 'bts' ||
    normalized === 'onset' ||
    normalized === 'on-set' ||
    normalized === 'behind the scenes'
  ) {
    return 'BTS'
  }

  if (
    normalized === 'narrative' ||
    normalized === 'film'
  ) {
    return normalized === 'film'
      ? 'Film'
      : 'Narrative'
  }

  return String(value).trim()
}

export function getCanonicalCategories(
  rawCategory,
) {
  const raw = Array.isArray(rawCategory)
    ? rawCategory
    : [rawCategory]

  return [
    ...new Set(
      raw
        .filter(Boolean)
        .map(normalizeCategoryValue)
        .filter(Boolean),
    ),
  ]
}

export function getCanonicalCategory(
  rawCategory,
) {
  const categories =
    getCanonicalCategories(rawCategory)

  return categories[0] || 'Film'
}

function categoryToSlug(category) {
  return String(category || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
}

/**
 * ============================================================================
 * PROJECT NORMALIZATION
 * ============================================================================
 */

export function normalizeProject(raw) {
  if (!raw) return null

  const categories =
    getCanonicalCategories(raw.category)

  const primaryCategory =
    categories[0] || 'Film'

  const category =
    categoryToSlug(primaryCategory)

  const categorySlugs =
    categories.map(categoryToSlug)

  const categoryLabel =
    primaryCategory

  let posterUrl = ''
  let videoUrl = ''

  /**
   * Cover media
   */

  if (raw.coverMedia) {
    if (raw.coverMedia.image) {
      posterUrl =
        urlForImage(
          raw.coverMedia.image,
          1600,
        ) ||
        raw.coverMedia.image?.asset?.url ||
        ''
    }

    if (
      !posterUrl &&
      raw.coverMedia.poster
    ) {
      posterUrl =
        urlForImage(
          raw.coverMedia.poster,
          1600,
        ) ||
        raw.coverMedia.poster?.asset?.url ||
        ''
    }

    if (
      raw.coverMedia.video?.asset?.url
    ) {
      videoUrl =
        raw.coverMedia.video.asset.url
    }
  }

  /**
   * Main project media.
   *
   * IMPORTANT:
   * We do not treat BTS media as the project's
   * primary work media.
   */

  if (Array.isArray(raw.media)) {
    const mainMedia = raw.media.filter(
      (item) =>
        !item.role ||
        item.role === 'main',
    )

    if (!videoUrl) {
      const videoItem =
        mainMedia.find(
          (mediaItem) =>
            mediaItem.type === 'video' &&
            mediaItem.video?.asset?.url,
        )

      if (videoItem) {
        videoUrl =
          videoItem.video.asset.url

        if (
          !posterUrl &&
          videoItem.poster
        ) {
          posterUrl =
            urlForImage(
              videoItem.poster,
              1600,
            ) ||
            videoItem.poster?.asset?.url ||
            ''
        }
      }
    }

    if (!posterUrl) {
      const imageItem =
        mainMedia.find(
          (mediaItem) =>
            mediaItem.image,
        )

      if (imageItem) {
        posterUrl =
          urlForImage(
            imageItem.image,
            1600,
          ) ||
          imageItem.image?.asset?.url ||
          ''
      }
    }
  }

  /**
   * Stills for the project's own detail page.
   *
   * BTS media is deliberately excluded.
   */

  const stills = []

  if (posterUrl) {
    stills.push(posterUrl)
  }

  if (Array.isArray(raw.media)) {
    for (const item of raw.media) {
      if (
        item.role &&
        item.role !== 'main'
      ) {
        continue
      }

      const imageUrl = item.image
        ? urlForImage(
          item.image,
          1800,
        ) ||
        item.image?.asset?.url
        : null

      const posterImageUrl = item.poster
        ? urlForImage(
          item.poster,
          1800,
        ) ||
        item.poster?.asset?.url
        : null

      if (
        imageUrl &&
        !stills.includes(imageUrl)
      ) {
        stills.push(imageUrl)
      }

      if (
        posterImageUrl &&
        !stills.includes(
          posterImageUrl,
        )
      ) {
        stills.push(posterImageUrl)
      }
    }
  }

  /**
   * Client / Artist
   */

  const clientOrArtist =
    raw.artist ||
    raw.client ||
    ''

  /**
   * Location
   */

  const location =
    raw.location || ''

  /**
   * Date
   */

  let dateFormatted = ''
  let year = ''

  if (raw.date) {
    const parts =
      String(raw.date).split('-')

    if (parts.length >= 2) {
      const monthIndex =
        parseInt(parts[1], 10) - 1

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      dateFormatted =
        `${monthNames[monthIndex]} ${parts[0]}`

      year = parts[0]
    } else {
      dateFormatted =
        String(raw.date)

      year =
        String(raw.date)
    }
  }

  const descText =
    extractText(raw.description)

  /**
   * Return normalized project.
   */

  return {
    _id: raw._id,

    title:
      raw.title ||
      'Untitled Project',

    slug:
      raw.slug?.current
        ? raw.slug
        : {
          current:
            String(raw.slug || ''),
        },

    categories,

    categorySlugs,

    category,

    categoryLabel,

    canonicalCategory:
      primaryCategory,

    categoryCanonical:
      primaryCategory,

    clientOrArtist,

    client:
      raw.client || '',

    artist:
      raw.artist || '',

    location,

    date:
      raw.date || '',

    dateFormatted,

    year,

    description:
      descText,

    synopsis:
      descText,

    featured:
      Boolean(raw.featured),

    coverMedia:
      raw.coverMedia || null,

    poster:
      posterUrl,

    posterUrl,

    thumbnail:
      posterUrl,

    thumbnailUrl:
      posterUrl,

    videoUrl,

    aspectRatio:
      '1/1',

    credits:
      Array.isArray(raw.credits)
        ? raw.credits
        : [],

    media:
      Array.isArray(raw.media)
        ? raw.media
        : [],

    gallery:
      stills,

    stills,
  }
}

/**
 * ============================================================================
 * SITE SETTINGS
 * ============================================================================
 */

export function normalizeSiteSettings(
  raw,
) {
  if (!raw) return null

  const heroVideoUrl =
    raw.heroReel?.asset?.url ||
    raw.heroVideo?.asset?.url ||
    (
      typeof raw.heroReel === 'string'
        ? raw.heroReel
        : ''
    ) ||
    ''

  const heroPosterUrl =
    raw.heroPoster
      ? urlForImage(
        raw.heroPoster,
        2400,
      ) ||
      raw.heroPoster?.asset?.url ||
      ''
      : ''

  return {
    _id: raw._id,

    siteName:
      raw.siteName ||
      'FEDWORKS',

    professionalTitle:
      raw.professionalTitle ||
      'DIRECTOR OF PHOTOGRAPHY',

    contactEmail:
      raw.contactEmail ||
      'studio@fedworks.com',

    phone:
      raw.phone || '',

    instagramUrl:
      raw.instagramUrl || '',

    copyrightYear:
      raw.copyrightYear ||
      new Date().getFullYear(),

    aboutHeading:
      raw.aboutHeading ||
      'Cinematographer. Director. Storyteller.',

    aboutBody:
      raw.aboutBody ||
      'Working at the intersection of natural light, cultural texture, and physical movement. Every project is approached as an architectural study in light and duration, serving the core emotional rhythm of the narrative.',

    mentoringHeading:
      raw.mentoringHeading ||
      'Shadow a shoot. Practical set craft.',

    mentoringBody:
      raw.mentoringBody ||
      'Dedicated shadowing program offering emerging camera assistants and cinematographers direct access to active working sets, lighting setups, and optical camera tests.',

    heroPosterUrl,

    heroVideoUrl,
  }
}

/**
 * ============================================================================
 * DATA FETCHING
 * ============================================================================
 */

export async function getSiteSettings() {
  const raw =
    await safeFetch(
      siteSettingsQuery,
    )

  return raw
    ? normalizeSiteSettings(raw)
    : normalizeSiteSettings(null)
}

export async function getAllProjects() {
  const data =
    await safeFetch(
      allProjectsQuery,
    )

  if (Array.isArray(data)) {
    return data
      .map(normalizeProject)
      .filter(Boolean)
  }

  return []
}

export const getPublishedProjects =
  getAllProjects

export async function getFeaturedProjects() {
  console.log('[DEBUG] getFeaturedProjects() called')

  const data = await safeFetch(featuredProjectsQuery)

  console.log('[DEBUG] RAW FEATURED DATA:', data)

  if (Array.isArray(data)) {
    const normalized = data
      .map(normalizeProject)
      .filter(Boolean)

    console.log('[DEBUG] NORMALIZED FEATURED DATA:', normalized)

    return normalized
  }

  console.log('[DEBUG] FEATURED DATA IS NOT AN ARRAY:', data)

  return []
}

export async function getProjectBySlug(
  slug,
) {
  if (!slug) return null

  const data =
    await safeFetch(
      projectBySlugQuery,
      { slug },
    )

  return data
    ? normalizeProject(data)
    : null
}

/**
 * ============================================================================
 * PROJECT CATEGORY FILTERING
 * ============================================================================
 */

export async function getProjectsByCategory(
  category,
) {
  const all =
    await getAllProjects()

  if (
    !category ||
    category === 'all' ||
    category === 'ALL'
  ) {
    return all
  }

  const requested =
    normalizeCategoryValue(category)

  return all.filter((project) => {
    const categories =
      Array.isArray(project.categories)
        ? project.categories
        : []

    if (
      categories.includes(requested)
    ) {
      return true
    }

    /**
     * Narrative / Film compatibility.
     *
     * Older projects may have been saved
     * as Film while the page calls itself
     * Narrative.
     */

    if (
      requested === 'Narrative' &&
      categories.includes('Film')
    ) {
      return true
    }

    if (
      requested === 'Film' &&
      categories.includes('Narrative')
    ) {
      return true
    }

    return false
  })
}

/**
 * ============================================================================
 * ABOUT
 * ============================================================================
 */

export async function getAboutContent() {
  const data =
    await safeFetch(
      aboutQuery,
    )

  if (!data) {
    return {
      portraitImageUrl: '',
      biography: '',
      supportingImages: [],
      credits: [],
    }
  }

  return {
    portraitImageUrl:
      data.portrait
        ? urlForImage(
          data.portrait,
          1600,
        )
        : '',

    biography:
      extractText(
        data.biography,
      ) || '',

    supportingImages:
      Array.isArray(
        data.supportingImages,
      )
        ? data.supportingImages
        : [],

    credits:
      Array.isArray(
        data.highlights,
      )
        ? data.highlights
        : [],
  }
}

/**
 * ============================================================================
 * MENTORING
 * ============================================================================
 */

export async function getMentoringContent() {
  const data =
    await safeFetch(
      mentoringQuery,
    )

  if (!data) {
    return null
  }

  const programLabels = {
    'shadow-a-shoot':
      'SHADOW A SHOOT',

    mentorship:
      'MENTORSHIP',

    'production-guidance':
      'PRODUCTION GUIDANCE',
  }

  return {
    title:
      data.title || '',

    introduction:
      extractText(
        data.introduction,
      ) || '',

    description:
      extractText(
        data.description,
      ) || '',

    supportingMedia:
      Array.isArray(
        data.supportingMedia,
      )
        ? data.supportingMedia
        : [],

    ctaText:
      data.ctaText || '',

    ctaDestination:
      data.ctaDestination || null,

    programs:
      Array.isArray(data.programs)
        ? data.programs.map(
          (program) => ({
            _key:
              program._key,

            type:
              programLabels[
              program.type
              ] ||
              program.type ||
              '',

            title:
              program.title || '',

            description:
              extractText(
                program.description,
              ) || '',
          }),
        )
        : [],
  }
}

/**
 * ============================================================================
 * BTS / ON-SET ITEMS
 * ============================================================================
 *
 * IMPORTANT:
 *
 * Only media explicitly marked:
 *
 *   role: "bts"
 *
 * is returned here.
 *
 * Generic project images/videos are NEVER
 * inferred to be BTS.
 * ============================================================================
 */

export async function getBtsItems() {
  const projectsQuery = `
    *[
      _type == "project" &&
      count(media[role == "bts"]) > 0
    ]
    | order(date desc, _createdAt desc) {
      _id,
      title,
      slug,
      client,
      artist,
      location,
      date,

      media[role == "bts"] {
        ${mediaItemProjection}
      }
    }
  `

  const projects =
    await safeFetch(
      projectsQuery,
    )

  if (!Array.isArray(projects)) {
    return []
  }

  const btsItems = []

  for (const project of projects) {
    const media =
      Array.isArray(project.media)
        ? [...project.media].sort(
          (a, b) =>
            (a?.order ?? 0) -
            (b?.order ?? 0),
        )
        : []

    for (
      const item of media
    ) {
      if (!item) continue

      const posterUrl =
        item.image
          ? urlForImage(
            item.image,
            1800,
          ) ||
          item.image?.asset?.url ||
          ''
          : item.poster
            ? urlForImage(
              item.poster,
              1800,
            ) ||
            item.poster?.asset?.url ||
            ''
            : ''

      const videoUrl =
        item.video?.asset?.url ||
        ''

      if (
        !posterUrl &&
        !videoUrl
      ) {
        continue
      }

      btsItems.push({
        _id:
          `${project._id}-${item._key}`,

        title:
          project.title ||
          'Untitled Project',

        slug:
          project.slug || null,

        category:
          'bts',

        categoryLabel:
          'BTS',

        clientOrArtist:
          project.artist ||
          project.client ||
          '',

        location:
          project.location || '',

        dateFormatted:
          project.date
            ? formatProjectDate(
              project.date,
            )
            : '',

        posterUrl,

        poster:
          posterUrl,

        videoUrl:
          videoUrl || null,

        caption:
          item.caption || '',

        alt:
          item.alt || '',

        mediaRole:
          'bts',

        parentProject: {
          _id:
            project._id,

          title:
            project.title ||
            'Untitled Project',

          slug:
            project.slug || null,
        },
      })
    }
  }

  return btsItems
}

/**
 * ============================================================================
 * DATE FORMATTER
 * ============================================================================
 */

function formatProjectDate(
  date,
) {
  if (!date) return ''

  const parts =
    String(date).split('-')

  if (parts.length >= 2) {
    const monthIndex =
      parseInt(parts[1], 10) - 1

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    if (
      monthIndex >= 0 &&
      monthIndex < 12
    ) {
      return `${monthNames[monthIndex]} ${parts[0]}`
    }
  }

  return String(date)
}