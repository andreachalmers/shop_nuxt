<script setup lang="ts">
/**
 * PDP (Product Detail Page) – single product with related products.
 *
 * SSR: Opening /products/4 directly (e.g. from Google) triggers server render.
 * The product HTML is in the initial response – good for SEO. Crawlers see full content.
 *
 * CSR: Clicking from PLP to another product triggers client navigation.
 * useAsyncData fetches in the browser; we show a skeleton until loaded.
 *
 */
import { RELATED_PRODUCTS_LIMIT } from '~/constants'
import type { ProductDetail } from '~/types/product'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { fetchProductById, fetchProductsByCategory } = useProducts()

/**
 * Product fetch: key = product-{id}. Cached per product.
 * 404: If API returns null, we throw createError so Nuxt shows error.vue.
 */
const productKey = computed(() => `product-${id.value}`)
const { data: product, pending: productPending } = await useAsyncData<ProductDetail | null>(
  productKey,
  () => fetchProductById(id.value)
)

if (!product.value) {
  throw createError({ statusCode: 404, message: 'Product not found' })
}

/**
 * SEO meta tags: useSeoMeta sets <title>, <meta name="description">, Open Graph tags.
 * SSR: These are in the initial HTML, so crawlers (Google, social shares) see them.
 * CSR: Reactive – when product loads on client nav, meta updates.
 */
const url = useRequestURL()
useSeoMeta({
  title: computed(() => (product.value ? `${product.value.title} | Shop` : '')),
  description: computed(() =>
    product.value
      ? (product.value.description?.slice(0, 160) ?? `${product.value.title} – available now`)
      : ''
  ),
  ogTitle: computed(() => product.value?.title ?? ''),
  ogDescription: computed(() =>
    product.value
      ? (product.value.description?.slice(0, 160) ?? product.value.title)
      : ''
  ),
  ogImage: computed(
    () => (product.value?.thumbnail || product.value?.images?.[0]) ?? ''
  ),
  ogUrl: url.href,
  ogType: 'website',
})

/**
 * Related products: fetched by category
 */
const relatedKey = computed(() => `related-${id.value}`)
const { data: relatedProducts, pending: relatedPending } = await useAsyncData(
  relatedKey,
  async () => {
    const p = product.value
    if (!p) return []
    return fetchProductsByCategory(p.category, RELATED_PRODUCTS_LIMIT, p.id)
  },
  { watch: [() => product.value?.category] }
)
</script>

<template>
  <div class="max-w-[1110px] mx-auto">
    <NuxtLink
      to="/products"
      class="inline-block mb-6 text-neutral-500 no-underline text-[15px] transition-colors hover:text-accent"
    >
      Go Back
    </NuxtLink>

    <article
      v-if="productPending"
      class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[7.5rem] items-start"
      aria-busy="true"
    >
      <div class="aspect-square bg-neutral-100 animate-pulse rounded-lg" />
      <div class="flex flex-col gap-4 pt-1">
        <div class="h-10 w-3/4 bg-neutral-100 animate-pulse rounded" />
        <div class="h-4 w-full bg-neutral-100 animate-pulse rounded" />
        <div class="h-6 w-24 bg-neutral-100 animate-pulse rounded" />
      </div>
    </article>
    <article
      v-else-if="product"
      class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[7.5rem] items-start"
    >
      <ProductGallery
        :alt="product.title"
        :images="product.images"
        :thumbnail="product.thumbnail"
      />
      <div class="flex flex-col gap-6 items-start pt-1">
        <span class="text-4xl font-bold leading-tight tracking-wide uppercase text-black max-w-[20ch]">{{ product.title.toUpperCase() }}</span>
        <StarRating v-if="product.rating > 0" :rating="product.rating" />
        <span class="text-[15px] leading-relaxed text-neutral-500">{{ product.description }}</span>
        <span class="text-lg font-bold tracking-widest text-black">$ {{ product.price.toLocaleString() }}</span>
      </div>
    </article>

    <section
      v-if="product && ((relatedProducts ?? []).length > 0 || relatedPending)"
      class="mt-20 pt-16 border-t border-neutral-200"
    >
      <h2 class="text-2xl font-bold tracking-wide uppercase text-black mb-10">You may also like</h2>
      <ProductGrid
        v-if="(relatedProducts ?? []).length > 0"
        :products="relatedProducts ?? []"
        :get-product-href="(p) => `/products/${p.id}`"
      />
      <div
        v-else-if="relatedPending"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8"
        aria-busy="true"
      >
        <div v-for="i in RELATED_PRODUCTS_LIMIT" :key="i" class="flex flex-col">
          <div class="aspect-square bg-neutral-100 animate-pulse rounded" />
          <div class="flex flex-col py-6 gap-2">
            <div class="h-3 w-16 bg-neutral-100 animate-pulse rounded" />
            <div class="h-7 w-3/4 bg-neutral-100 animate-pulse rounded" />
            <div class="h-6 w-20 bg-neutral-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
