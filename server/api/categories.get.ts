/**
 * GET /api/categories – list of product categories.
 *
 * BFF: Proxies to dummyjson.com/products/categories. Maps to Category DTO (slug, name only).
 */
import type { Category, CategoriesResponse } from '~/types/api'
import type { DummyJsonCategory } from '#server/utils/dummyjson'

function toCategory(raw: DummyJsonCategory): Category {
  return { slug: raw.slug, name: raw.name }
}

export default defineEventHandler(async (): Promise<CategoriesResponse> => {
  const raw = await $fetch<DummyJsonCategory[]>(
    'https://dummyjson.com/products/categories'
  )
  return raw.map(toCategory)
})
