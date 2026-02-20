/**
 * useProducts – data fetching for products and categories.
 *
 * BFF (Backend-for-Frontend):
 * It only calls /api/* – our Nitro routes. Those routes proxy to DummyJSON, map responses to DTOs,
 * and return clean data.
 *
 */
import type { CategoriesResponse } from '~/types/api'
import type {
  ProductDetail,
  ProductListItem,
  ProductListResponse,
} from '~/types/product'
import { PRODUCTS_PER_PAGE, RELATED_PRODUCTS_LIMIT } from '~/constants'

/** Base path for product API. Nitro serves these at /api/products, /api/products/:id, etc. */
const API_BASE = '/api/products'

export function useProducts() {
  /** Fetches product list. Chooses endpoint by params: search, category, or default list. */
  async function fetchProductsList(opts: {
    page: number
    category?: string
    q?: string
  }): Promise<ProductListResponse> {
    const { page, category, q } = opts
    const limit = PRODUCTS_PER_PAGE
    const skip = (page - 1) * limit

    if (q?.trim()) {
      return await $fetch<ProductListResponse>(
        `${API_BASE}/search?q=${encodeURIComponent(q.trim())}&limit=${limit}&skip=${skip}`
      )
    }
    if (category) {
      return await $fetch<ProductListResponse>(
        `${API_BASE}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
      )
    }
    return await $fetch<ProductListResponse>(
      `${API_BASE}?limit=${limit}&skip=${skip}`
    )
  }

  /** Fetches category list for filter dropdown. */
  async function fetchCategories(): Promise<CategoriesResponse> {
    return await $fetch<CategoriesResponse>('/api/categories')
  }

  /** Fetches single product. Returns null on 404 */
  async function fetchProductById(id: string): Promise<ProductDetail | null> {
    try {
      return await $fetch<ProductDetail>(`${API_BASE}/${id}`)
    } catch {
      return null
    }
  }

  /** Fetches products in a category. Pass excludeId to omit that product (e.g. current PDP). */
  async function fetchProductsByCategory(
    category: string,
    limit = RELATED_PRODUCTS_LIMIT,
    excludeId?: string | number
  ): Promise<ProductListItem[]> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (excludeId != null) params.set('exclude', String(excludeId))
    const data = await $fetch<ProductListResponse>(
      `${API_BASE}/category/${category}?${params}`
    )
    return data.items
  }

  return {
    fetchProductsList,
    fetchCategories,
    fetchProductById,
    fetchProductsByCategory,
  }
}
