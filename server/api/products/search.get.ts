/**
 * GET /api/products/search – search products by query.
 *
 * DummyJSON search returns products matching q across many fields. We post-filter to
 * title and category only (filterByVisibleFields) so results match what users see on cards.
 *
 * Route: GET /api/products/search?q=phone&limit=20&skip=0
 */
import { PRODUCTS_PER_PAGE } from '#server/utils/constants'
import type { ProductListResponse } from '~/types/product'
import {
  type DummyJsonProductsResponse,
  filterByVisibleFields,
  toProductListResponse,
} from '#server/utils/dummyjson'

export default defineEventHandler(async (event): Promise<ProductListResponse> => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const limit = Number(query.limit) || PRODUCTS_PER_PAGE
  const skip = Number(query.skip) || 0
  const page = Math.floor(skip / limit) + 1
  if (!q) {
    throw createError({ statusCode: 400, statusMessage: 'Query q is required' })
  }
  const raw = await $fetch<DummyJsonProductsResponse>(
    'https://dummyjson.com/products/search',
    { query: { q, limit, skip } }
  )
  const filtered = filterByVisibleFields(raw.products, q)
  return toProductListResponse(
    { ...raw, products: filtered, total: filtered.length },
    page
  )
})
