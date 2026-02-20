<script setup lang="ts">
/**
 * ProductGrid – displays a grid of product cards.
 */
import type { ProductListItem } from '~/types/product'

defineProps<{
  products: ProductListItem[]
  getProductHref: (product: ProductListItem) => string
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :thumbnail="product.thumbnail"
      :title="product.title"
      :price="product.price"
      :category="product.category"
      :to="getProductHref(product)"
    />
  </div>
</template>
