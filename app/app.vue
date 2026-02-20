<template>
  <div class="min-h-screen font-sans text-black bg-white antialiased">
    <header class="bg-black border-b border-white/10">
      <div class="flex items-center justify-between px-6 py-8 max-w-[1110px] mx-auto">
        <NuxtLink to="/" class="font-bold text-xl tracking-wider text-white no-underline">shop</NuxtLink>
        <nav class="flex gap-8">
          <NuxtLink to="/" class="text-white/90 text-[13px] font-bold tracking-[0.2em] uppercase no-underline hover:opacity-80 transition-opacity">Home</NuxtLink>
          <NuxtLink to="/products" class="text-white/90 text-[13px] font-bold tracking-[0.2em] uppercase no-underline hover:opacity-80 transition-opacity">Products</NuxtLink>
        </nav>
        <div class="text-white cursor-pointer" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
    <main class="flex-1 px-6 py-12 pb-16 max-w-[1110px] mx-auto">
      <NuxtPage />
    </main>
  </div>
</template>
