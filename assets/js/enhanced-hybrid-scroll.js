/**
 * Verbessertes Hybrides Abschnitts-Scroll-System
 * Version 2.0.0
 * 
 * Dieses Skript implementiert ein optimiertes hybrides Scrolling-System,
 * das normales Scrollen innerhalb von Abschnitten ermöglicht und ein
 * zuverlässiges Einrasten an allen definierten Abschnittsgrenzen bietet.
 */

(function() {
    'use strict';
    
    // Konfiguration
    const config = {
        scrollDuration: 400,       // Dauer des Scrollens in Millisekunden
        snapThreshold: 0.25,       // Schwellenwert für das Einrasten (in % der Viewport-Höhe)
        scrollDelay: 100,          // Verzögerung nach Scroll-Event in Millisekunden
        minSnapInterval: 800,      // Mindestabstand zwischen Snap-Scrolls in Millisekunden
        scrollOffset: 0,           // Offset für das Scrollen (in Pixel)
        minSectionHeight: 30,      // Mindesthöhe für Abschnitte (in Pixel)
        speedThreshold: 30,        // Scroll-Geschwindigkeit-Schwellenwert
        resizeDelay: 200,          // Verzögerung für die Aktualisierung der Abschnitte bei Resize-Events
        enabled: true,             // Aktivieren/Deaktivieren des hybriden Scrollings
        debug: true,               // Debug-Modus aktiviert für Fehlerdiagnose
        
        // Selektoren für Abschnitte
        sections: [
            'h2', 'h3', 'h4', 'h5', 'h6',
            'section', 'article', 'header', 'footer',
            '.section', '.page__content > hr',
            '.page__content > table'
        ],
        
        // Selektoren für ausgeschlossene Elemente
        excludedElements: [
            'pre', 'code', 'textarea', 'input', 'select',
            '.code-block', '.highlight', '.toc', '.table-wrapper',
            '.excluded-from-snap'
        ]
    };
    
    // Variablen
    let sections = [];
    let lastScrollY = window.scrollY;
    let lastScrollTime = 0;
    let lastSnapTime = 0;
    let scrollTimeout = null;
    let resizeTimeout = null;
    let scrollVelocity = 0;
    let scrollDirection = 0;
    let isScrolling = false;
    let mutationObserver = null;
    
    /**
     * Initialisiert das Scroll-System
     */
    function init() {
        try {
            // Abschnitte sammeln
            collectSections();
            
            // Event-Listener hinzufügen
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('wheel', handleWheel, { passive: true });
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('touchstart', handleTouchStart, { passive: true });
            window.addEventListener('touchend', handleTouchEnd, { passive: true });
            window.addEventListener('resize', handleResize, { passive: true });
            
            // Link-Klicks abfangen
            document.addEventListener('click', handleLinkClick);
            
            // MutationObserver für DOM-Änderungen einrichten
            setupMutationObserver();
            
            // Initiales Einrasten nach dem Laden der Seite
            window.addEventListener('load', function() {
                setTimeout(function() {
                    snapToNearestSectionIfNeeded(true);
                }, 100);
            });
            
            if (config.debug) {
                console.log('Hybrides Scroll-System initialisiert');
            }
        } catch (error) {
            console.error('Fehler bei der Initialisierung des Scroll-Systems:', error);
        }
    }
    
    /**
     * Sammelt alle Abschnitte auf der Seite
     */
    function collectSections() {
        try {
            sections = [];
            
            // Selektoren für Abschnitte kombinieren
            const selectorString = config.sections.join(', ');
            
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
                }
            });
            
            // Abschnitte nach Position sortieren
            sections.sort((a, b) => a.top - b.top);
            
            if (config.debug) {
                console.log('Abschnitte nach Filterung:', sections.length);
                sections.forEach((section, index) => {
                    console.log(`Abschnitt ${index + 1}:`, section.tagName, section.top, section.element.textContent.substring(0, 30));
                });
            }
        } catch (error) {
            console.error('Fehler beim Sammeln der Abschnitte:', error);
        }
    }
    
    /**
     * Prüft, ob ein Element in einem ausgeschlossenen Bereich liegt
     */
    function isExcluded(element) {
        try {
            // Prüfen, ob das Element selbst ausgeschlossen ist
            const excludedSelector = config.excludedElements.join(', ');
            if (element.matches(excludedSelector)) {
                return true;
            }
            
            // Prüfen, ob das Element in einem ausgeschlossenen Bereich liegt
            let parent = element.parentElement;
            while (parent) {
                if (parent.matches(excludedSelector)) {
                    return true;
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
     * VERBESSERT: Berücksichtigt die Scroll-Richtung für bessere Vorhersage
     */
    function getNearestSection() {
        try {
            if (sections.length === 0) return null;
            
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const viewportMiddle = scrollY + viewportHeight / 2;
            
            // Sortiere Abschnitte nach Nähe zum Viewport-Mittelpunkt
            const sortedSections = [...sections].sort((a, b) => {
                const aMiddle = (a.top + a.bottom) / 2;
                const bMiddle = (b.top + b.bottom) / 2;
                return Math.abs(aMiddle - viewportMiddle) - Math.abs(bMiddle - viewportMiddle);
            });
            
            // Bevorzuge Abschnitte in Scroll-Richtung
            if (scrollDirection !== 0) {
                // Finde Abschnitte in Scroll-Richtung
                const sectionsInDirection = sortedSections.filter(section => {
                    if (scrollDirection > 0) { // Nach oben scrollen
                        return section.top < scrollY;
                    } else { // Nach unten scrollen
                        return section.top > scrollY;
                    }
                });
                
                // Wenn Abschnitte in Scroll-Richtung gefunden wurden, verwende den nächsten
                if (sectionsInDirection.length > 0) {
                    return sectionsInDirection[0];
                }
            }
            
            // Fallback: Verwende den nächsten Abschnitt unabhängig von der Richtung
            return sortedSections[0];
        } catch (error) {
            console.error('Fehler bei der Bestimmung des nächsten Abschnitts:', error);
            return null;
        }
    }
    
    /**
     * Prüft, ob ein Abschnitt in der Nähe ist und ob zu diesem gescrollt werden sollte
     * VERBESSERT: Dynamischer Schwellenwert basierend auf Elementtyp und Größe
     */
    function isNearSection(section) {
        try {
            if (!section) return false;
            
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            
            // Dynamischer Schwellenwert basierend auf Elementtyp
            let threshold = viewportHeight * config.snapThreshold;
            
            // Für Überschriften einen größeren Schwellenwert verwenden
            if (section.tagName === 'h1') {
                threshold *= 2.0; // Größter Schwellenwert für H1
            } else if (section.tagName === 'h2' || section.tagName === 'h3') {
                threshold *= 1.5; // Größerer Schwellenwert für H2/H3
            } else if (section.tagName.startsWith('h')) {
                threshold *= 1.2; // Leicht größerer Schwellenwert für andere Überschriften
            }
            
            // Für große Elemente einen größeren Schwellenwert verwenden
            if (section.height > viewportHeight * 0.5) {
                threshold *= 1.2;
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
     * Benachrichtigt die Navigationsleiste über Scroll-Ereignisse
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
        } catch (error) {
            console.error('Fehler bei der Benachrichtigung des Mastheads:', error);
        }
    }
    
    /**
     * Führt einen sanften Scroll zu einer bestimmten Position durch
     */
    function smoothScrollTo(targetY, duration, callback) {
        try {
            const startY = window.scrollY;
            const distance = targetY - startY;
            let startTime = null;
            isScrolling = true;
            
            // Keine Animation, wenn die Distanz sehr klein ist
            if (Math.abs(distance) < 10) {
                window.scrollTo(0, targetY);
                isScrolling = false;
                if (typeof callback === 'function') callback();
                return;
            }
            
            function scrollStep(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Kubische Easing-Funktion für natürlicheres Scrollen
                const easeProgress = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startY + distance * easeProgress);
                
                if (timeElapsed < duration) {
                    window.requestAnimationFrame(scrollStep);
                } else {
                    // Sicherstellen, dass die exakte Zielposition erreicht wird
                    window.scrollTo(0, targetY);
                    isScrolling = false;
                    if (typeof callback === 'function') callback();
                }
            }
            
            window.requestAnimationFrame(scrollStep);
        } catch (error) {
            console.error('Fehler beim sanften Scrollen:', error);
            isScrolling = false;
            if (typeof callback === 'function') callback();
        }
    }
    
    /**
     * Prüft, ob zum nächsten Abschnitt gescrollt werden sollte, und führt den Scroll durch
     * VERBESSERT: Zuverlässigeres Einrasten mit besserer Berücksichtigung aller Abschnittstypen
     */
    function snapToNearestSectionIfNeeded(forceSnap = false) {
        try {
            if (!config.enabled || isScrolling) return;
            
            const now = Date.now();
            
            // Prüfen, ob genug Zeit seit dem letzten Snap vergangen ist
            if (!forceSnap && now - lastSnapTime < config.minSnapInterval) {
                if (config.debug) console.log('Zu wenig Zeit seit letztem Snap vergangen');
                return;
            }
            
            // Prüfen, ob die Scroll-Geschwindigkeit niedrig genug ist
            if (!forceSnap && Math.abs(scrollVelocity) > config.speedThreshold) {
                if (config.debug) console.log('Scroll-Geschwindigkeit zu hoch:', scrollVelocity);
                return;
            }
            
            // Nächsten Abschnitt bestimmen
            const nearestSection = getNearestSection();
            
            if (!nearestSection) {
                if (config.debug) console.log('Kein Abschnitt gefunden');
                return;
            }
            
            // Prüfen, ob ein Abschnitt in der Nähe ist
            // Bei forceSnap wird ein größerer Schwellenwert verwendet
            const isNear = forceSnap 
                ? Math.abs(window.scrollY - nearestSection.top) <= window.innerHeight * 0.5 // 50% der Viewport-Höhe bei erzwungenem Einrasten
                : isNearSection(nearestSection);
                
            if (isNear) {
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
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Fehler beim Einrasten zum nächsten Abschnitt:', error);
            return false;
        }
    }
    
    /**
     * Event-Handler für Scroll-Events
     * VERBESSERT: Genauere Geschwindigkeitsberechnung und bessere Einrast-Logik
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
            }
            
            lastScrollY = currentScrollY;
            lastScrollTime = now;
            
            // Timeout für das Einrasten setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // Wenn die Geschwindigkeit sehr niedrig ist, zum nächsten Abschnitt einrasten
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
     */
    function handleWheel(event) {
        try {
            if (!config.enabled || isScrolling) return;
            
            // Scroll-Richtung aktualisieren
            scrollDirection = event.deltaY > 0 ? -1 : 1;
            
            // Timeout für das Einrasten setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                snapToNearestSectionIfNeeded(true);
            }, config.scrollDelay * 1.5);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Wheel-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Tastatur-Events
     */
    function handleKeyDown(event) {
        try {
            if (!config.enabled || isScrolling) return;
            
            // Nur für Pfeil-Tasten, Bild-Tasten, Home und End
            const key = event.key;
            if (key === 'ArrowUp' || key === 'ArrowDown' || 
                key === 'PageUp' || key === 'PageDown' || 
                key === 'Home' || key === 'End') {
                
                // Scroll-Richtung aktualisieren
                if (key === 'ArrowUp' || key === 'PageUp' || key === 'Home') {
                    scrollDirection = 1; // Nach oben
                } else {
                    scrollDirection = -1; // Nach unten
                }
                
                // Timeout für das Einrasten setzen
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    snapToNearestSectionIfNeeded(true);
                }, config.scrollDelay);
            }
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Tastatur-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Touch-Start-Events
     */
    let touchStartY = 0;
    function handleTouchStart(event) {
        try {
            if (!config.enabled) return;
            
            // Touch-Position speichern
            if (event.touches.length === 1) {
                touchStartY = event.touches[0].clientY;
            }
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des TouchStart-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Touch-End-Events
     */
    function handleTouchEnd(event) {
        try {
            if (!config.enabled || isScrolling) return;
            
            // Timeout für das Einrasten setzen
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                snapToNearestSectionIfNeeded(true);
            }, config.scrollDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des TouchEnd-Events:', error);
        }
    }
    
    /**
     * Event-Handler für Resize-Events
     */
    function handleResize() {
        try {
            if (!config.enabled) return;
            
            // Timeout für die Aktualisierung der Abschnitte setzen
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                collectSections();
                snapToNearestSectionIfNeeded(true);
            }, config.resizeDelay);
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Resize-Events:', error);
        }
    }
    
    /**
     * Richtet einen MutationObserver ein, um DOM-Änderungen zu überwachen
     */
    function setupMutationObserver() {
        try {
            if (!window.MutationObserver) return;
            
            // MutationObserver erstellen
            mutationObserver = new MutationObserver(function(mutations) {
                let shouldUpdate = false;
                
                // Prüfen, ob relevante Änderungen vorliegen
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' || 
                        (mutation.type === 'attributes' && 
                         (mutation.attributeName === 'class' || mutation.attributeName === 'style'))) {
                        shouldUpdate = true;
                        break;
                    }
                }
                
                if (shouldUpdate) {
                    // Timeout für die Aktualisierung der Abschnitte setzen
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(function() {
                        collectSections();
                        snapToNearestSectionIfNeeded(true);
                    }, config.resizeDelay);
                }
            });
            
            // MutationObserver starten
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        } catch (error) {
            console.error('Fehler beim Einrichten des MutationObservers:', error);
        }
    }
    
    /**
     * Event-Handler für Link-Klicks
     */
    function handleLinkClick(event) {
        try {
            if (!config.enabled) return;
            
            const target = event.target.closest('a');
            if (!target) return;
            
            const href = target.getAttribute('href');
            if (!href) return;
            
            // Nur für interne Links
            if (href.startsWith('#') || href.startsWith(window.location.pathname)) {
                // Timeout für das Einrasten setzen
                setTimeout(function() {
                    collectSections();
                    snapToNearestSectionIfNeeded(true);
                }, 100);
            }
        } catch (error) {
            console.error('Fehler bei der Verarbeitung des Link-Klicks:', error);
        }
    }
    
    /**
     * Öffentliche API
     */
    window.hybridScroll = {
        // Konfiguration aktualisieren
        updateConfig: function(newConfig) {
            try {
                Object.assign(config, newConfig);
                collectSections();
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
        
        // Scroll-System aktivieren
        enable: function() {
            config.enabled = true;
        },
        
        // Scroll-System deaktivieren
        disable: function() {
            config.enabled = false;
        },
        
        // Abschnitte aktualisieren
        refresh: function() {
            collectSections();
        },
        
        // Erzwungenes Einrasten
        forceSnap: function() {
            return snapToNearestSectionIfNeeded(true);
        },
        
        // Zu einem Element scrollen
        scrollToElement: function(selector, options = {}) {
            try {
                const element = typeof selector === 'string' 
                    ? document.querySelector(selector) 
                    : selector;
                
                if (!element) {
                    console.error('Element nicht gefunden:', selector);
                    return false;
                }
                
                const rect = element.getBoundingClientRect();
                const targetY = rect.top + window.scrollY - (options.offset || config.scrollOffset);
                const duration = options.duration || config.scrollDuration;
                
                // Scroll-Richtung bestimmen
                const direction = targetY < window.scrollY ? 1 : -1;
                
                // Masthead über die Scroll-Richtung informieren
                notifyMasthead(direction);
                
                // Zum Element scrollen
                smoothScrollTo(targetY, duration, options.callback);
                
                return true;
            } catch (error) {
                console.error('Fehler beim Scrollen zu einem Element:', error);
                return false;
            }
        }
    };
    
    // Scroll-System initialisieren
    init();
    
})(); 