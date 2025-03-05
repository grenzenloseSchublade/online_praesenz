/**
 * Service Worker Registration Script
 * 
 * Dieses Skript registriert den Service Worker, der für das Caching von Ressourcen
 * und die Offline-Funktionalität der Website verantwortlich ist.
 */

(function() {
  'use strict';
  
  // Konfiguration aus dem HTML-Dokument auslesen
  const config = {
    enableServiceWorker: document.documentElement.getAttribute('data-enable-service-worker') === 'true'
  };
  
  /**
   * Service Worker registrieren
   */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Warten, bis die Seite geladen ist
      window.addEventListener('load', () => {
        // Nur registrieren, wenn Service Worker aktiviert ist
        if (config.enableServiceWorker !== false) {
          // Basis-URL der Website ermitteln
          const baseUrl = document.querySelector('base')?.href || window.location.origin;
          
          // Service Worker-Pfad relativ zur Basis-URL
          const swPath = baseUrl.endsWith('/') 
            ? baseUrl + 'service-worker.js' 
            : baseUrl + '/service-worker.js';
          
          navigator.serviceWorker.register(swPath)
            .then(registration => {
              console.log('ServiceWorker erfolgreich registriert mit Scope:', registration.scope);
              
              // Auf Updates prüfen
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Neuer Service Worker ist installiert, aber noch nicht aktiv
                    console.log('Neuer Service Worker installiert, Seite neu laden für Updates');
                    
                    // Benutzer über Update informieren
                    if (confirm('Es sind Updates verfügbar. Seite jetzt neu laden?')) {
                      window.location.reload();
                    }
                  }
                });
              });
            })
            .catch(error => {
              console.error('ServiceWorker-Registrierung fehlgeschlagen:', error);
            });
          
          // Auf Nachrichten vom Service Worker hören
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'CACHE_COMPLETE') {
              console.log('Caching abgeschlossen:', event.data.url);
            }
          });
          
          // Nach kurzer Verzögerung Hintergrundbilder cachen
          setTimeout(() => {
            if (navigator.serviceWorker.controller) {
              // Alle Hintergrundbilder sammeln
              const backgroundImages = Array.from(document.querySelectorAll('[data-background-image]'))
                .map(el => el.getAttribute('data-background-image'))
                .filter(Boolean);
              
              // Globales Hintergrundbild hinzufügen, falls vorhanden
              const globalBackgroundImage = document.documentElement.getAttribute('data-background-image');
              if (globalBackgroundImage) {
                backgroundImages.push(globalBackgroundImage);
              }
              
              // Nachricht an Service Worker senden
              if (backgroundImages.length > 0) {
                navigator.serviceWorker.controller.postMessage({
                  type: 'CACHE_IMAGES',
                  images: backgroundImages
                });
              }
            }
          }, 2000);
        }
      });
    }
  }
  
  // Service Worker registrieren
  registerServiceWorker();
})(); 