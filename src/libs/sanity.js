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
| Sanity File URL Helper
|--------------------------------------------------------------------------
|
| Sanity file asset references look like:
|
| file-<asset-id>-<extension>
|
| Example:
|
| file-abc12345-....-mp4
|
| The asset ID itself can contain hyphens, so the expression below
| separates the final extension from the complete asset ID.
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

    return `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${assetId}.${extension}`
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

// export async function getFeaturedProjects() {
//     return client.fetch(
//         `*[_type == "project" && featured == true] | order(sortOrder asc, year desc, month desc)`
//     )
// }


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
        `*[_type == "project" && $category in categories] | order(sortOrder asc, year desc, month desc)`,
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
export async function getSiteSettings() {
    const settings = await client.fetch(
        `*[_type == "siteSettings"][0]`
    )

    if (!settings) {
        return null
    }

    return {
        ...settings,

        heroVideoUrl: settings.showreelVideo
            ? getFileUrl(settings.showreelVideo)
            : '',

        heroPosterUrl: settings.showreelPoster
            ? urlFor(settings.showreelPoster)?.url()
            : '',
    }
}

export async function getAboutContent() {
    const about = await client.fetch(
        `*[_type == "about"][0]`
    )

    if (!about) {
        return null
    }

    return {
        ...about,

        portraitImageUrl: about.portrait
            ? urlFor(about.portrait)?.url()
            : '',

        supportingImages: Array.isArray(about.supportingImages)
            ? about.supportingImages.map((image) => ({
                ...image,
                url: urlFor(image)?.url() || '',
            }))
            : [],
    }
}

export async function getMentoringContent() {
    return client.fetch(
        `*[_type == "mentoring"][0]`
    )
}

export function urlForSquare(source, width = 800) {
    if (!source) {
        return null
    }

    return imageBuilder
        .image(source)
        .width(width)
        .height(width)
        .fit('crop')
        .url()
}

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
        .url()
}
