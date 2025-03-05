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
          // Bestimme den Pfad zum Root der Website
          const rootPath = getRootPath();
          
          // Service Worker-Pfad relativ zum Root der Website
          const swPath = rootPath + 'service-worker.js';
          
          // Registriere den Service Worker mit dem Scope des Root-Verzeichnisses
          navigator.serviceWorker.register(swPath, { scope: rootPath })
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
  
  /**
   * Bestimmt den Pfad zum Root der Website
   * Berücksichtigt die baseurl in Jekyll-Projekten
   */
  function getRootPath() {
    // Aktuelle URL
    const currentPath = window.location.pathname;
    
    // Bestimme den baseurl aus dem HTML-Element (falls vorhanden)
    const baseUrl = document.documentElement.getAttribute('data-baseurl') || '';
    
    if (baseUrl) {
      // Wenn baseurl gesetzt ist, verwende diesen als Präfix
      return baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    } else {
      // Ohne baseurl: Bestimme den Root-Pfad aus der aktuellen URL
      // Entferne alles nach dem letzten Slash in der URL
      const pathParts = currentPath.split('/');
      
      // Entferne den letzten Teil (Dateiname oder leerer String)
      pathParts.pop();
      
      // Füge einen Slash am Ende hinzu
      return pathParts.join('/') + '/';
    }
  }
  
  // Service Worker registrieren
  registerServiceWorker();
})(); 