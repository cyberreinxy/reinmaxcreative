/**
 * @file Service Worker for Reinmax Creative website.
 * @description Implements a cache-first strategy for static assets to ensure fast, reliable loads on repeat visits.
 * @version 1.0
 */

const CACHE_NAME = "reinmax-creative-cache-v1";

// A list of critical assets to be cached upon installation.
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/portfolio.html",
  "/checkout.html",
  "/data.js",
  "/style.css",
  "/script.js",
  "/mp4/HD.mp4",
  "/jpg/hero-fallback.jpg",
  // Key images from the portfolio section to ensure they are cached
  "https://cdn.dribbble.com/userupload/19372077/file/original-8c487672d7e4cce8373592b47384c8ff.jpg?resize=1024x768&vertical=center",
  "https://inspi.com.br/wp-content/uploads/2023/05/design-e-designer-diferenca.jpg",
  "https://res.cloudinary.com/reinmaxcreative/image/upload/v1755488111/graphic-design.webp",
  "https://cdn.prod.website-files.com/650b672b6d49343e2368aa57/6553870d2010e022bbdf20db_6171946b9862996e03b20db2_2D_Animation.gif",
  "https://res.cloudinary.com/reinmaxcreative/image/upload/v1755780121/logo-icon.svg",
  // External assets
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap",
];

/**
 * Install event: triggered when the service worker is first installed.
 * It opens the cache and adds all the specified URLs to it.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

/**
 * Activate event: triggered when the service worker is activated.
 * This is a good place to clean up old, unused caches.
 */
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Fetch event: triggered for every network request made by the page.
 * It checks if the request is in the cache and serves it from there if available.
 * If not, it fetches from the network, caches the response, and then serves it.
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response from cache
      if (response) {
        return response;
      }
      // Not in cache - fetch from network
      return fetch(event.request);
    })
  );
});
