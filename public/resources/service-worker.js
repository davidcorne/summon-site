/* global self, caches, fetch */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1'
const RUNTIME = 'runtime'

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/',
  'public/resources/index.css',
  'public/resources/index.js',
  'public/resources/sorttable.js',
  'public/images/FreeAction.png',
  'public/images/OneAction.png',
  'public/images/Reaction.png',
  'public/images/ThreeActions.png',
  'public/images/TwoActions.png'
]

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  console.log('Starting install')
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  )
})

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME]
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete)
      }))
    }).then(() => self.clients.claim())
  )
})

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  console.log('Fetch called')
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        console.log('Cache hit')
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
