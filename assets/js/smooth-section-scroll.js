/**
 * Smooth Section Scrolling
 * 
 * Dieses Script ermöglicht ein optimiertes Scroll-Erlebnis, bei dem
 * ein Scroll-Schritt immer zu einem sinnvollen Abschnitt führt.
 * 
 * Version: 1.1.0
 * Autor: Hans Müller
 */

// Initialisierungsfunktion, die das Smooth Scrolling einrichtet
function initSmoothScroll() {
  // ======================================================================
  // KONFIGURATION - Hier können alle Einstellungen angepasst werden
  // ======================================================================
  
  // Debug-Modus: auf false setzen für Produktionsumgebung
  const DEBUG = false;
  
  // Hauptkonfiguration
  const config = {
    // ======== SCROLL-VERHALTEN EINSTELLUNGEN ========
    
    /**
     * Scroll-Geschwindigkeit in Millisekunden
     * Höhere Werte = langsameres Scrollen
     * Empfohlene Werte: 300-800
     */
    scrollDuration: 300,
    
    /**
     * Verzögerung nach Scroll-Event in Millisekunden
     * Niedrigere Werte = schnellere Reaktion, aber möglicherweise unbeabsichtigte Scrolls
     * Empfohlene Werte: 5-20
     */
    scrollDelay: 5,
    
    /**
     * Mindestabstand zwischen Scrolls in Millisekunden
     * Verhindert zu schnelles Scrollen hintereinander
     * Empfohlene Werte: 150-300
     */
    minScrollInterval: 200,
    
    /**
     * Offset für das Scrollen (in Pixel)
     * Nützlich für fixierte Header - sollte der Höhe des Headers entsprechen
     * Empfohlene Werte: 0-100 je nach Header-Größe
     */
    scrollOffset: 0,
    
    /**
     * Toleranz für die Erkennung des aktuellen Abschnitts (in Pixel)
     * Höhere Werte = großzügigere Erkennung des aktuellen Abschnitts
     * Empfohlene Werte: 20-50
     */
    scrollTolerance: 30,
    
    /**
     * Mindesthöhe für Abschnitte (in Pixel)
     * Elemente kleiner als dieser Wert werden ignoriert
     * Empfohlene Werte: 20-50
     */
    minSectionHeight: 30,
    
    // ======== ALLGEMEINE EINSTELLUNGEN ========
    
    /**
     * Aktivieren/Deaktivieren des Smooth Scrollings
     * Auf false setzen, um das Feature komplett zu deaktivieren
     */
    enabled: true,
    
    // ======== SELEKTOREN FÜR ABSCHNITTE ========
    
    /**
     * Hauptabschnitte der Seite (CSS-Selektoren)
     * Hier können Selektoren hinzugefügt/entfernt werden, um das Scrollverhalten anzupassen
     * Reihenfolge ist nicht wichtig, da die Elemente nach Position sortiert werden
     */
    sections: [
      '.page__hero--overlay',  // Header
      '.page__header',         // Alternativer Header
    //   'h1',                    // H1-Überschriften
      'h2',                    // H2-Überschriften
      'h3',                    // H3-Überschriften
      '.page__content > h1',   // H1 im Hauptinhalt
      '.page__content > h2',   // H2 im Hauptinhalt
      '.page__content > h3',   // H3 im Hauptinhalt
      '.page__content > .notice', // Alle Notice-Boxen
      '.page__content > .notice--info', // Info-Boxen 
      '.page__content > .notice--warning', // Warn-Boxen
      '.page__content > .notice--success', // Erfolgs-Boxen
      '.page__content > .feature-box', // Feature-Boxen
      '.page__content > .archive',     // Archiv-Listen
      '.page__content > figure',       // Bilder und Figuren
      '.page__content > table',        // Tabellen
      '.page__content > pre',          // Code-Blöcke
      'footer.page__footer'            // Footer
    ],
    
    /**
     * Elemente, bei denen das Smooth Scrolling deaktiviert werden soll
     * Nützlich für interaktive Elemente, bei denen normales Scrollen benötigt wird
     */
    excludeSelectors: [
      '.map-container',        // Karten
      '.code-editor',          // Code-Editoren
      'form',                  // Formulare
      'input',                 // Eingabefelder
      'textarea',              // Textbereiche
      'select',                // Auswahlfelder
      '.no-smooth-scroll'      // Benutzerdefinierte Ausnahmen
    ]
  };

  // ======================================================================
  // AB HIER KEINE ÄNDERUNGEN VORNEHMEN, AUSSER SIE WISSEN WAS SIE TUN
  // ======================================================================
  
  // Hilfsfunktion für Debug-Ausgaben
  function debug(message, data) {
    if (DEBUG) {
      console.log(`[SmoothScroll] ${message}`, data || '');
    }
  }
  
  debug('Script geladen');
  
  // Variablen
  let sections = [];
  let isScrolling = false;
  let lastScrollTime = 0;
  let scrollTimeout;
  let isEnabled = config.enabled;
  let lastWheelDirection = 0;
  let consecutiveWheelEvents = 0;

  // Prüfen, ob ein Element in der Ausschlussliste ist
  function isExcluded(element) {
    // Prüfen, ob das Element oder eines seiner Elternelemente ausgeschlossen ist
    let currentElement = element;
    while (currentElement) {
      for (const selector of config.excludeSelectors) {
        if (currentElement.matches && currentElement.matches(selector)) {
          debug('Element ausgeschlossen', currentElement);
          return true;
        }
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }

  // Alle Abschnitte sammeln
  function collectSections() {
    debug('Sammle Abschnitte...');
    sections = [];
    
    // Header als ersten Abschnitt hinzufügen, wenn vorhanden
    const header = document.querySelector('.page__hero--overlay') || document.querySelector('.page__header');
    if (header) {
      sections.push({
        element: header,
        top: 0,
        height: header.offsetHeight,
        type: 'header'
      });
      debug('Header hinzugefügt', header);
    }
    
    // Alle konfigurierten Selektoren durchgehen
    config.sections.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        debug(`Gefundene Elemente für "${selector}":`, elements.length);
        
        elements.forEach(element => {
          // Nur sichtbare Elemente mit Inhalt hinzufügen, die nicht ausgeschlossen sind
          if (element.offsetParent !== null && 
              element.offsetHeight > config.minSectionHeight && 
              !isExcluded(element)) {
            
            const rect = element.getBoundingClientRect();
            const top = rect.top + window.pageYOffset;
            
            sections.push({
              element: element,
              top: top,
              height: rect.height,
              type: element.tagName.toLowerCase() || 'unknown',
              selector: selector
            });
            
            debug(`Element hinzugefügt: ${element.tagName} (${selector})`, { 
              top: top, 
              height: rect.height,
              text: element.textContent ? element.textContent.substring(0, 30) + '...' : 'kein Text'
            });
          }
        });
      } catch (error) {
        console.error(`Fehler beim Verarbeiten des Selektors "${selector}":`, error);
      }
    });
    
    // Nach Position sortieren
    sections.sort((a, b) => a.top - b.top);
    
    // Duplikate entfernen (Elemente mit sehr ähnlicher Position)
    sections = sections.filter((section, index, self) => 
      index === 0 || Math.abs(section.top - self[index - 1].top) > 10
    );
    
    // Footer als letzten Abschnitt hinzufügen, wenn vorhanden
    const footer = document.querySelector('footer.page__footer');
    if (footer) {
      const footerTop = Math.max(
        document.body.scrollHeight - window.innerHeight,
        footer.getBoundingClientRect().top + window.pageYOffset - 100
      );
      
      sections.push({
        element: footer,
        top: footerTop,
        height: footer.offsetHeight,
        type: 'footer'
      });
      
      debug('Footer hinzugefügt', { top: footerTop, height: footer.offsetHeight });
    }
    
    // Konsistenzprüfung
    if (sections.length === 0) {
      console.warn('Smooth Section Scroll: Keine Abschnitte gefunden.');
      isEnabled = false;
    } else {
      isEnabled = config.enabled;
      debug(`Insgesamt ${sections.length} Abschnitte gefunden`);
      
      if (DEBUG) {
        // Visuelle Markierung der Abschnitte im Debug-Modus
        // Zuerst alte Marker entfernen
        document.querySelectorAll('.smooth-scroll-marker').forEach(marker => marker.remove());
        
        // Neue Marker hinzufügen
        sections.forEach((section, index) => {
          const marker = document.createElement('div');
          marker.className = 'smooth-scroll-marker';
          marker.style.position = 'absolute';
          marker.style.left = '0';
          marker.style.width = '10px';
          marker.style.height = '10px';
          marker.style.backgroundColor = 'red';
          marker.style.zIndex = '9999';
          marker.style.top = `${section.top}px`;
          marker.title = `Abschnitt ${index}: ${section.type} (${section.top}px)`;
          document.body.appendChild(marker);
        });
      }
    }
  }

  // Aktuellen Abschnitt basierend auf der Scroll-Position finden
  function getCurrentSection() {
    const currentPosition = window.pageYOffset;
    let currentSection = null;
    
    // Abschnitt finden, der am nächsten zur aktuellen Position ist
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].top <= currentPosition + config.scrollTolerance) {
        currentSection = sections[i];
        
        // Wenn der nächste Abschnitt näher ist, diesen nehmen
        if (i < sections.length - 1 && 
            Math.abs(sections[i+1].top - currentPosition) < Math.abs(sections[i].top - currentPosition)) {
          currentSection = sections[i+1];
        }
      } else {
        break;
      }
    }
    
    return currentSection;
  }

  // Zum nächsten/vorherigen Abschnitt scrollen
  function scrollToSection(direction) {
    if (isScrolling || !isEnabled) {
      debug('Scrolling übersprungen: bereits scrollend oder deaktiviert');
      return;
    }
    
    const currentPosition = window.pageYOffset;
    debug('Aktuelle Position', currentPosition);
    
    let targetSection = null;
    
    if (direction > 0) {
      // Abwärts scrollen - zum nächsten Abschnitt
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].top > currentPosition + config.scrollTolerance) {
          targetSection = sections[i];
          debug('Nächster Abschnitt gefunden', { 
            index: i, 
            type: targetSection.type, 
            top: targetSection.top 
          });
          break;
        }
      }
      
      // Wenn kein Ziel gefunden wurde und wir nicht am Ende sind, zum Ende scrollen
      if (!targetSection && currentPosition < document.body.scrollHeight - window.innerHeight) {
        targetSection = {
          top: document.body.scrollHeight - window.innerHeight,
          type: 'end'
        };
        debug('Kein nächster Abschnitt gefunden, scrolle zum Ende');
      }
    } else {
      // Aufwärts scrollen - zum vorherigen Abschnitt
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].top < currentPosition - config.scrollTolerance) {
          targetSection = sections[i];
          debug('Vorheriger Abschnitt gefunden', { 
            index: i, 
            type: targetSection.type, 
            top: targetSection.top 
          });
          break;
        }
      }
      
      // Wenn kein Ziel gefunden wurde und wir nicht am Anfang sind, zum Anfang scrollen
      if (!targetSection && currentPosition > 0) {
        targetSection = {
          top: 0,
          type: 'start'
        };
        debug('Kein vorheriger Abschnitt gefunden, scrolle zum Anfang');
      }
    }
    
    // Wenn ein Zielabschnitt gefunden wurde, dorthin scrollen
    if (targetSection) {
      isScrolling = true;
      
      // Zielposition mit Offset anpassen
      const targetPosition = targetSection.top - config.scrollOffset;
      
      debug('Scrolle zu Position', targetPosition);
      
      // Sanftes Scrollen mit Animation
      smoothScrollTo(targetPosition, config.scrollDuration, function() {
        isScrolling = false;
        debug('Scrolling abgeschlossen');
      });
    } else {
      debug('Kein Zielabschnitt gefunden');
    }
  }

  // Hilfsfunktion für sanftes Scrollen mit Animation
  function smoothScrollTo(targetY, duration, callback) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    
    debug('Smooth Scroll', { von: startY, nach: targetY, distanz: distance });
    
    // Wenn die Distanz sehr klein ist, sofort scrollen
    if (Math.abs(distance) < 10) {
      window.scrollTo(0, targetY);
      if (callback) callback();
      debug('Distanz zu klein, sofort gescrollt');
      return;
    }
    
    const startTime = performance.now();
    
    function step(currentTime) {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        // Easing-Funktion für sanfte Beschleunigung/Abbremsung
        const progress = easeInOutCubic(elapsedTime / duration);
        const currentY = startY + distance * progress;
        
        window.scrollTo({
          top: currentY,
          behavior: 'auto' // Wir steuern die Animation selbst
        });
        
        requestAnimationFrame(step);
      } else {
        window.scrollTo({
          top: targetY,
          behavior: 'auto'
        });
        
        if (callback) callback();
      }
    }
    
    // Easing-Funktion für natürlichere Bewegung
    function easeInOutCubic(t) {
      return t < 0.5 
        ? 4 * t * t * t 
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    requestAnimationFrame(step);
  }

  // Event-Handler für Mausrad-Scrollen
  function handleWheel(event) {
    // Wenn deaktiviert, nichts tun
    if (!isEnabled) {
      return;
    }
    
    // Prüfen, ob das Event-Ziel ausgeschlossen ist
    if (isExcluded(event.target)) {
      return;
    }
    
    // Prüfen, ob genug Zeit seit dem letzten Scroll vergangen ist
    const now = performance.now();
    if (now - lastScrollTime < config.minScrollInterval) {
      event.preventDefault();
      return;
    }
    
    // Scroll-Richtung bestimmen (positiv = runter, negativ = hoch)
    const direction = Math.sign(event.deltaY);
    
    // Konsistente Richtung prüfen
    if (direction === lastWheelDirection) {
      consecutiveWheelEvents++;
    } else {
      consecutiveWheelEvents = 1;
      lastWheelDirection = direction;
    }
    
    // Nur bei konsistenter Richtung und ausreichender Stärke reagieren
    if (consecutiveWheelEvents >= 1 && Math.abs(event.deltaY) > 10) {
      // Standard-Scroll-Verhalten verhindern
      event.preventDefault();
      
      debug('Wheel Event', { 
        deltaY: event.deltaY, 
        direction: direction, 
        consecutive: consecutiveWheelEvents 
      });
      
      // Scroll-Timeout löschen und neu setzen
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollToSection(direction);
        lastScrollTime = performance.now();
      }, config.scrollDelay);
    }
  }

  // Tastatur-Navigation (Pfeiltasten)
  function handleKeyDown(event) {
    // Wenn deaktiviert oder während eines Scrolls, nichts tun
    if (!isEnabled || isScrolling) return;
    
    // Prüfen, ob das aktive Element ausgeschlossen ist
    if (document.activeElement && isExcluded(document.activeElement)) return;
    
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      debug('Tastendruck: Nach unten');
      scrollToSection(1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      debug('Tastendruck: Nach oben');
      scrollToSection(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      debug('Tastendruck: Home');
      smoothScrollTo(0, config.scrollDuration, null);
    } else if (event.key === 'End') {
      event.preventDefault();
      debug('Tastendruck: End');
      smoothScrollTo(document.body.scrollHeight - window.innerHeight, config.scrollDuration, null);
    }
  }

  // Touch-Events für mobile Geräte
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;
  
  function handleTouchStart(event) {
    // Wenn deaktiviert, nichts tun
    if (!isEnabled) return;
    
    // Prüfen, ob das Event-Ziel ausgeschlossen ist
    if (isExcluded(event.target)) return;
    
    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
    touchStartTime = performance.now();
  }
  
  function handleTouchEnd(event) {
    // Wenn deaktiviert oder während eines Scrolls, nichts tun
    if (!isEnabled || isScrolling) return;
    
    // Prüfen, ob das Event-Ziel ausgeschlossen ist
    if (isExcluded(event.target)) return;
    
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    const touchDiffY = touchStartY - touchEndY;
    const touchDiffX = touchStartX - touchEndX;
    const touchDuration = performance.now() - touchStartTime;
    
    // Nur bei signifikanter vertikaler Bewegung reagieren, 
    // wenn die horizontale Bewegung kleiner ist und die Geste schnell genug war
    if (Math.abs(touchDiffY) > 50 && 
        Math.abs(touchDiffY) > Math.abs(touchDiffX) * 1.5 &&
        touchDuration < 300) {
      
      debug('Touch Swipe', { 
        diffY: touchDiffY, 
        diffX: touchDiffX, 
        duration: touchDuration 
      });
      
      const direction = Math.sign(touchDiffY);
      scrollToSection(direction);
    }
  }

  // Öffentliche API
  window.smoothSectionScroll = {
    // Aktivieren/Deaktivieren des Smooth Scrollings
    enable: function() {
      isEnabled = true;
      debug('Smooth Scrolling aktiviert');
    },
    disable: function() {
      isEnabled = false;
      debug('Smooth Scrolling deaktiviert');
    },
    // Manuelles Scrollen zu einem Abschnitt
    scrollTo: function(selector) {
      const element = document.querySelector(selector);
      if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(top - config.scrollOffset, config.scrollDuration, null);
        debug('Manuelles Scrollen zu', selector);
      }
    },
    // Abschnitte neu berechnen
    refresh: function() {
      collectSections();
      debug('Abschnitte neu berechnet');
    },
    // Debug-Informationen anzeigen
    debug: function() {
      console.log('Smooth Section Scroll Debug:');
      console.log('Aktiviert:', isEnabled);
      console.log('Abschnitte:', sections);
      console.log('Aktueller Abschnitt:', getCurrentSection());
      console.log('Scroll-Position:', window.pageYOffset);
    },
    // Konfiguration zur Laufzeit ändern
    updateConfig: function(newConfig) {
      // Konfiguration aktualisieren
      Object.assign(config, newConfig);
      debug('Konfiguration aktualisiert', config);
      // Abschnitte neu berechnen
      collectSections();
    }
  };

  // Initialisierung
  debug('Initialisiere Smooth Scrolling');
  
  // Sofort Abschnitte sammeln
  collectSections();
  
  // Event-Listener registrieren
  window.addEventListener('load', function() {
    debug('Seite vollständig geladen');
    collectSections();
  });
  
  window.addEventListener('resize', function() {
    debug('Fenstergröße geändert');
    // Verzögerung, um mehrere resize-Events zu vermeiden
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(collectSections, 200);
  });
  
  // Scroll-Events abfangen
  document.addEventListener('wheel', handleWheel, { passive: false });
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Bei Änderungen am DOM (z.B. durch AJAX) die Abschnitte neu berechnen
  // Verwendet MutationObserver, wenn verfügbar
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      // Nur bei relevanten Änderungen die Abschnitte neu berechnen
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Verzögerung, um sicherzustellen, dass der DOM vollständig aktualisiert ist
          clearTimeout(window.mutationTimeout);
          window.mutationTimeout = setTimeout(function() {
            debug('DOM-Änderung erkannt');
            collectSections();
          }, 200);
          break;
        }
      }
    });
    
    // Beobachte Änderungen am Hauptinhalt
    const contentContainer = document.querySelector('.page__content') || document.body;
    observer.observe(contentContainer, { childList: true, subtree: true });
    debug('MutationObserver gestartet');
  }
  
  // Statusmeldung
  debug('Smooth Section Scroll initialisiert');
}

// Script initialisieren, wenn das DOM bereit ist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  // Falls das DOM bereits geladen ist (z.B. wenn das Script am Ende der Seite geladen wird)
  initSmoothScroll();
} 