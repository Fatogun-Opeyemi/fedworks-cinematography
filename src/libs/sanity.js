import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: '4t9t903j',
    dataset: 'production',
    perspective: 'published',
    useCdn: true,
    apiVersion: '2026-10-01',
})

/*
|--------------------------------------------------------------------------
| Sanity Image URL Builder
|--------------------------------------------------------------------------
*/

const imageBuilder = imageUrlBuilder(client)

export function urlFor(source) {
    if (!source) {
        return null
    }

    return imageBuilder.image(source)
}

/*
|--------------------------------------------------------------------------
| Optimized Image URL
|--------------------------------------------------------------------------
|
| Generates responsive image URLs through Sanity's CDN.
| The original asset remains unchanged in Sanity.
|
| width: Maximum requested image width.
| quality: Image quality from 1–100.
| auto('format'): Allows the CDN to serve an efficient format
| such as WebP or AVIF when supported by the browser.
|
|--------------------------------------------------------------------------
*/

export function urlForOptimized(source, width = 1600, quality = 85) {
    if (!source) {
        return null
    }

    return imageBuilder
        .image(source)
        .width(width)
        .quality(quality)
        .auto('format')
        .url()
}

/*
|--------------------------------------------------------------------------
| High Resolution Image URL
|--------------------------------------------------------------------------
|
| Use when a visitor opens an image in the lightbox.
| This requests a larger rendition without forcing the browser
| to download the original 20 MB asset.
|
|--------------------------------------------------------------------------
*/

export function urlForHighResolution(source, quality = 90) {
    if (!source) {
        return null
    }

    return imageBuilder
        .image(source)
        .width(3000)
        .quality(quality)
        .auto('format')
        .url()
}

/*
|--------------------------------------------------------------------------
| Original Image Asset URL
|--------------------------------------------------------------------------
|
| Returns the original Sanity image asset URL without image
| transformations. Useful when offering an actual original download.
|
|--------------------------------------------------------------------------
*/

export function urlForOriginal(source) {
    const reference = source?.asset?._ref

    if (!reference) {
        return null
    }

    const match = reference.match(/^image-(.+)-([^-]+)$/)

    if (!match) {
        return null
    }

    const [, assetId, extension] = match

    const { projectId, dataset } = client.config()

    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}.${extension}`
}

/*
|--------------------------------------------------------------------------
| Sanity File URL Helper
|--------------------------------------------------------------------------
|
| Sanity file asset references look like:
|
| file-<asset-id>-<extension>
|
|--------------------------------------------------------------------------
*/

export function getFileUrl(file) {
    const reference = file?.asset?._ref

    if (!reference) {
        return null
    }

    const match = reference.match(/^file-(.+)-([^-]+)$/)

    if (!match) {
        return null
    }

    const [, assetId, extension] = match

    const { projectId, dataset } = client.config()

    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${extension}`
}

/*
|--------------------------------------------------------------------------
| Projects
|--------------------------------------------------------------------------
*/

export async function getProjects() {
    return client.fetch(
        `*[_type == "project"] | order(sortOrder asc, year desc, month desc)`
    )
}

/*
|--------------------------------------------------------------------------
| Featured / Selected Work
|--------------------------------------------------------------------------
*/

export async function getFeaturedProjects() {
    return client.fetch(
        `*[_type == "project" && featured == true]
        | order(
            coalesce(featuredSortOrder, sortOrder, 9999) asc,
            sortOrder asc,
            year desc,
            month desc
        )`
    )
}

/*
|--------------------------------------------------------------------------
| Projects by Category
|--------------------------------------------------------------------------
*/

export async function getProjectsByCategory(category) {
    return client.fetch(
        `*[_type == "project" && $category in categories]
        | order(sortOrder asc, year desc, month desc)`,
        { category }
    )
}

/*
|--------------------------------------------------------------------------
| Project by Slug
|--------------------------------------------------------------------------
*/

export async function getProjectBySlug(slug) {
    return client.fetch(
        `*[_type == "project" && slug.current == $slug][0]`,
        { slug }
    )
}

/*
|--------------------------------------------------------------------------
| Date Formatting
|--------------------------------------------------------------------------
*/

export function formatProjectDate(month, year) {
    if (!year) {
        return ''
    }

    if (!month) {
        return String(year)
    }

    const date = new Date(year, month - 1, 1)

    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
    }).format(date)
}

/*
|--------------------------------------------------------------------------
| Category Labels
|--------------------------------------------------------------------------
*/

export const categoryLabels = {
    narrative: 'Narrative',
    documentary: 'Documentary',
    commercial: 'Commercial',
    'music-video': 'Music Video',
    'social-content': 'Social Content',
    bts: 'BTS',
}

/*
|--------------------------------------------------------------------------
| Category Label Helper
|--------------------------------------------------------------------------
*/

export function getCategoryLabel(category) {
    return categoryLabels[category] || category
}

/*
|--------------------------------------------------------------------------
| Site Settings
|--------------------------------------------------------------------------
*/

// export async function getSiteSettings() {
//     const settings = await client.fetch(
//         `*[_type == "siteSettings"][0]`
//     )

//     if (!settings) {
//         return null
//     }

//     return {
//         ...settings,

//         heroVideoUrl: settings.showreelVideo
//             ? getFileUrl(settings.showreelVideo)
//             : '',

//         heroPosterUrl: settings.showreelPoster
//             ? urlForOptimized(settings.showreelPoster, 2000, 90)
//             : '',
//     }
// }


export async function getSiteSettings() {
    const settings = await client.fetch(
        `*[_type == "siteSettings"][0]`
    )

    if (!settings) {
        return null
    }

    return {
        ...settings,

        // LANDING HERO
        // Falls back to showreel* until you upload heroVideo/heroPoster.
        heroVideoUrl: settings.heroVideo
            ? getFileUrl(settings.heroVideo)
            : settings.showreelVideo
                ? getFileUrl(settings.showreelVideo)
                : '',

        heroPosterUrl: settings.heroPoster
            ? urlForOptimized(settings.heroPoster, 2000, 90)
            : settings.showreelPoster
                ? urlForOptimized(settings.showreelPoster, 2000, 90)
                : '',

        // INNER SHOWREEL
        // Reads ONLY the showreel* fields — never falls back to hero.
        showreelVideoUrl: settings.showreelVideo
            ? getFileUrl(settings.showreelVideo)
            : '',

        showreelPosterUrl: settings.showreelPoster
            ? urlForOptimized(settings.showreelPoster, 2000, 90)
            : '',
    }
}
/*
|--------------------------------------------------------------------------
| About Content
|--------------------------------------------------------------------------
*/

export async function getAboutContent() {
    const about = await client.fetch(
        `*[_type == "about"][0]`
    )

    if (!about) {
        return null
    }

    return {
        ...about,

        cvUrl: about.cv
            ? getFileUrl(about.cv) || ''
            : '',

        portraitImageUrl: about.portrait
            ? urlForOptimized(about.portrait, 1600, 90)
            : '',

        supportingImages: Array.isArray(about.supportingImages)
            ? about.supportingImages.map((image) => ({
                ...image,
                url: urlForOptimized(image, 1600, 85) || '',
            }))
            : [],
    }
}

/*
|--------------------------------------------------------------------------
| Mentoring Content
|--------------------------------------------------------------------------
*/

export async function getMentoringContent() {
    return client.fetch(
        `*[_type == "mentoring"][0]`
    )
}

/*
|--------------------------------------------------------------------------
| Square Image Helper
|--------------------------------------------------------------------------
*/

export function urlForSquare(source, width = 800) {
    if (!source) {
        return null
    }

    return imageBuilder
        .image(source)
        .width(width)
        .height(width)
        .fit('crop')
        .quality(85)
        .auto('format')
        .url()
}

/*
|--------------------------------------------------------------------------
| Rectangular Image Helper
|--------------------------------------------------------------------------
*/

export function urlForRect(source, width = 1200) {
    if (!source) {
        return null
    }

    const height = Math.round(width * 2 / 3)

    return imageBuilder
        .image(source)
        .width(width)
        .height(height)
        .fit('crop')
        .quality(85)
        .auto('format')
        .url()
}

export async function getBtsMedia() {
    const query = `*[
    _type == "project" &&
    count(
      media[
        type == "image" &&
        role == "bts" &&
        defined(image)
      ]
    ) > 0
  ] | order(year desc) {
    _id,
    title,
    year,
    month,
    "btsMedia": media[
      type == "image" &&
      role == "bts" &&
      defined(image)
    ] {
      _key,
      image,
      caption,
      alt,
      order
    }
  }`

    const projects = await client.fetch(query)

    return (projects || []).flatMap((project) =>
        [...(project.btsMedia || [])]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item) => ({
                ...item,
                projectId: project._id,
                projectTitle: project.title,
                projectYear: project.year,
            })),
    )
}