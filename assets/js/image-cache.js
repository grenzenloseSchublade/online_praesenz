/**
 * Image Caching Script
 * 
 * Dieses Skript implementiert effizientes Caching für Hintergrundbilder
 * und andere wichtige Ressourcen auf der Website.
 */

(function() {
  'use strict';
  
  // Konfiguration aus dem HTML-Dokument auslesen
  const config = {
    enableImageCaching: document.documentElement.getAttribute('data-enable-image-caching') === 'true',
    backgroundImage: document.documentElement.getAttribute('data-background-image') || null
  };
  
  /**
   * Bild vorladen und im Cache speichern
   * @param {string} url - Die URL des zu ladenden Bildes
   * @return {Promise} Ein Promise, das erfüllt wird, wenn das Bild geladen ist
   */
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Fehler beim Laden des Bildes: ${url}`));
      img.src = url;
    });
  }
  
  /**
   * Hintergrundbilder auf Elemente anwenden
   * @param {NodeList} elements - Die Elemente, auf die Hintergrundbilder angewendet werden sollen
   */
  function applyBackgroundImages(elements) {
    elements.forEach(element => {
      const imageUrl = extractImageUrl(element);
      if (imageUrl) {
        preloadImage(imageUrl)
          .then(() => {
            // Overlay-Filter anwenden, falls vorhanden
            const overlayFilter = element.getAttribute('data-overlay-filter');
            if (overlayFilter) {
              element.style.backgroundImage = `${overlayFilter}, url('${imageUrl}')`;
            } else {
              element.style.backgroundImage = `url('${imageUrl}')`;
            }
            element.classList.add('loaded');
            console.log(`Hintergrundbild geladen: ${imageUrl}`);
          })
          .catch(error => {
            console.error(error);
            // Fallback-Hintergrund anwenden, wenn das Bild nicht geladen werden kann
            element.style.backgroundColor = '#1a1a1a';
          });
      }
    });
  }
  
  /**
   * Bild-URL aus dem data-background-image-Attribut extrahieren
   * @param {Element} element - Das Element, aus dem die URL extrahiert werden soll
   * @return {string|null} Die extrahierte URL oder null
   */
  function extractImageUrl(element) {
    return element.getAttribute('data-background-image');
  }
  
  /**
   * Hintergrundbilder cachen
   */
  function cacheBackgroundImages() {
    // Alle Elemente mit data-background-image-Attribut finden
    const heroElements = document.querySelectorAll('.page__hero--overlay[data-background-image]');
    
    if (heroElements.length > 0) {
      console.log(`${heroElements.length} Hintergrundbilder gefunden zum Cachen`);
      applyBackgroundImages(heroElements);
    }
    
    // Globales Hintergrundbild aus der Konfiguration cachen, falls vorhanden
    if (config.backgroundImage) {
      preloadImage(config.backgroundImage)
        .then(() => console.log(`Globales Hintergrundbild gecached: ${config.backgroundImage}`))
        .catch(error => console.error(error));
    }
  }
  
  // Wenn das DOM geladen ist, Hintergrundbilder cachen
  document.addEventListener('DOMContentLoaded', () => {
    // Konfiguration aus dem HTML-Dokument aktualisieren
    config.enableImageCaching = document.documentElement.getAttribute('data-enable-image-caching') === 'true';
    config.backgroundImage = document.documentElement.getAttribute('data-background-image');
    
    // Nur ausführen, wenn Image-Caching aktiviert ist
    if (config.enableImageCaching !== false) {
      cacheBackgroundImages();
    }
  });
  
  // Service Worker-Kommunikation für Bild-Caching
  if ('serviceWorker' in navigator && window.caches) {
    // Nachricht an den Service Worker senden, um Bilder zu cachen
    setTimeout(() => {
      if (navigator.serviceWorker.controller) {
        // Alle Bild-URLs sammeln
        const imageUrls = Array.from(document.querySelectorAll('[data-background-image]'))
          .map(el => el.getAttribute('data-background-image'))
          .filter(Boolean);
        
        // Globales Hintergrundbild hinzufügen, falls vorhanden
        if (config.backgroundImage) {
          imageUrls.push(config.backgroundImage);
        }
        
        // Nachricht an Service Worker senden
        if (imageUrls.length > 0) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_IMAGES',
            images: imageUrls
          });
        }
      }
    }, 1000);
  }
})(); 