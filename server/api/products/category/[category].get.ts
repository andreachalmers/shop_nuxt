/**
 * GET /api/products/category/:category – products in a category.
 *
 * BFF: Proxies to dummyjson.com/products/category/:category.
 * Route: server/api/products/category/[category].get.ts → GET /api/products/category/smartphones
 */
import { PRODUCTS_PER_PAGE } from '#server/utils/constants'
import type { ProductListResponse } from '~/types/product'
import {
  type DummyJsonProductsResponse,
  toProductListResponse,
} from '#server/utils/dummyjson'

export default defineEventHandler(async (event): Promise<ProductListResponse> => {
  const category = getRouterParam(event, 'category')
  const query = getQuery(event)
  const limit = Number(query.limit) || PRODUCTS_PER_PAGE
  const skip = Number(query.skip) || 0
  const excludeId = query.exclude ? String(query.exclude) : undefined
  const page = Math.floor(skip / limit) + 1

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category is required',
    })
  }

  // When excluding a product, fetch one extra so we have enough after filtering
  const fetchLimit = excludeId ? limit + 1 : limit
  const raw = await $fetch<DummyJsonProductsResponse>(
    'https://dummyjson.com/products/category/' + category,
    { query: { limit: fetchLimit, skip } }
  )

  let response = toProductListResponse(raw, page)
  if (excludeId) {
    response = {
      ...response,
      items: response.items
        .filter((item) => String(item.id) !== excludeId)
        .slice(0, limit),
    }
  }
  return response
})
