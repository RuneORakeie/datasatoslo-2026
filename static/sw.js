// Override the theme's sw.js to prevent caching
// Create this file as /static/sw.js to override the theme's version

"use strict";

console.log("Custom cache-busting service worker loaded");

self.addEventListener('install', function(event) {
  console.log('Cache-busting service worker installed');
  // Clear any existing caches from the old service worker
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Cache-busting service worker activated');
  event.waitUntil(
    // Clear all caches again to be sure
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Handle HTML pages - always fetch fresh, never cache
  if (event.request.method === 'GET' && 
      (event.request.url.endsWith('/') || 
       event.request.url.includes('.html') ||
       event.request.destination === 'document')) {
    
    console.log('Forcing fresh fetch for HTML:', event.request.url);
    
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }).then(function(response) {
        console.log('Fresh HTML response for:', event.request.url);
        return response;
      }).catch(function(error) {
        console.error('Failed to fetch fresh HTML:', error);
        // Don't serve from cache for HTML - let it fail
        return new Response('Network error', { status: 503 });
      })
    );
  }
  
  // For non-HTML resources (CSS, JS, images), allow normal caching
  // This prevents breaking the site's performance for static assets
});