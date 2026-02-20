/**
 * GET /api/products/:id – single product by ID.
 *
 * BFF: Proxies to dummyjson.com/products/:id. Maps to ProductDetail DTO.
 * 404: If DummyJSON fails (e.g. invalid ID), we throw createError so Nuxt shows error.vue.
 *
 * Route: server/api/products/[id].get.ts → GET /api/products/:id
 */
import type { ProductDetail } from '~/types/product'
import {
  type DummyJsonProduct,
  toProductDetail,
} from '#server/utils/dummyjson'

export default defineEventHandler(async (event): Promise<ProductDetail> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    })
  }

  try {
    const raw = await $fetch<DummyJsonProduct>(
      `https://dummyjson.com/products/${id}`
    )
    return toProductDetail(raw)
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }
})
