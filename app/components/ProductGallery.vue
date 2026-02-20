<script setup lang="ts">
/**
 * ProductGallery – main image + prev/next buttons + thumbnail strip.
 *
 * The prev/next buttons and clickable thumbnails are wrapped in <ClientOnly>.
 */
const props = defineProps<{
  alt: string
  images: string[]
  thumbnail?: string
}>()

const galleryImages = computed(() => {
  const imgs = props.images?.filter(Boolean) ?? []
  if (imgs.length > 0) return imgs
  if (props.thumbnail) return [props.thumbnail]
  return []
})

const selectedIndex = ref(0)
const selectedImage = computed(
  () => galleryImages.value[selectedIndex.value] ?? galleryImages.value[0]
)

function prev() {
  selectedIndex.value = Math.max(0, selectedIndex.value - 1)
}

function next() {
  selectedIndex.value = Math.min(
    galleryImages.value.length - 1,
    selectedIndex.value + 1
  )
}
</script>

<template>
  <div
    v-if="galleryImages.length > 0"
    class="flex flex-col gap-4"
  >
    <!-- Main image: rendered on SSR and CSR. selectedIndex (client) controls which image. -->
    <div
      class="relative aspect-square bg-neutral-100 overflow-hidden rounded-lg"
      role="img"
      :aria-label="`${alt} - image ${selectedIndex + 1} of ${galleryImages.length}`"
    >
      <img
        :src="selectedImage"
        sizes="(max-width: 768px) 100vw, 50vw"
        :alt="`${alt} - image ${selectedIndex + 1}`"
        width="800"
        height="800"
        fetchpriority="high"
        class="w-full h-full object-cover block transition-opacity duration-200"
      />
      <!-- Prev/next: ClientOnly – interactive controls only after hydration. SSR shows image only. -->
      <ClientOnly v-if="galleryImages.length > 1">
        <template #fallback />
        <button
            type="button"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white border border-neutral-200 rounded-full shadow-sm transition-colors disabled:opacity-40"
            aria-label="Previous image"
            :disabled="selectedIndex === 0"
            @click="prev"
          >
            <span class="sr-only">Previous</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white border border-neutral-200 rounded-full shadow-sm transition-colors disabled:opacity-40"
            aria-label="Next image"
            :disabled="selectedIndex === galleryImages.length - 1"
            @click="next"
          >
            <span class="sr-only">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
      </ClientOnly>
    </div>
    <!-- Thumbnails: ClientOnly. Fallback = static thumbnails (SSR); default = clickable (CSR). -->
    <ClientOnly v-if="galleryImages.length > 1">
      <template #fallback>
        <div class="flex gap-2 overflow-x-auto pb-1">
          <div
            v-for="img in galleryImages"
            :key="img"
            class="shrink-0 w-16 h-16 border-2 border-neutral-200 overflow-hidden rounded"
          >
            <img
              :src="img"
              :alt="`${alt} thumbnail`"
              width="64"
              height="64"
              class="w-full h-full object-cover block"
              loading="lazy"
            />
          </div>
        </div>
      </template>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="(img, idx) in galleryImages"
          :key="img"
          type="button"
          class="shrink-0 w-16 h-16 border-2 overflow-hidden rounded transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          :class="
            idx === selectedIndex
              ? 'border-accent ring-2 ring-accent/30'
              : 'border-neutral-200 hover:border-neutral-300'
          "
          :aria-label="`View image ${idx + 1}`"
          :aria-current="idx === selectedIndex ? 'true' : undefined"
          @click="selectedIndex = idx"
        >
          <img
            :src="img"
            :alt="`${alt} thumbnail ${idx + 1}`"
            width="64"
            height="64"
            class="w-full h-full object-cover block"
            loading="lazy"
          />
        </button>
      </div>
    </ClientOnly>
  </div>
</template>
