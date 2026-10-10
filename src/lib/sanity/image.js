import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client.js'

let builder = null
if (client) {
  try {
    builder = createImageUrlBuilder(client)
  } catch {
    builder = null
  }
}

export function urlForImage(source) {
  if (!source) return ''
  if (typeof source === 'string') return source
  if (source.asset && source.asset._ref && builder) {
    try {
      return builder.image(source).auto('format').fit('max')
    } catch {
      return source.asset.url || ''
    }
  }
  return source.asset?.url || source.url || ''
}
