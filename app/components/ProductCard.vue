<script setup lang="ts">
defineProps<{
  thumbnail: string
  title: string
  price: number
  category: string
  to: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex flex-col bg-white text-black no-underline transition-opacity hover:opacity-85"
  >
    <div
      v-if="thumbnail"
      class="aspect-square bg-neutral-200 overflow-hidden"
    >
      <img
        :src="thumbnail"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        :alt="title"
        width="400"
        height="400"
        class="w-full h-full object-cover block"
        loading="lazy"
      />
    </div>
    <div class="flex flex-col py-6 gap-2">
      <span class="text-[13px] uppercase tracking-widest text-neutral-500">{{ category }}</span>
      <span class="text-2xl font-bold leading-tight tracking-wide uppercase text-black">{{ title }}</span>
      <span class="text-lg font-bold tracking-widest text-black">$ {{ price.toLocaleString() }}</span>
    </div>
  </NuxtLink>
</template>
