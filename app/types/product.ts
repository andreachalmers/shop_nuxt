/**
 * Product types – internal DTOs returned by our BFF (/api/*).
 *
 * We define minimal shapes: only what the frontend needs. The server maps external
 * API responses (e.g. DummyJSON) to these. Keeping DTOs small improves payload size.
 */

/** Product card on PLP – id, title, price, thumbnail, category. */
export interface ProductListItem {
  id: number
  title: string
  price: number
  thumbnail: string
  category: string
}

/** Product detail on PDP – full info including description, images, rating. */
export interface ProductDetail {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  images: string[]
  category: string
  rating: number
}

/** Paginated list response from /api/products, /api/products/search, /api/products/category/:cat */
export interface ProductListResponse {
  items: ProductListItem[]
  total: number
  page: number
  limit: number
}
