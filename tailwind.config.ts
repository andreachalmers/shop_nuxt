/**
 * Tailwind CSS configuration. Nuxt/Tailwind module merges this with defaults.
 * content: [] – Tailwind scans app/ for class names via the Nuxt integration.
 */
import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#d87d4a',
          hover: '#c26a3a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
