/**
 * Test-Skript für das verbesserte hybride Scroll-System
 * 
 * Dieses Skript testet die Funktionalität des verbesserten hybriden Scroll-Systems
 * und gibt detaillierte Informationen in der Konsole aus.
 */

(function() {
    'use strict';
    
    // Warten, bis das Dokument geladen ist
    document.addEventListener('DOMContentLoaded', function() {
        // Prüfen, ob das hybride Scroll-System verfügbar ist
        if (!window.hybridScroll) {
            console.error('Hybrides Scroll-System nicht gefunden!');
            return;
        }
        
        console.log('Test des verbesserten hybriden Scroll-Systems gestartet');
        
        // Konfiguration abrufen
        const config = window.hybridScroll.getConfig();
        console.log('Aktuelle Konfiguration:', config);
        
        // Abschnitte manuell aktualisieren
        window.hybridScroll.refresh();
        
        // Test-Funktionen
        const tests = {
            // Test 1: Abschnitte auflisten
            listSections: function() {
                console.log('=== TEST 1: Abschnitte auflisten ===');
                
                // Selektoren für Abschnitte kombinieren
                const selectorString = config.sections.join(', ');
                
                // Alle Elemente sammeln, die den Selektoren entsprechen
                const elements = document.querySelectorAll(selectorString);
                console.log('Gefundene Elemente (gesamt):', elements.length);
                
                // Elemente nach Typ gruppieren
                const elementsByType = {};
                Array.from(elements).forEach(element => {
                    const tagName = element.tagName.toLowerCase();
                    if (!elementsByType[tagName]) {
                        elementsByType[tagName] = [];
                    }
                    elementsByType[tagName].push(element);
                });
                
                // Ausgabe nach Typ
                Object.keys(elementsByType).forEach(tagName => {
                    console.log(`${tagName}: ${elementsByType[tagName].length} Elemente`);
                });
                
                return elements.length > 0;
            },
            
            // Test 2: Einrasten testen
            testSnapping: function() {
                console.log('=== TEST 2: Einrasten testen ===');
                
                // Erzwungenes Einrasten
                const result = window.hybridScroll.forceSnap();
                console.log('Ergebnis des erzwungenen Einrastens:', result);
                
                return result;
            },
            
            // Test 3: Zu verschiedenen Elementtypen scrollen
            testScrollToElements: function() {
                console.log('=== TEST 3: Zu verschiedenen Elementtypen scrollen ===');
                
                // Selektoren für verschiedene Elementtypen
                const selectors = [
                    'h1', 'h2', 'h3', 'section', 'article', '.section'
                ];
                
                // Für jeden Selektor das erste Element finden und dazu scrollen
                const results = selectors.map(selector => {
                    const element = document.querySelector(selector);
                    if (!element) {
                        console.log(`Kein Element gefunden für: ${selector}`);
                        return false;
                    }
                    
                    console.log(`Scrolle zu ${selector}: ${element.textContent.substring(0, 30)}`);
                    
                    // Timeout verwenden, um die Tests zu trennen
                    setTimeout(() => {
                        window.hybridScroll.scrollToElement(element);
                    }, 1000);
                    
                    return true;
                });
                
                return results.some(result => result);
            },
            
            // Test 4: Konfiguration ändern und testen
            testConfigChanges: function() {
                console.log('=== TEST 4: Konfiguration ändern und testen ===');
                
                // Originale Konfiguration speichern
                const originalConfig = Object.assign({}, window.hybridScroll.getConfig());
                
                // Konfiguration ändern
                window.hybridScroll.updateConfig({
                    snapThreshold: 0.35,
                    scrollDuration: 300
                });
                
                console.log('Konfiguration geändert:', window.hybridScroll.getConfig());
                
                // Erzwungenes Einrasten mit neuer Konfiguration
                const result = window.hybridScroll.forceSnap();
                
                // Originale Konfiguration wiederherstellen
                setTimeout(() => {
                    window.hybridScroll.updateConfig(originalConfig);
                    console.log('Originale Konfiguration wiederhergestellt');
                }, 2000);
                
                return result;
            }
        };
        
        // Tests ausführen
        let testsPassed = 0;
        let testsFailed = 0;
        
        Object.keys(tests).forEach((testName, index) => {
            // Timeout verwenden, um die Tests zu trennen
            setTimeout(() => {
                try {
                    const result = tests[testName]();
                    if (result) {
                        console.log(`✅ Test "${testName}" erfolgreich`);
                        testsPassed++;
                    } else {
                        console.warn(`⚠️ Test "${testName}" nicht erfolgreich`);
                        testsFailed++;
                    }
                } catch (error) {
                    console.error(`❌ Fehler bei Test "${testName}":`, error);
                    testsFailed++;
                }
                
                // Nach dem letzten Test eine Zusammenfassung ausgeben
                if (index === Object.keys(tests).length - 1) {
                    setTimeout(() => {
                        console.log('=== TESTERGEBNISSE ===');
                        console.log(`Tests gesamt: ${Object.keys(tests).length}`);
                        console.log(`Tests erfolgreich: ${testsPassed}`);
                        console.log(`Tests fehlgeschlagen: ${testsFailed}`);
                    }, 1000);
                }
            }, index * 3000); // Jeder Test startet 3 Sekunden nach dem vorherigen
        });
    });
})(); 