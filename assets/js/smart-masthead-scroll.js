/**
 * Smart Masthead Scroll
 * Version 1.0.0
 * 
 * Diese Komponente implementiert ein intelligentes Scroll-Verhalten für die Navigationsleiste (Masthead).
 * Wenn der Benutzer scrollt, wird die Navigationsleiste ein- oder ausgeblendet, und die Seite
 * scrollt nur um die Höhe der Navigationsleiste, um einen nahtlosen Übergang zu ermöglichen.
 */

(function() {
    'use strict';
    
    // Konfiguration
    const config = {
        scrollThreshold: 10,        // Mindestscroll-Distanz, um eine Aktion auszulösen
        animationDuration: 300,     // Dauer der Animation in Millisekunden
        debounceDelay: 50,          // Verzögerung für Debouncing in Millisekunden
        offsetTolerance: 5,         // Toleranz für Offset-Berechnungen in Pixeln
        enabled: true,              // Aktivieren/Deaktivieren der Komponente
        debug: true,                // Debug-Modus aktiviert für Fehlerdiagnose
        mastheadSelector: '.masthead', // Selektor für die Navigationsleiste
        visibleClass: 'masthead--visible', // Klasse für sichtbare Navigationsleiste
        hiddenClass: 'masthead--hidden'    // Klasse für ausgeblendete Navigationsleiste
    };
    
    // Variablen
    let lastScrollY = window.scrollY;
    let lastDirection = 0; // 1 = nach oben, -1 = nach unten, 0 = initial
    let isScrolling = false;
    let scrollTimeout = null;
    let mastheadHeight = 0;
    let mastheadElement = null;
    let isTransitioning = false;
    let transitionTimeout = null;
    let lastMastheadVisibility = true; // true = sichtbar, false = ausgeblendet
    let scrollAdjustmentInProgress = false;
    
    /**
     * Initialisiert die Komponente
     */
    function init() {
        try {
            // Navigationsleiste finden
            mastheadElement = document.querySelector(config.mastheadSelector);
            
            if (!mastheadElement) {
                console.error('Navigationsleiste nicht gefunden:', config.mastheadSelector);
                return;
            }
            
            // Höhe der Navigationsleiste ermitteln
            updateMastheadHeight();
            
            // Event-Listener hinzufügen
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleResize, { passive: true });
            
            // Transition-Ende überwachen
            mastheadElement.addEventListener('transitionend', handleTransitionEnd);
            
            // Initialen Zustand setzen
            lastMastheadVisibility = isMastheadVisible();
            
            if (config.debug) {
                console.log('Smart Masthead Scroll initialisiert:', {
                    mastheadHeight: mastheadHeight,
                    initialVisibility: lastMastheadVisibility
                });
            }
        } catch (error) {
            console.error('Fehler bei der Initialisierung von Smart Masthead Scroll:', error);
        }
    }
    
    /**
     * Aktualisiert die Höhe der Navigationsleiste
     */
    function updateMastheadHeight() {
        try {
            if (!mastheadElement) return;
            
            // Sicherstellen, dass die Navigationsleiste sichtbar ist, um die korrekte Höhe zu ermitteln
            const wasHidden = mastheadElement.classList.contains(config.hiddenClass);
            
            if (wasHidden) {
                mastheadElement.classList.remove(config.hiddenClass);
                mastheadElement.classList.add(config.visibleClass);
            }
            
            // Höhe ermitteln (inkl. Margin, Border, Padding)
            const styles = window.getComputedStyle(mastheadElement);
            const marginTop = parseFloat(styles.marginTop);
            const marginBottom = parseFloat(styles.marginBottom);
            
            mastheadHeight = Math.ceil(mastheadElement.offsetHeight + marginTop + marginBottom);
            
            // Ursprünglichen Zustand wiederherstellen
            if (wasHidden) {
                mastheadElement.classList.add(config.hiddenClass);
                mastheadElement.classList.remove(config.visibleClass);
            }
            
            if (config.debug) {
                console.log('Masthead-Höhe aktualisiert:', mastheadHeight);
            }
        } catch (error) {
            console.error('Fehler bei der Aktualisierung der Masthead-Höhe:', error);
        }
    }
    
    /**
     * Prüft, ob die Navigationsleiste sichtbar ist
     */
    function isMastheadVisible() {
        return mastheadElement && 
               mastheadElement.classList.contains(config.visibleClass) && 
               !mastheadElement.classList.contains(config.hiddenClass);
    }
    
    /**
     * Behandelt das Ende einer Transition
     */
    function handleTransitionEnd(event) {
        try {
            if (event.target !== mastheadElement) return;
            
            isTransitioning = false;
            
            if (config.debug) {
                console.log('Masthead-Transition abgeschlossen');
            }
            
            // Timeout löschen
            clearTimeout(transitionTimeout);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des TransitionEnd-Events:', error);
        }
    }
    
    /**
     * Behandelt Scroll-Events
     */
    function handleScroll() {
        try {
            if (!config.enabled || isScrolling || scrollAdjustmentInProgress) return;
            
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;
            
            // Zu kleine Scroll-Bewegungen ignorieren
            if (Math.abs(scrollDelta) < config.scrollThreshold) return;
            
            // Scroll-Richtung bestimmen
            const currentDirection = scrollDelta > 0 ? -1 : 1; // -1 = nach unten, 1 = nach oben
            
            // Wenn sich die Richtung geändert hat oder es der erste Scroll ist
            if (currentDirection !== lastDirection) {
                // Aktuelle Sichtbarkeit der Navigationsleiste prüfen
                const isVisible = isMastheadVisible();
                
                // Wenn sich die Sichtbarkeit ändern soll
                if ((currentDirection === -1 && isVisible) || (currentDirection === 1 && !isVisible)) {
                    // Scroll-Anpassung durchführen
                    adjustScrollPosition(currentDirection, isVisible);
                }
                
                lastDirection = currentDirection;
            }
            
            lastScrollY = currentScrollY;
            
            // Timeout für das Ende des Scrollens setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                if (config.debug) {
                    console.log('Scroll beendet');
                }
            }, config.debounceDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Scroll-Events:', error);
        }
    }
    
    /**
     * Passt die Scroll-Position an, wenn die Navigationsleiste ein- oder ausgeblendet wird
     */
    function adjustScrollPosition(direction, isVisible) {
        try {
            if (isTransitioning || scrollAdjustmentInProgress) return;
            
            // Verhindern, dass während der Anpassung weitere Scroll-Events verarbeitet werden
            scrollAdjustmentInProgress = true;
            
            // Sicherstellen, dass die Masthead-Höhe aktuell ist
            updateMastheadHeight();
            
            if (config.debug) {
                console.log('Scroll-Anpassung:', {
                    direction: direction === 1 ? 'nach oben' : 'nach unten',
                    mastheadVisible: isVisible,
                    mastheadHeight: mastheadHeight
                });
            }
            
            // Navigationsleiste ein- oder ausblenden
            if (direction === -1 && isVisible) {
                // Nach unten scrollen -> Navigationsleiste ausblenden
                mastheadElement.classList.remove(config.visibleClass);
                mastheadElement.classList.add(config.hiddenClass);
                
                // Seite um die Höhe der Navigationsleiste nach unten verschieben
                smoothScrollBy(mastheadHeight);
            } else if (direction === 1 && !isVisible) {
                // Nach oben scrollen -> Navigationsleiste einblenden
                mastheadElement.classList.add(config.visibleClass);
                mastheadElement.classList.remove(config.hiddenClass);
                
                // Seite um die Höhe der Navigationsleiste nach oben verschieben
                smoothScrollBy(-mastheadHeight);
            }
            
            // Transition-Status setzen
            isTransitioning = true;
            lastMastheadVisibility = !isVisible;
            
            // Sicherheits-Timeout für den Fall, dass das TransitionEnd-Event nicht ausgelöst wird
            clearTimeout(transitionTimeout);
            transitionTimeout = setTimeout(function() {
                isTransitioning = false;
                scrollAdjustmentInProgress = false;
                
                if (config.debug) {
                    console.log('Transition-Timeout abgelaufen');
                }
            }, config.animationDuration + 100);
            
            // Nach der Animation den scrollAdjustmentInProgress-Status zurücksetzen
            setTimeout(function() {
                scrollAdjustmentInProgress = false;
                
                if (config.debug) {
                    console.log('Scroll-Anpassung abgeschlossen');
                }
            }, config.animationDuration);
        } catch (error) {
            console.error('Fehler bei der Anpassung der Scroll-Position:', error);
            scrollAdjustmentInProgress = false;
        }
    }
    
    /**
     * Führt einen sanften Scroll um eine bestimmte Distanz durch
     */
    function smoothScrollBy(distance) {
        try {
            if (Math.abs(distance) < config.offsetTolerance) return;
            
            const startY = window.scrollY;
            const targetY = startY + distance;
            const startTime = performance.now();
            
            isScrolling = true;
            
            function scrollStep(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / config.animationDuration, 1);
                
                // Kubische Easing-Funktion für natürlicheres Scrollen
                const easeProgress = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startY + distance * easeProgress);
                
                if (timeElapsed < config.animationDuration) {
                    window.requestAnimationFrame(scrollStep);
                } else {
                    // Sicherstellen, dass die exakte Zielposition erreicht wird
                    window.scrollTo(0, targetY);
                    isScrolling = false;
                    
                    if (config.debug) {
                        console.log('Smooth Scroll abgeschlossen:', {
                            von: startY,
                            nach: targetY,
                            distanz: distance
                        });
                    }
                }
            }
            
            window.requestAnimationFrame(scrollStep);
        } catch (error) {
            console.error('Fehler beim sanften Scrollen:', error);
            isScrolling = false;
        }
    }
    
    /**
     * Behandelt Resize-Events
     */
    function handleResize() {
        try {
            // Höhe der Navigationsleiste aktualisieren
            updateMastheadHeight();
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Resize-Events:', error);
        }
    }
    
    /**
     * Öffentliche API
     */
    window.smartMastheadScroll = {
        // Konfiguration aktualisieren
        updateConfig: function(newConfig) {
            try {
                Object.assign(config, newConfig);
                return config;
            } catch (error) {
                console.error('Fehler beim Aktualisieren der Konfiguration:', error);
                return config;
            }
        },
        
        // Aktuelle Konfiguration abrufen
        getConfig: function() {
            return Object.assign({}, config);
        },
        
        // Komponente aktivieren
        enable: function() {
            config.enabled = true;
        },
        
        // Komponente deaktivieren
        disable: function() {
            config.enabled = false;
        },
        
        // Masthead-Höhe aktualisieren
        updateMastheadHeight: function() {
            updateMastheadHeight();
            return mastheadHeight;
        },
        
        // Masthead-Höhe abrufen
        getMastheadHeight: function() {
            return mastheadHeight;
        }
    };
    
    // Komponente initialisieren, wenn das Dokument geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 