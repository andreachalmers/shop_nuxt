/**
 * API types – shapes returned by our BFF routes.
 * Product types in product.ts.
 */

/** Category for filter dropdown – GET /api/categories */
export interface Category {
  slug: string
  name: string
}

/** Response from GET /api/categories */
export type CategoriesResponse = Category[]
