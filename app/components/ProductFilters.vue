<script setup lang="ts">
/**
 * ProductFilters – search input and category dropdown.
 */
import type { Category } from '~/types/api'
import { debounce } from '~/utils/debounce'

const props = withDefaults(
  defineProps<{
    categories?: Category[]
    search?: string
    category?: string
  }>(),
  { categories: () => [], search: '', category: '' }
)

const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
  'update:filters': [payload: { search: string; category: string }]
}>()

/** Local search input synced from prop; debounced emit on change. */
const searchInput = ref(props.search)
watch(
  () => props.search,
  (v) => { searchInput.value = v },
  { immediate: true }
)
const debouncedSearch = debounce((val: unknown) => {
  const s = String(val ?? '').trim()
  emit('update:search', s)
  emit('update:filters', { search: s, category: categoryModel.value })
}, 300)
watch(searchInput, debouncedSearch)

/** Category v-model: reads from prop, writes emit change to parent. */
const categoryModel = computed({
  get: () => props.category ?? '',
  set: (v: string) => {
    emit('update:category', v)
    emit('update:filters', { search: searchInput.value, category: v })
  },
})
</script>

<template>
  <div class="mb-10 w-full">
    <div class="flex gap-4 flex-wrap w-full">
      <div class="flex-1 min-w-[200px] relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </svg>
        </span>
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search products..."
          class="w-full py-3 pl-10 pr-4 border border-neutral-200 text-[15px] bg-white focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-400"
          aria-label="Search products"
        />
      </div>
      <select
        v-model="categoryModel"
        class="py-3 pl-4 pr-8 border border-neutral-200 text-[15px] min-w-[160px] bg-white text-black cursor-pointer focus:outline-none focus:border-accent transition-colors"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        <option v-for="cat in props.categories" :key="cat.slug" :value="cat.slug">
          {{ cat.name }}
        </option>
      </select>
    </div>
  </div>
</template>
