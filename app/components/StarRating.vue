<script setup lang="ts">
defineProps<{
  rating: number
}>()

function isFilled(index: number, rating: number) {
  return index < Math.round(rating)
}
</script>

<template>
  <div class="flex items-center gap-0.5" :aria-label="`Rating: ${rating}/5`">
    <span
      v-for="i in 5"
      :key="i"
      class="text-lg leading-none"
      :class="isFilled(i - 1, rating) ? 'text-amber-400' : 'text-neutral-300'"
    >
      {{ isFilled(i - 1, rating) ? '★' : '☆' }}
    </span>
  </div>
</template>
