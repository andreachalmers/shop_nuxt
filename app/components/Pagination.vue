<script setup lang="ts">
/**
 * Pagination – prev/next and page number buttons.
 * receives currentPage and onPageChange from parent.
 */
const props = withDefaults(
  defineProps<{
    totalPages: number
    total: number
    limit: number
    currentPage: number
    loading?: boolean
    onPageChange: (page: number) => void
  }>(),
  { loading: false }
)

const hasPrev = computed(
  () => props.currentPage > 1 && !props.loading
)
const hasNext = computed(
  () => props.currentPage < props.totalPages && !props.loading
)

const start = computed(
  () => (props.currentPage - 1) * props.limit + 1
)
const end = computed(() =>
  Math.min(props.currentPage * props.limit, props.total)
)

function goTo(page: number) {
  if (page >= 1 && page <= props.totalPages && !props.loading) {
    props.onPageChange(page)
  }
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-between gap-4 flex-wrap mt-10 pt-8 border-t border-neutral-200"
    aria-label="Pagination"
  >
    <p class="text-sm text-neutral-500">
      Showing {{ start }}-{{ end }} of {{ total }}
    </p>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="py-2 px-4 border border-neutral-200 bg-white text-black text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors"
        :disabled="!hasPrev"
        :aria-disabled="loading || props.currentPage <= 1"
        aria-label="Previous page"
        @click="goTo(props.currentPage - 1)"
      >
        Previous
      </button>
      <div class="flex items-center gap-1">
        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          class="min-w-[2.25rem] py-2 px-2 border text-sm font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="
            p === props.currentPage
              ? 'border-accent bg-accent text-white'
              : 'border-neutral-200 bg-white text-black hover:border-accent'
          "
          :aria-label="`Page ${p}`"
          :aria-current="p === props.currentPage ? 'page' : undefined"
          :disabled="loading"
          @click="goTo(p)"
        >
          {{ p }}
        </button>
      </div>
      <button
        type="button"
        class="py-2 px-4 border border-neutral-200 bg-white text-black text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors"
        :disabled="!hasNext"
        :aria-disabled="loading || props.currentPage >= totalPages"
        aria-label="Next page"
        @click="goTo(props.currentPage + 1)"
      >
        Next
      </button>
    </div>
  </nav>
</template>
