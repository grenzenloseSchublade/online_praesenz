/**
 * Test-Skript für die Smart Masthead Scroll-Komponente
 * 
 * Dieses Skript führt Tests für die Smart Masthead Scroll-Komponente durch
 * und gibt detaillierte Informationen in der Konsole aus.
 */

(function() {
    'use strict';

    // Warten, bis das Dokument geladen ist
    document.addEventListener('DOMContentLoaded', function() {
        console.log('%c=== Smart Masthead Scroll Test ===', 'font-size: 16px; font-weight: bold; color: #4285f4;');
        
        // Prüfen, ob die Komponente verfügbar ist
        if (!window.smartMastheadScroll) {
            console.error('Smart Masthead Scroll ist nicht verfügbar. Bitte stellen Sie sicher, dass die Datei korrekt eingebunden ist.');
            return;
        }
        
        console.log('%cKomponente gefunden!', 'color: green; font-weight: bold;');
        
        // Aktuelle Konfiguration abrufen und ausgeben
        const config = window.smartMastheadScroll.getConfig();
        console.log('Aktuelle Konfiguration:', config);
        
        // Masthead-Element finden
        const masthead = document.querySelector(config.mastheadSelector);
        if (!masthead) {
            console.error(`Masthead-Element mit Selektor "${config.mastheadSelector}" nicht gefunden.`);
            return;
        }
        
        console.log(`Masthead-Element gefunden: %o`, masthead);
        console.log(`Masthead-Höhe: ${window.smartMastheadScroll.getMastheadHeight()}px`);
        
        // Tests definieren
        const tests = {
            // Test 1: Masthead-Klassen prüfen
            testMastheadClasses: function() {
                console.log('%cTest 1: Masthead-Klassen prüfen', 'font-weight: bold;');
                
                const hasVisibleClass = masthead.classList.contains(config.visibleClass);
                const hasHiddenClass = masthead.classList.contains(config.hiddenClass);
                
                console.log(`Masthead hat Klasse "${config.visibleClass}": ${hasVisibleClass}`);
                console.log(`Masthead hat Klasse "${config.hiddenClass}": ${hasHiddenClass}`);
                
                return hasVisibleClass || hasHiddenClass;
            },
            
            // Test 2: Masthead ausblenden und einblenden
            testMastheadToggle: function() {
                console.log('%cTest 2: Masthead ausblenden und einblenden', 'font-weight: bold;');
                
                // Aktuelle Scroll-Position speichern
                const initialScrollY = window.scrollY;
                console.log(`Initiale Scroll-Position: ${initialScrollY}px`);
                
                // Scroll nach unten simulieren, um Masthead auszublenden
                console.log('Simuliere Scroll nach unten...');
                window.scrollBy(0, config.scrollThreshold + 10);
                
                // Kurz warten und dann Scroll nach oben simulieren
                return new Promise(resolve => {
                    setTimeout(() => {
                        const afterDownScrollY = window.scrollY;
                        console.log(`Scroll-Position nach unten: ${afterDownScrollY}px`);
                        console.log(`Differenz: ${afterDownScrollY - initialScrollY}px`);
                        
                        console.log('Simuliere Scroll nach oben...');
                        window.scrollBy(0, -(config.scrollThreshold + 10));
                        
                        setTimeout(() => {
                            const afterUpScrollY = window.scrollY;
                            console.log(`Scroll-Position nach oben: ${afterUpScrollY}px`);
                            console.log(`Differenz zum Ausgangspunkt: ${afterUpScrollY - initialScrollY}px`);
                            
                            // Zurück zur ursprünglichen Position scrollen
                            window.scrollTo(0, initialScrollY);
                            
                            resolve(true);
                        }, config.animationDuration + 100);
                    }, config.animationDuration + 100);
                });
            },
            
            // Test 3: Konfiguration ändern
            testConfigUpdate: function() {
                console.log('%cTest 3: Konfiguration ändern', 'font-weight: bold;');
                
                // Originale Konfiguration speichern
                const originalConfig = Object.assign({}, window.smartMastheadScroll.getConfig());
                console.log('Originale Konfiguration:', originalConfig);
                
                // Konfiguration ändern
                const newConfig = {
                    animationDuration: 150,
                    scrollThreshold: 15,
                    debug: true
                };
                
                console.log('Neue Konfiguration anwenden:', newConfig);
                window.smartMastheadScroll.updateConfig(newConfig);
                
                // Geänderte Konfiguration abrufen
                const updatedConfig = window.smartMastheadScroll.getConfig();
                console.log('Aktualisierte Konfiguration:', updatedConfig);
                
                // Prüfen, ob die Änderungen übernommen wurden
                const success = 
                    updatedConfig.animationDuration === newConfig.animationDuration &&
                    updatedConfig.scrollThreshold === newConfig.scrollThreshold &&
                    updatedConfig.debug === newConfig.debug;
                
                // Originale Konfiguration wiederherstellen
                console.log('Originale Konfiguration wiederherstellen');
                window.smartMastheadScroll.updateConfig(originalConfig);
                
                return success;
            },
            
            // Test 4: Komponente deaktivieren und aktivieren
            testEnableDisable: function() {
                console.log('%cTest 4: Komponente deaktivieren und aktivieren', 'font-weight: bold;');
                
                // Komponente deaktivieren
                console.log('Komponente deaktivieren...');
                window.smartMastheadScroll.disable();
                
                // Prüfen, ob die Komponente deaktiviert ist
                const isDisabled = !window.smartMastheadScroll.getConfig().enabled;
                console.log(`Komponente ist deaktiviert: ${isDisabled}`);
                
                // Komponente wieder aktivieren
                console.log('Komponente aktivieren...');
                window.smartMastheadScroll.enable();
                
                // Prüfen, ob die Komponente aktiviert ist
                const isEnabled = window.smartMastheadScroll.getConfig().enabled;
                console.log(`Komponente ist aktiviert: ${isEnabled}`);
                
                return isDisabled && isEnabled;
            }
        };
        
        // Tests ausführen
        console.log('%cTests werden ausgeführt...', 'font-weight: bold; color: blue;');
        
        let testsPassed = 0;
        let testsFailed = 0;
        
        // Test 1 ausführen
        try {
            const test1Result = tests.testMastheadClasses();
            if (test1Result) {
                console.log('%cTest 1 bestanden ✓', 'color: green;');
                testsPassed++;
            } else {
                console.log('%cTest 1 fehlgeschlagen ✗', 'color: red;');
                testsFailed++;
            }
        } catch (error) {
            console.error('Fehler bei Test 1:', error);
            testsFailed++;
        }
        
        // Test 2 ausführen (nach 1 Sekunde)
        setTimeout(() => {
            tests.testMastheadToggle().then(test2Result => {
                if (test2Result) {
                    console.log('%cTest 2 bestanden ✓', 'color: green;');
                    testsPassed++;
                } else {
                    console.log('%cTest 2 fehlgeschlagen ✗', 'color: red;');
                    testsFailed++;
                }
                
                // Test 3 ausführen (nach 1 Sekunde)
                setTimeout(() => {
                    try {
                        const test3Result = tests.testConfigUpdate();
                        if (test3Result) {
                            console.log('%cTest 3 bestanden ✓', 'color: green;');
                            testsPassed++;
                        } else {
                            console.log('%cTest 3 fehlgeschlagen ✗', 'color: red;');
                            testsFailed++;
                        }
                        
                        // Test 4 ausführen (nach 1 Sekunde)
                        setTimeout(() => {
                            try {
                                const test4Result = tests.testEnableDisable();
                                if (test4Result) {
                                    console.log('%cTest 4 bestanden ✓', 'color: green;');
                                    testsPassed++;
                                } else {
                                    console.log('%cTest 4 fehlgeschlagen ✗', 'color: red;');
                                    testsFailed++;
                                }
                                
                                // Testergebnisse ausgeben
                                console.log('%c=== Testergebnisse ===', 'font-size: 16px; font-weight: bold; color: #4285f4;');
                                console.log(`Tests bestanden: ${testsPassed}`);
                                console.log(`Tests fehlgeschlagen: ${testsFailed}`);
                                console.log(`Gesamtergebnis: ${testsPassed === 4 ? 'ALLE TESTS BESTANDEN ✓' : 'EINIGE TESTS FEHLGESCHLAGEN ✗'}`);
                            } catch (error) {
                                console.error('Fehler bei Test 4:', error);
                                testsFailed++;
                            }
                        }, 1000);
                    } catch (error) {
                        console.error('Fehler bei Test 3:', error);
                        testsFailed++;
                    }
                }, 1000);
            }).catch(error => {
                console.error('Fehler bei Test 2:', error);
                testsFailed++;
            });
        }, 1000);
    });
})(); 