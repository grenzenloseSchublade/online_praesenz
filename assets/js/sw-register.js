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
   * Zeigt ein visuelles Update-Toast statt eines blockierenden confirm()
   */
  function showUpdateToast() {
    // Prüfe ob Toast bereits existiert
    if (document.getElementById('sw-update-toast')) return;
    
    // Erstelle Toast-Element
    const toast = document.createElement('div');
    toast.id = 'sw-update-toast';
    toast.innerHTML = `
      <span>🔄 Neue Version verfügbar!</span>
      <button id="sw-update-reload">Jetzt laden</button>
      <button id="sw-update-dismiss" aria-label="Schließen">×</button>
    `;
    
    // Inline-Styles für Toast (kein externes CSS nötig)
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 10px rgba(5, 217, 232, 0.3);
      border: 1px solid rgba(5, 217, 232, 0.4);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      animation: slideUp 0.3s ease-out;
    `;
    
    // Styles für Buttons
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      #sw-update-reload {
        background: linear-gradient(135deg, #05d9e8 0%, #ff00cc 100%);
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #sw-update-reload:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(5, 217, 232, 0.5);
      }
      #sw-update-dismiss {
        background: transparent;
        color: #888;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
        transition: color 0.2s;
      }
      #sw-update-dismiss:hover { color: #fff; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // Event-Listener
    document.getElementById('sw-update-reload').addEventListener('click', () => {
      window.location.reload();
    });
    
    document.getElementById('sw-update-dismiss').addEventListener('click', () => {
      toast.style.animation = 'slideUp 0.2s ease-in reverse';
      setTimeout(() => toast.remove(), 200);
    });
  }
  
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
              // Auf Updates prüfen
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Neuer Service Worker ist installiert - zeige Update-Toast
                    showUpdateToast();
                  }
                });
              });
            })
            .catch(error => {
              console.error('ServiceWorker-Registrierung fehlgeschlagen:', error);
            });
          
          // Auf Nachrichten vom Service Worker hören
          navigator.serviceWorker.addEventListener('message', event => {
            // Cache-Events werden still behandelt
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