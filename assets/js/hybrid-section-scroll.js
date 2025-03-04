/**
 * Hybrides Abschnitts-Scroll-System
 * Version 1.0.6
 * 
 * Dieses Skript implementiert ein hybrides Scrolling-System, das normales Scrollen 
 * innerhalb von Abschnitten ermöglicht und ein sanftes Einrasten an Abschnittsgrenzen bietet.
 * Es kombiniert die Vorteile von normalem Scrollen (Freiheit, Geschwindigkeit) mit den Vorteilen
 * von Abschnitts-basiertem Scrollen (Struktur, Übersichtlichkeit).
 * 
 * Das System kommuniziert mit der Navigationsleiste (Masthead), um ein konsistentes
 * Benutzererlebnis zu gewährleisten. Bei Scrolls nach unten wird die Navigationsleiste
 * ausgeblendet, bei Scrolls nach oben wird sie eingeblendet.
 */

(function() {
    'use strict';
    
    // Konfiguration
    const config = {
        scrollDuration: 400,       // Dauer des Scrollens in Millisekunden
        snapThreshold: 0.45,       // Schwellenwert für das Einrasten (in % der Viewport-Höhe)
        scrollDelay: 100,          // Verzögerung nach Scroll-Event in Millisekunden (reduziert von 150ms für schnelleres Einrasten, aber nicht zu schnell für falsche Snaps)
        minSnapInterval: 800,      // Mindestabstand zwischen Snap-Scrolls in Millisekunden
        scrollOffset: 0,           // Offset für das Scrollen (in Pixel)
        minSectionHeight: 30,      // Mindesthöhe für Abschnitte (in Pixel)
        speedThreshold: 30,        // Scroll-Geschwindigkeit-Schwellenwert
        resizeDelay: 200,          // Verzögerung für die Aktualisierung der Abschnitte bei Resize-Events
        enabled: true,             // Aktivieren/Deaktivieren des hybriden Scrollings
        debug: true,              // Debug-Modus aktiviert für Fehlerdiagnose
        
        // Selektoren für Abschnitte
        sections: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'section', 'article', 'header', 'footer',
            '.section', '.page__content > hr',
            '.page__content > table'
        ],
        
        // Selektoren für ausgeschlossene Elemente (innerhalb dieser Elemente wird das Einrasten deaktiviert)
        excludedElements: [
            'pre', 'code', 'textarea', 'input', 'select',
            '.code-block', '.highlight', '.toc', '.table-wrapper',
            '.excluded-from-snap'
        ]
    };
    
    // Variablen
    let sections = [];
    let lastScrollTime = 0;
    let lastSnapTime = 0;
    let isScrolling = false;
    let scrollTimeout = null;
    let resizeTimeout = null;
    let scrollStartY = 0;
    let scrollEndY = 0;
    let scrollVelocity = 0;
    let scrollDirection = 0;
    let lastScrollY = window.scrollY;
    let mutationObserver = null;
    
    /**
     * Initialisiert das hybride Scroll-System
     * Sammelt Abschnitte, setzt Event-Listener und initialisiert den MutationObserver
     */
    function init() {
        try {
            if (!config.enabled) return;
            
            collectSections();
            
            // Event-Listener für Scroll-Events
            window.addEventListener('scroll', handleScroll, { passive: true });
            
            // Event-Listener für Mausrad-Events
            window.addEventListener('wheel', handleWheel, { passive: true });
            
            // Event-Listener für Tastatur-Events
            window.addEventListener('keydown', handleKeyDown);
            
            // Event-Listener für Touch-Events
            window.addEventListener('touchstart', handleTouchStart, { passive: true });
            window.addEventListener('touchend', handleTouchEnd, { passive: true });
            
            // Event-Listener für Resize-Events
            window.addEventListener('resize', handleResize, { passive: true });
            
            // Event-Listener für Klicks auf Links
            document.addEventListener('click', handleLinkClick);
            
            // MutationObserver für dynamische Inhalte
            setupMutationObserver();
            
            if (config.debug) {
                console.log('Hybrides Scroll-System initialisiert');
                console.log('Gefundene Abschnitte:', sections.length);
            }
        } catch (error) {
            console.error('Fehler bei der Initialisierung des hybriden Scroll-Systems:', error);
        }
    }
    
    /**
     * Sammelt alle Abschnitte auf der Seite
     * Filtert Abschnitte nach Mindesthöhe und Position
     */
    function collectSections() {
        try {
            sections = [];
            
            // Selektoren für Abschnitte kombinieren
            const selectorString = config.sections.join(', ');
            
            if (config.debug) {
                console.log('Suche nach Abschnitten mit Selektoren:', selectorString);
            }
            
            // Alle Elemente sammeln, die den Selektoren entsprechen
            const elements = document.querySelectorAll(selectorString);
            
            if (config.debug) {
                console.log('Gefundene Elemente vor Filterung:', elements.length);
            }
            
            // Elemente filtern und in das sections-Array einfügen
            Array.from(elements).forEach(element => {
                const rect = element.getBoundingClientRect();
                
                // Nur Elemente mit ausreichender Höhe und sichtbarer Position hinzufügen
                if (rect.height >= config.minSectionHeight && !isExcluded(element)) {
                    sections.push({
                        element: element,
                        top: rect.top + window.scrollY,
                        bottom: rect.bottom + window.scrollY,
                        height: rect.height,
                        tagName: element.tagName.toLowerCase()
                    });
                } else if (config.debug) {
                    if (rect.height < config.minSectionHeight) {
                        console.log('Element ausgeschlossen (zu klein):', element.tagName, element.textContent.substring(0, 30));
                    } else if (isExcluded(element)) {
                        console.log('Element ausgeschlossen (in excludedElements):', element.tagName, element.textContent.substring(0, 30));
                    }
                }
            });
            
            // Abschnitte nach Position sortieren
            sections.sort((a, b) => a.top - b.top);
            
            if (config.debug) {
                console.log('Abschnitte nach Filterung:', sections.length);
                if (sections.length > 0) {
                    console.log('Erster Abschnitt:', {
                        tagName: sections[0].tagName,
                        top: sections[0].top,
                        text: sections[0].element.textContent.substring(0, 30)
                    });
                    console.log('Letzter Abschnitt:', {
                        tagName: sections[sections.length - 1].tagName,
                        top: sections[sections.length - 1].top,
                        text: sections[sections.length - 1].element.textContent.substring(0, 30)
                    });
                }
            }
        } catch (error) {
            console.error('Fehler beim Sammeln der Abschnitte:', error);
        }
    }
    
    /**
     * Prüft, ob ein Element von der Snap-Funktion ausgeschlossen ist
     * @param {HTMLElement} element - Das zu prüfende Element
     * @returns {boolean} - True, wenn das Element ausgeschlossen ist, sonst false
     */
    function isExcluded(element) {
        try {
            // Prüfen, ob das Element selbst ausgeschlossen ist
            for (const selector of config.excludedElements) {
                try {
                    if (element.matches(selector)) {
                        return true;
                    }
                } catch (selectorError) {
                    if (config.debug) {
                        console.warn('Ungültiger Selektor in excludedElements:', selector, selectorError);
                    }
                }
            }
            
            // Prüfen, ob das Element innerhalb eines ausgeschlossenen Elements liegt
            let parent = element.parentElement;
            while (parent) {
                for (const selector of config.excludedElements) {
                    try {
                        if (parent.matches(selector)) {
                            return true;
                        }
                    } catch (selectorError) {
                        if (config.debug) {
                            console.warn('Ungültiger Selektor in excludedElements:', selector, selectorError);
                        }
                    }
                }
                parent = parent.parentElement;
            }
            
            return false;
        } catch (error) {
            console.error('Fehler bei der Prüfung auf ausgeschlossene Elemente:', error);
            return false;
        }
    }
    
    /**
     * Bestimmt den nächsten Abschnitt basierend auf der aktuellen Scroll-Position
     * @returns {Object|null} - Der nächste Abschnitt oder null, wenn kein Abschnitt gefunden wurde
     */
    function getNearestSection() {
        try {
            if (sections.length === 0) return null;
            
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const viewportMiddle = scrollY + viewportHeight / 2;
            
            let nearestSection = null;
            let minDistance = Infinity;
            
            // Für jeden Abschnitt die Distanz zum Viewport-Mittelpunkt berechnen
            for (const section of sections) {
                const sectionMiddle = (section.top + section.bottom) / 2;
                const distance = Math.abs(sectionMiddle - viewportMiddle);
                
                // Wenn dieser Abschnitt näher ist als der bisher nächste, aktualisieren
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSection = section;
                }
            }
            
            return nearestSection;
        } catch (error) {
            console.error('Fehler bei der Bestimmung des nächsten Abschnitts:', error);
            return null;
        }
    }
    
    /**
     * Prüft, ob ein Abschnitt in der Nähe ist und ob zu diesem gescrollt werden sollte
     * @param {Object} section - Der zu prüfende Abschnitt
     * @returns {boolean} - True, wenn zu diesem Abschnitt gescrollt werden sollte, sonst false
     */
    function isNearSection(section) {
        try {
            if (!section) return false;
            
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            
            // Schwellenwert für das Einrasten (in Pixel)
            let threshold = viewportHeight * config.snapThreshold;
            
            // Für Überschriften einen größeren Schwellenwert verwenden
            if (section.tagName === 'h1' || section.tagName === 'h2' || section.tagName === 'h3') {
                threshold *= 1.5;
            }
            
            // Prüfen, ob der Abschnitt innerhalb des Schwellenwerts liegt
            const sectionTop = section.top;
            const distanceToTop = Math.abs(scrollY - sectionTop + config.scrollOffset);
            
            const isNear = distanceToTop <= threshold;
            
            if (config.debug) {
                console.log('Nähe zu Abschnitt prüfen:', {
                    tagName: section.tagName,
                    sectionTop: sectionTop,
                    scrollY: scrollY,
                    distanceToTop: distanceToTop,
                    threshold: threshold,
                    isNear: isNear
                });
            }
            
            return isNear;
        } catch (error) {
            console.error('Fehler bei der Prüfung auf Nähe zu einem Abschnitt:', error);
            return false;
        }
    }
    
    /**
     * Benachrichtigt die Navigationsleiste (Masthead) über Scroll-Ereignisse
     * Sendet ein benutzerdefiniertes Event mit Informationen über die Scroll-Richtung
     * @param {number} direction - Die Scroll-Richtung (1 = nach oben, -1 = nach unten)
     */
    function notifyMasthead(direction) {
        try {
            // Benutzerdefiniertes Event erstellen
            const event = new CustomEvent('hybridScroll', {
                detail: {
                    direction: direction,
                    programmatic: true,
                    timestamp: Date.now()
                }
            });
            
            // Event an das Fenster senden
            window.dispatchEvent(event);
            
            if (config.debug) {
                console.log('Masthead benachrichtigt:', direction > 0 ? 'nach oben' : 'nach unten');
            }
        } catch (error) {
            console.error('Fehler bei der Benachrichtigung des Mastheads:', error);
        }
    }
    
    /**
     * Führt einen sanften Scroll zu einer bestimmten Position durch
     * @param {number} targetY - Die Zielposition (in Pixel)
     * @param {number} duration - Die Dauer des Scrolls (in Millisekunden)
     * @param {Function} callback - Callback-Funktion, die nach Abschluss des Scrolls aufgerufen wird
     */
    function smoothScrollTo(targetY, duration, callback) {
        try {
            // Sicherstellen, dass die Zielposition gültig ist
            if (isNaN(targetY) || targetY < 0) {
                console.warn('Ungültige Zielposition für Scroll:', targetY);
                if (typeof callback === 'function') callback();
                return;
            }
            
            const startY = window.scrollY;
            const distance = targetY - startY;
            const startTime = performance.now();
            
            // Wenn die Distanz sehr klein ist, sofort scrollen
            if (Math.abs(distance) < 5) {
                window.scrollTo(0, targetY);
                if (typeof callback === 'function') callback();
                return;
            }
            
            // Scroll-Animation
            function scrollStep(currentTime) {
                const elapsedTime = currentTime - startTime;
                
                if (elapsedTime >= duration) {
                    window.scrollTo(0, targetY);
                    isScrolling = false;
                    if (typeof callback === 'function') callback();
                    return;
                }
                
                // Kubische Easing-Funktion für natürlicheres Scrollen
                const progress = elapsedTime / duration;
                const easedProgress = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startY + distance * easedProgress);
                requestAnimationFrame(scrollStep);
            }
            
            isScrolling = true;
            requestAnimationFrame(scrollStep);
        } catch (error) {
            console.error('Fehler beim sanften Scrollen:', error);
            isScrolling = false;
            if (typeof callback === 'function') callback();
        }
    }
    
    /**
     * Prüft, ob zum nächsten Abschnitt gescrollt werden sollte, und führt den Scroll durch
     * Berücksichtigt Scroll-Geschwindigkeit, Zeit seit dem letzten Snap und Nähe zum Abschnitt
     */
    function snapToNearestSectionIfNeeded(forceSnap = false) {
        try {
            if (!config.enabled || isScrolling) return;
            
            const now = Date.now();
            
            // Debug-Ausgaben
            if (config.debug) {
                console.log('Prüfe Einrasten:', {
                    scrollVelocity: scrollVelocity,
                    speedThreshold: config.speedThreshold,
                    timeSinceLastSnap: now - lastSnapTime,
                    minSnapInterval: config.minSnapInterval,
                    forceSnap: forceSnap
                });
            }
            
            // Prüfen, ob genug Zeit seit dem letzten Snap vergangen ist
            // Überspringen, wenn forceSnap aktiviert ist
            if (!forceSnap && now - lastSnapTime < config.minSnapInterval) {
                if (config.debug) console.log('Zu wenig Zeit seit letztem Snap vergangen');
                return;
            }
            
            // Prüfen, ob die Scroll-Geschwindigkeit niedrig genug ist
            // Überspringen, wenn forceSnap aktiviert ist
            if (!forceSnap && Math.abs(scrollVelocity) > config.speedThreshold) {
                if (config.debug) console.log('Scroll-Geschwindigkeit zu hoch:', scrollVelocity);
                return;
            }
            
            const nearestSection = getNearestSection();
            
            if (config.debug && nearestSection) {
                console.log('Nächster Abschnitt:', {
                    tagName: nearestSection.tagName,
                    top: nearestSection.top,
                    distanceToViewport: Math.abs(window.scrollY - nearestSection.top),
                    threshold: window.innerHeight * config.snapThreshold,
                    forceSnap: forceSnap
                });
            }
            
            // Prüfen, ob ein Abschnitt in der Nähe ist
            // Bei forceSnap wird ein größerer Schwellenwert verwendet
            const isNear = forceSnap 
                ? Math.abs(window.scrollY - nearestSection.top) <= window.innerHeight * 0.4 // 40% der Viewport-Höhe bei erzwungenem Einrasten
                : isNearSection(nearestSection);
                
            if (nearestSection && isNear) {
                const targetY = nearestSection.top - config.scrollOffset;
                
                // Scroll-Richtung bestimmen (für die Benachrichtigung des Mastheads)
                const currentY = window.scrollY;
                const direction = targetY < currentY ? 1 : -1;
                
                if (config.debug) {
                    console.log('Einrasten zu Abschnitt:', {
                        tagName: nearestSection.tagName,
                        text: nearestSection.element.textContent.substring(0, 30),
                        targetY: targetY,
                        direction: direction > 0 ? 'nach oben' : 'nach unten',
                        forceSnap: forceSnap
                    });
                }
                
                // Masthead über die Scroll-Richtung informieren
                notifyMasthead(direction);
                
                // Zum Abschnitt scrollen
                smoothScrollTo(targetY, config.scrollDuration, function() {
                    lastSnapTime = Date.now();
                    
                    if (config.debug) {
                        console.log('Zu Abschnitt gescrollt:', nearestSection.element.tagName, 
                                    nearestSection.element.textContent.substring(0, 30));
                    }
                });
            }
        } catch (error) {
            console.error('Fehler beim Einrasten zum nächsten Abschnitt:', error);
        }
    }
    
    /**
     * Event-Handler für Scroll-Events
     * Berechnet Scroll-Geschwindigkeit und -Richtung und setzt einen Timeout für das Einrasten
     */
    function handleScroll() {
        try {
            if (!config.enabled || isScrolling) return;
            
            const now = Date.now();
            const currentScrollY = window.scrollY;
            
            // Scroll-Richtung und -Geschwindigkeit berechnen
            scrollDirection = currentScrollY > lastScrollY ? -1 : 1;
            
            // Scroll-Geschwindigkeit berechnen (Pixel pro Sekunde)
            const timeDiff = now - lastScrollTime;
            if (timeDiff > 0) {
                scrollVelocity = Math.abs(currentScrollY - lastScrollY) / (timeDiff / 1000);
                
                if (config.debug) {
                    console.log('Scroll-Geschwindigkeit:', scrollVelocity.toFixed(2), 'px/s');
                }
            }
            
            lastScrollY = currentScrollY;
            lastScrollTime = now;
            
            // Timeout für das Einrasten setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // Wenn die Geschwindigkeit sehr niedrig ist, zum nächsten Abschnitt einrasten
                // Dies hilft, wenn der Benutzer das Scrollen beendet hat
                if (scrollVelocity < 5) {
                    if (config.debug) {
                        console.log('Scroll beendet, erzwinge Einrasten');
                    }
                    // Erzwungenes Einrasten mit forceSnap=true
                    snapToNearestSectionIfNeeded(true);
                } else {
                    snapToNearestSectionIfNeeded(false);
                }
            }, config.scrollDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Scroll-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Mausrad-Events
     * Verhindert das Einrasten während des Scrollens mit dem Mausrad
     * @param {WheelEvent} event - Das Wheel-Event
     */
    function handleWheel(event) {
        try {
            if (!config.enabled) return;
            
            // Prüfen, ob das Event innerhalb eines ausgeschlossenen Elements ausgelöst wurde
            if (isExcluded(event.target)) return;
            
            // Scroll-Start-Position aktualisieren
            scrollStartY = window.scrollY;
            
            // Timeout für das Einrasten setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                scrollEndY = window.scrollY;
                // Prüfen, ob der Benutzer das Scrollen beendet hat
                if (Math.abs(scrollVelocity) < 5) {
                    if (config.debug) {
                        console.log('Wheel-Event beendet, erzwinge Einrasten');
                    }
                    snapToNearestSectionIfNeeded(true);
                } else {
                    snapToNearestSectionIfNeeded(false);
                }
            }, config.scrollDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Wheel-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Tastatur-Events
     * Ermöglicht Navigation mit Pfeiltasten und Seitentasten
     * @param {KeyboardEvent} event - Das Keyboard-Event
     */
    function handleKeyDown(event) {
        try {
            if (!config.enabled) return;
            
            // Prüfen, ob das Event innerhalb eines ausgeschlossenen Elements ausgelöst wurde
            if (isExcluded(document.activeElement)) return;
            
            const key = event.key;
            
            // Navigation mit Pfeiltasten
            if (key === 'ArrowUp' || key === 'ArrowDown' || 
                key === 'PageUp' || key === 'PageDown' || 
                key === 'Home' || key === 'End') {
                
                // Timeout für das Einrasten setzen
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    // Bei Tastatur-Navigation immer erzwungenes Einrasten verwenden
                    snapToNearestSectionIfNeeded(true);
                }, config.scrollDelay);
            }
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Keyboard-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Touch-Start-Events
     * Speichert die Start-Position für Touch-Navigation
     * @param {TouchEvent} event - Das Touch-Event
     */
    function handleTouchStart(event) {
        try {
            if (!config.enabled) return;
            
            // Prüfen, ob das Event innerhalb eines ausgeschlossenen Elements ausgelöst wurde
            if (isExcluded(event.target)) return;
            
            // Scroll-Start-Position speichern
            scrollStartY = window.scrollY;
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des TouchStart-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Touch-End-Events
     * Prüft, ob zum nächsten Abschnitt gescrollt werden sollte
     * @param {TouchEvent} event - Das Touch-Event
     */
    function handleTouchEnd(event) {
        try {
            if (!config.enabled) return;
            
            // Prüfen, ob das Event innerhalb eines ausgeschlossenen Elements ausgelöst wurde
            if (isExcluded(event.target)) return;
            
            // Scroll-End-Position speichern
            scrollEndY = window.scrollY;
            
            // Timeout für das Einrasten setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // Bei Touch-Events immer erzwungenes Einrasten verwenden
                snapToNearestSectionIfNeeded(true);
            }, config.scrollDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des TouchEnd-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Resize-Events
     * Aktualisiert die Abschnitte nach einer Größenänderung des Fensters
     */
    function handleResize() {
        try {
            if (!config.enabled) return;
            
            // Debounce für bessere Performance
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                collectSections();
                
                // Nach der Aktualisierung der Abschnitte ein erzwungenes Einrasten durchführen
                setTimeout(function() {
                    if (config.debug) {
                        console.log('Erzwinge Einrasten nach Resize');
                    }
                    snapToNearestSectionIfNeeded(true);
                }, 100); // Kurze Verzögerung, um sicherzustellen, dass die Abschnitte aktualisiert sind
            }, config.resizeDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Resize-Events:', error);
        }
    }
    
    /**
     * Richtet einen MutationObserver ein, um Änderungen am DOM zu überwachen
     * Aktualisiert die Abschnitte, wenn Elemente hinzugefügt oder entfernt werden
     */
    function setupMutationObserver() {
        try {
            // MutationObserver erstellen
            mutationObserver = new MutationObserver(function(mutations) {
                let shouldUpdate = false;
                
                // Prüfen, ob relevante Änderungen vorliegen
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && 
                        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                        shouldUpdate = true;
                        break;
                    }
                }
                
                // Abschnitte aktualisieren, wenn relevante Änderungen vorliegen
                if (shouldUpdate) {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(function() {
                        collectSections();
                        
                        // Nach der Aktualisierung der Abschnitte ein erzwungenes Einrasten durchführen
                        setTimeout(function() {
                            if (config.debug) {
                                console.log('Erzwinge Einrasten nach DOM-Änderung');
                            }
                            snapToNearestSectionIfNeeded(true);
                        }, 100); // Kurze Verzögerung, um sicherzustellen, dass die Abschnitte aktualisiert sind
                    }, config.resizeDelay);
                }
            });
            
            // MutationObserver starten
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            if (config.debug) {
                console.log('MutationObserver für dynamische Inhalte eingerichtet');
            }
        } catch (error) {
            console.error('Fehler beim Einrichten des MutationObservers:', error);
        }
    }
    
    /**
     * Event-Handler für Klicks auf Links
     * Erzwingt das Einrasten nach der Navigation
     * @param {MouseEvent} event - Das Click-Event
     */
    function handleLinkClick(event) {
        try {
            // Prüfen, ob ein Link geklickt wurde
            let target = event.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }
            
            // Wenn ein Link gefunden wurde und es ein interner Link ist
            if (target && target.tagName === 'A' && target.href && target.href.startsWith(window.location.origin)) {
                // Nach der Navigation ein erzwungenes Einrasten durchführen
                setTimeout(function() {
                    if (config.debug) {
                        console.log('Erzwinge Einrasten nach Link-Klick');
                    }
                    snapToNearestSectionIfNeeded(true);
                }, 500); // Kurze Verzögerung, um sicherzustellen, dass die Navigation abgeschlossen ist
            }
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Link-Klicks:', error);
        }
    }
    
    /**
     * Öffentliche API für das hybride Scroll-System
     */
    const publicAPI = {
        /**
         * Aktiviert das hybride Scroll-System
         */
        enable: function() {
            try {
                config.enabled = true;
                if (config.debug) {
                    console.log('Hybrides Scroll-System aktiviert');
                }
            } catch (error) {
                console.error('Fehler beim Aktivieren des hybriden Scroll-Systems:', error);
            }
        },
        
        /**
         * Deaktiviert das hybride Scroll-System
         */
        disable: function() {
            try {
                config.enabled = false;
                if (config.debug) {
                    console.log('Hybrides Scroll-System deaktiviert');
                }
            } catch (error) {
                console.error('Fehler beim Deaktivieren des hybriden Scroll-Systems:', error);
            }
        },
        
        /**
         * Aktualisiert die Abschnitte
         */
        refresh: function() {
            try {
                collectSections();
                if (config.debug) {
                    console.log('Abschnitte aktualisiert');
                }
            } catch (error) {
                console.error('Fehler beim Aktualisieren der Abschnitte:', error);
            }
        },
        
        /**
         * Gibt die aktuelle Konfiguration zurück
         * @returns {Object} - Die aktuelle Konfiguration
         */
        getConfig: function() {
            try {
                return { ...config };
            } catch (error) {
                console.error('Fehler beim Abrufen der Konfiguration:', error);
                return {};
            }
        },
        
        /**
         * Aktualisiert die Konfiguration
         * @param {Object} newConfig - Die neue Konfiguration
         */
        updateConfig: function(newConfig) {
            try {
                Object.assign(config, newConfig);
                collectSections();
                if (config.debug) {
                    console.log('Konfiguration aktualisiert:', newConfig);
                }
            } catch (error) {
                console.error('Fehler beim Aktualisieren der Konfiguration:', error);
            }
        },
        
        /**
         * Erzwingt das Einrasten zum nächsten Abschnitt
         * Nützlich, wenn das automatische Einrasten nicht funktioniert oder manuell ausgelöst werden soll
         */
        forceSnap: function() {
            try {
                if (config.debug) {
                    console.log('Manuelles Einrasten erzwungen');
                }
                snapToNearestSectionIfNeeded(true);
            } catch (error) {
                console.error('Fehler beim erzwungenen Einrasten:', error);
            }
        },
        
        /**
         * Scrollt zu einem bestimmten Element
         * @param {string|HTMLElement} target - Das Zielelement oder ein Selektor
         * @param {Object} options - Optionen für den Scroll
         */
        scrollToElement: function(target, options = {}) {
            try {
                // Standardwerte für Optionen
                const opts = {
                    offset: options.offset !== undefined ? options.offset : config.scrollOffset,
                    duration: options.duration !== undefined ? options.duration : config.scrollDuration,
                    callback: options.callback
                };
                
                // Element finden
                let element = null;
                if (typeof target === 'string') {
                    element = document.querySelector(target);
                } else if (target instanceof HTMLElement) {
                    element = target;
                }
                
                if (!element) {
                    console.warn('Element nicht gefunden:', target);
                    if (typeof opts.callback === 'function') opts.callback();
                    return;
                }
                
                // Zielposition berechnen
                const rect = element.getBoundingClientRect();
                const targetY = rect.top + window.scrollY - opts.offset;
                
                // Scroll-Richtung bestimmen
                const direction = targetY < window.scrollY ? 1 : -1;
                
                // Masthead benachrichtigen
                notifyMasthead(direction);
                
                // Zum Element scrollen
                smoothScrollTo(targetY, opts.duration, opts.callback);
                
                if (config.debug) {
                    console.log('Zu Element gescrollt:', target);
                }
            } catch (error) {
                console.error('Fehler beim Scrollen zu einem Element:', error);
                if (options.callback && typeof options.callback === 'function') {
                    options.callback();
                }
            }
        }
    };
    
    // Öffentliche API global verfügbar machen
    window.hybridScroll = publicAPI;
    
    // Initialisierung nach dem Laden des Dokuments
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            // Nach der Initialisierung ein erzwungenes Einrasten durchführen
            setTimeout(function() {
                if (config.debug) {
                    console.log('Erzwinge Einrasten nach Seitenladung');
                }
                snapToNearestSectionIfNeeded(true);
            }, 500); // Kurze Verzögerung, um sicherzustellen, dass alle Elemente geladen sind
        });
    } else {
        init();
        // Nach der Initialisierung ein erzwungenes Einrasten durchführen
        setTimeout(function() {
            if (config.debug) {
                console.log('Erzwinge Einrasten nach Seitenladung');
            }
            snapToNearestSectionIfNeeded(true);
        }, 500); // Kurze Verzögerung, um sicherzustellen, dass alle Elemente geladen sind
    }
})(); 