import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// Get site URL from environment variable or default to localhost for development
const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  site: SITE_URL,
  server: {
    headers: {
      // These global headers supplement the ones in Layout.astro
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), microphone=()',
    }
  },
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // Use next-gen formats
        formats: ['avif', 'webp', 'png', 'jpg'],
        // Image quality optimization
        quality: 80,
        // Cache optimized images
        cacheDir: './.astro/image-cache',
      }
    },
  },
  integrations: [
    tailwind(),
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        return {
          ...item,
          priority: 0.7,
        };
      },
    }),
  ],
});