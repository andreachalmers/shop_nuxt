/**
 * GET /api/products – paginated product list.
 *
 * BFF: This Nitro route is the only thing that calls dummyjson.com. The frontend calls
 * /api/products. Same-origin, no CORS. We fetch from DummyJSON, map to our DTOs, return.
 *
 * Route: server/api/products/index.get.ts → GET /api/products
 * Query: limit, skip (DummyJSON uses skip/limit; we compute page for our DTO)
 */
import { PRODUCTS_PER_PAGE } from '#server/utils/constants'
import type { ProductListResponse } from '~/types/product'
import {
  type DummyJsonProductsResponse,
  toProductListResponse,
} from '#server/utils/dummyjson'

export default defineEventHandler(async (event): Promise<ProductListResponse> => {
  const query = getQuery(event)
  const limit = Number(query.limit) || PRODUCTS_PER_PAGE
  const skip = Number(query.skip) || 0
  const page = Math.floor(skip / limit) + 1

  const raw = await $fetch<DummyJsonProductsResponse>(
    'https://dummyjson.com/products',
    { query: { limit, skip } }
  )

  return toProductListResponse(raw, page)
})
