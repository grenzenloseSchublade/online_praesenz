/**
 * Service Worker für Offline-Caching
 * 
 * Dieser Service Worker ist verantwortlich für das Caching wichtiger Ressourcen,
 * insbesondere des Hintergrundbildes, um die Ladezeit zu verbessern und
 * Offline-Funktionalität zu ermöglichen.
 */

// Cache-Name mit Versionsnummer
const CACHE_NAME = 'kraftstoff-cache-v1';

// Ressourcen, die beim Installieren des Service Workers gecached werden sollen
const CACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/main.min.js',
  '/assets/js/image-cache.js',
  '/assets/js/sw-register.js',
  '/assets/images/background.jpg'
];

// Installation des Service Workers
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation');
  
  // Warten, bis der Cache geöffnet und die Ressourcen hinzugefügt wurden
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache geöffnet');
        return cache.addAll(CACHE_URLS.map(url => {
          // Relativen Pfad zum Basis-URL hinzufügen
          return url.startsWith('/') ? self.location.origin + url : url;
        }));
      })
      .then(() => {
        console.log('[Service Worker] Alle Ressourcen gecached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Fehler beim Cachen:', error);
      })
  );
});

// Aktivierung des Service Workers
self.addEventListener('activate', event => {
  console.log('[Service Worker] Aktivierung');
  
  // Alte Caches löschen
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Lösche alten Cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Jetzt aktiv');
        return self.clients.claim();
      })
  );
});

// Abfangen von Fetch-Requests
self.addEventListener('fetch', event => {
  // Nur GET-Requests behandeln
  if (event.request.method !== 'GET') return;
  
  // Ignoriere Chrome-Extensions und andere externe Requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Spezielle Behandlung für Bilder
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    event.respondWith(cacheFirst(event.request));
  } else {
    // Für alle anderen Ressourcen: Network-First-Strategie
    event.respondWith(networkFirst(event.request));
  }
});

// Cache-First-Strategie für Bilder
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fehler beim Abrufen:', error);
    // Fallback-Bild oder leere Response zurückgeben
    return new Response('Bild nicht verfügbar', { status: 404 });
  }
}

// Network-First-Strategie für andere Ressourcen
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Offline-Modus, verwende Cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback für HTML-Seiten
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    return new Response('Ressource nicht verfügbar', { status: 404 });
  }
}

// Nachricht-Event-Handler für explizites Caching von Bildern
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_IMAGES') {
    console.log('[Service Worker] Caching von Bildern angefordert');
    
    const imageUrls = event.data.images || [];
    if (imageUrls.length > 0) {
      caches.open(CACHE_NAME)
        .then(cache => {
          return Promise.all(
            imageUrls.map(url => {
              // Relativen Pfad zum Basis-URL hinzufügen
              const fullUrl = url.startsWith('/') ? self.location.origin + url : url;
              
              return fetch(fullUrl, { mode: 'no-cors' })
                .then(response => {
                  if (response) {
                    cache.put(fullUrl, response);
                    console.log('[Service Worker] Bild gecached:', url);
                    
                    // Benachrichtigung an Client senden
                    if (event.source) {
                      event.source.postMessage({
                        type: 'CACHE_COMPLETE',
                        url: url
                      });
                    }
                  }
                })
                .catch(error => {
                  console.error('[Service Worker] Fehler beim Cachen des Bildes:', url, error);
                });
            })
          );
        });
    }
  }
}); 