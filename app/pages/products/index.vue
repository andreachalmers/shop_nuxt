<script setup lang="ts">
/**
 * PLP (Product Listing Page) – list products with search, filters, pagination.
 *
 * DATA FLOW:
 * - URL query (?page=2&q=phone&category=smartphones) is the source of truth.
 * - Changing filters/search/pagination updates the URL → useAsyncData key changes → refetch.
 * - Components (ProductFilters, Pagination) emit changes; page updates URL; never fetch in components.
 *
 * SSR vs CSR:
 * - SSR (first load, or direct URL): useAsyncData runs on the server. Data is serialized into
 *   the HTML payload. User sees content immediately; no loading skeleton on first paint.
 * - CSR (client navigation): useAsyncData runs in the browser. pending becomes true; we show
 *   a skeleton until the fetch completes.
 *
 * CACHING (useAsyncData):
 * - Each unique key (e.g. "products-2-phone-smartphones") is cached.
 * - Same key (e.g. navigating away and back) reuses cached data – no refetch.
 * - Different key triggers a new fetch.
 * - Categories use key "categories" – fetched once, cached for the session.
 */
import { PRODUCTS_GRID_SKELETON_COUNT, PRODUCTS_PER_PAGE } from '~/constants'
import type { CategoriesResponse } from '~/types/api'
import type { ProductListResponse } from '~/types/product'

const route = useRoute()
const router = useRouter()
const { fetchProductsList, fetchCategories } = useProducts()

/** Read state from URL. page=1 is implicit (omitted from URL). */
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const q = computed(() => (route.query.q as string) ?? '')
const category = computed(() => (route.query.category as string) ?? '')

/**
 * Cache key for useAsyncData. When this changes (e.g. user searches, changes page),
 * Nuxt invalidates the cache and refetches. Same key = cached response.
 */
const fetchKey = computed(
  () => `products-${page.value}-${q.value}-${category.value}`
)

/**
 * useAsyncData: Nuxt's data fetching primitive. Handles SSR + CSR + caching.
 * - On SSR: Runs the fetcher on the server; result is serialized into the page payload.
 * - On CSR: Runs in browser. If key matches payload, uses cached data (no refetch).
 * - data: reactive ref with the result; pending: true while loading.
 */
const { data, pending } = await useAsyncData<ProductListResponse>(
  fetchKey,
  () =>
    fetchProductsList({
      page: page.value,
      q: q.value || undefined,
      category: category.value || undefined,
    })
)

const products = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const totalPages = computed(
  () => Math.ceil(total.value / PRODUCTS_PER_PAGE) || 1
)

/**
 * Categories: fetched once with a fixed key. Cached for the whole session.
 * No need to refetch when page/q/category change.
 */
const { data: categoriesData } = await useAsyncData<CategoriesResponse>(
  'categories',
  () => fetchCategories()
)
const categories = computed(
  () => categoriesData.value ?? []
)

/** Merge partial query into URL. Used by Pagination and ProductFilters. */
function updateQuery(partial: Record<string, string | number | null | undefined>) {
  const query = { ...route.query }
  for (const [k, v] of Object.entries(partial)) {
    if (v == null || v === '') {
      delete query[k]
    } else {
      query[k] = String(v)
    }
  }
  router.push({ path: route.path, query })
}
function onPageChange(p: number) {
  updateQuery({ page: p === 1 ? null : p })
}

function onFiltersChange(payload: { search: string; category: string }) {
  updateQuery({
    q: payload.search || null,
    category: payload.category || null,
    page: null,
  })
}

const isClientNav = ref(false)
onMounted(() => {
  isClientNav.value = true
})
const showSkeleton = computed(() => pending.value && isClientNav.value)
</script>

<template>
  <div>
    <span class="block text-3xl font-bold tracking-wide uppercase mb-8 text-black"
      >Products</span
    >
    <ProductFilters
      :categories="categories"
      :search="q"
      :category="category"
      @update:filters="onFiltersChange"
    />
    <!-- Data loaded, not loading: show grid -->
    <ProductGrid
      v-if="products.length && !showSkeleton"
      :products="products"
      :get-product-href="(p) => `/products/${p.id}`"
    />
    <!-- Client nav + loading: skeleton (SSR never shows this – we wait for data) -->
    <div
      v-else-if="showSkeleton"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8"
    >
      <div
        v-for="i in PRODUCTS_GRID_SKELETON_COUNT"
        :key="i"
        class="h-72 bg-neutral-100 animate-pulse rounded"
      />
    </div>
    <!-- No results for current filters -->
    <p
      v-else-if="!pending && (q || category)"
      class="text-neutral-500 py-8"
    >
      No products found. Try adjusting your search or filters.
    </p>
    <Pagination
      v-if="totalPages > 1"
      :total-pages="totalPages"
      :total="total"
      :limit="PRODUCTS_PER_PAGE"
      :current-page="page"
      :loading="pending"
      :on-page-change="onPageChange"
    />
  </div>
</template>
