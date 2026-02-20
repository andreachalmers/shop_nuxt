/**
 * Nuxt configuration
 * https://nuxt.com/docs/api/configuration/nuxt-config
 *
 * Nuxt is a full-stack Vue framework. Key concepts:
 * - SSR (Server-Side Rendering): The first page load is rendered on the server,
 *   so the user gets HTML with content immediately. This helps SEO and perceived speed.
 * - CSR (Client-Side Rendering): After hydration, Vue takes over and handles
 *   client-side navigation and interactivity. Subsequent navigations can fetch
 *   data on the client.
 * - Nitro: Nuxt's server engine. Handles API routes (server/api/), SSR, and deployment.
 */
export default defineNuxtConfig({
  /**
   * compatibilityDate: Locks Nuxt features to a specific date. Ensures consistent
   * behavior across deployments and avoids surprise breaking changes.
   */
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
    // componentInspector: false,
  },
  /** Tailwind CSS for utility-first styling */
  modules: ['@nuxtjs/tailwindcss'],

  /**
   * Nitro configuration (commented out – using defaults).
   * Nitro compiles server/ source files (api/, routes/, middleware/) into .output/server/
   * on build. Your API routes become serverless/handler functions.
   */
  // nitro: {},
})