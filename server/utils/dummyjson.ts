/**
 * DummyJSON types and mappers – server-only.
 *
 * BFF DTO mapping: External APIs (like DummyJSON) return their own shapes. We map them to
 * internal DTOs (ProductListItem, ProductDetail) so the frontend gets a stable, minimal contract.
 * Benefits: hide external fields, control payload size, allow API swaps without frontend changes.
 *
 * Only the server imports this – it calls DummyJSON and maps. The frontend never sees raw DummyJSON.
 */
import type {
  ProductDetail,
  ProductListItem,
  ProductListResponse,
} from '~/types/product'

/** Raw DummyJSON product shape from external API. */
export interface DummyJsonProduct {
  id: number
  title: string
  description?: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  tags?: string[]
  brand?: string
  sku?: string
  weight?: number
  dimensions?: { width: number; height: number; depth: number }
  warrantyInformation?: string
  shippingInformation?: string
  returnPolicy?: string
  availabilityStatus?: string
  minimumOrderQuantity?: number
  thumbnail?: string
  images?: string[]
  category?: string
  reviews?: Array<{
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
  }>
  meta?: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  [key: string]: unknown
}

/** Raw DummyJSON category shape from GET /products/categories. */
export interface DummyJsonCategory {
  slug: string
  name: string
  url: string
}

/** Raw DummyJSON products list response. */
export interface DummyJsonProductsResponse {
  products: DummyJsonProduct[]
  total: number
  skip: number
  limit: number
}

/** Map DummyJSON product to ProductListItem. */
export function toProductListItem(raw: DummyJsonProduct): ProductListItem {
  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    thumbnail: raw.thumbnail ?? '',
    category: raw.category ?? '',
  }
}

/** Map DummyJSON product to ProductDetail. */
export function toProductDetail(raw: DummyJsonProduct): ProductDetail {
  const thumb = raw.thumbnail ?? ''
  const images = raw.images ?? []
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? '',
    price: raw.price,
    thumbnail: thumb,
    images,
    category: raw.category ?? '',
    rating: raw.rating ?? 0,
  }
}

/**
 * Filter products to those matching q in visible fields only (title, category).
 * Used to restrict search results to what users see on product cards.
 */
export function filterByVisibleFields(
  products: DummyJsonProduct[],
  q: string
): DummyJsonProduct[] {
  const lower = q.toLowerCase()
  return products.filter(
    (p) =>
      p.title?.toLowerCase().includes(lower) ||
      p.category?.toLowerCase().includes(lower)
  )
}

/** Map DummyJSON response to ProductListResponse. */
export function toProductListResponse(
  raw: DummyJsonProductsResponse,
  page: number
): ProductListResponse {
  return {
    items: raw.products.map(toProductListItem),
    total: raw.total,
    page,
    limit: raw.limit,
  }
}
