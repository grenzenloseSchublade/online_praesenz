# Implementierungsanleitung

Diese Anleitung beschreibt die Schritte zur Implementierung des verbesserten Hybrid-Scroll-Systems und der Smart Masthead Scroll-Komponente.

## Teil 1: Verbessertes Hybrid-Scroll-System

### Schritt 1: Dateien einrichten

1. Sichern Sie zunächst die alte Implementierung:
   ```bash
   cp assets/js/hybrid-section-scroll.js assets/js/hybrid-section-scroll.js.backup
   ```

2. Kopieren Sie die neue Implementierung:
   ```bash
   # Hauptdatei
   cp enhanced-hybrid-scroll.js assets/js/enhanced-hybrid-scroll.js
   
   # Dokumentation
   cp ENHANCED_HYBRID_SCROLL_DOKUMENTATION.md docs/
   ```

### Schritt 2: Konfiguration anpassen

Bearbeiten Sie die `_config.yml` Datei, um das neue Scroll-Skript einzubinden:

```yaml
# Alte Zeile
# - /assets/js/hybrid-section-scroll.js

# Neue Zeile
- /assets/js/enhanced-hybrid-scroll.js
```

### Schritt 3: Testen der Implementierung

1. **Optional:** Fügen Sie das Test-Skript hinzu, um die Funktionalität zu überprüfen:
   ```yaml
   # In _config.yml unter footer_scripts hinzufügen
   - /assets/js/test-hybrid-scroll.js
   ```

2. **Manuelles Testen:**
   - Öffnen Sie die Website und scrollen Sie durch verschiedene Abschnitte
   - Prüfen Sie, ob das Snapping zu allen definierten Abschnittstypen funktioniert
   - Testen Sie verschiedene Geräte und Browser

3. **Konfiguration anpassen (falls nötig):**
   - Öffnen Sie die Browser-Konsole (F12)
   - Passen Sie die Konfiguration an:
     ```javascript
     window.hybridScroll.updateConfig({
       snapThreshold: 0.3,  // Anpassen nach Bedarf
       scrollDuration: 400  // Anpassen nach Bedarf
     });
     ```

### Schritt 4: Fehlerbehebung

Falls Probleme auftreten:

1. **Debug-Modus aktivieren:**
   ```javascript
   window.hybridScroll.updateConfig({ debug: true });
   ```

2. **Sektionen manuell aktualisieren:**
   ```javascript
   window.hybridScroll.refreshSections();
   ```

3. **Zurück zur alten Implementierung (falls nötig):**
   ```bash
   mv assets/js/hybrid-section-scroll.js.backup assets/js/hybrid-section-scroll.js
   ```
   Und in `_config.yml` die entsprechenden Zeilen anpassen.

### Schritt 5: Feinabstimmung

Nach erfolgreicher Implementierung können Sie die Konfiguration weiter optimieren:

```javascript
window.hybridScroll.updateConfig({
  snapThreshold: 0.25,        // Schwellenwert für Snapping
  scrollDuration: 500,        // Dauer der Animation
  wheelMultiplier: 0.8,       // Multiplikator für Mausrad-Ereignisse
  keyboardMultiplier: 30,     // Multiplikator für Tastatur-Ereignisse
  touchMultiplier: 1.2        // Multiplikator für Touch-Ereignisse
});
```

## Teil 2: Smart Masthead Scroll-Komponente

### Schritt 1: Dateien einrichten

1. Kopieren Sie die Smart Masthead Scroll-Komponente:
   ```bash
   # Hauptdatei
   cp smart-masthead-scroll.js assets/js/smart-masthead-scroll.js
   
   # Dokumentation
   cp SMART_MASTHEAD_SCROLL_DOKUMENTATION.md docs/
   ```

### Schritt 2: Konfiguration anpassen

Bearbeiten Sie die `_config.yml` Datei, um die Smart Masthead Scroll-Komponente einzubinden:

```yaml
footer_scripts:
  - https://code.jquery.com/jquery-3.6.0.min.js
  - /assets/js/main.min.js
  - /assets/js/enhanced-hybrid-scroll.js
  - /assets/js/smart-masthead-scroll.js  # Neue Zeile
```

### Schritt 3: CSS-Anpassungen

Stellen Sie sicher, dass Ihre Navigationsleiste die richtigen CSS-Klassen verwendet:

1. Überprüfen Sie, ob die Navigationsleiste die Klasse `.masthead` hat.
2. Fügen Sie die folgenden CSS-Stile hinzu oder passen Sie sie an:

```css
/* In Ihrer CSS-Datei */
.masthead {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.masthead--visible {
  transform: translateY(0);
}

.masthead--hidden {
  transform: translateY(-100%);
}
```

### Schritt 4: Testen der Implementierung

1. **Optional:** Fügen Sie das Test-Skript hinzu, um die Funktionalität zu überprüfen:
   ```yaml
   # In _config.yml unter footer_scripts hinzufügen
   - /assets/js/test-smart-masthead-scroll.js
   ```

2. **Manuelles Testen:**
   - Öffnen Sie die Website und scrollen Sie nach oben und unten
   - Prüfen Sie, ob die Navigationsleiste korrekt ein- und ausgeblendet wird
   - Achten Sie darauf, ob die Seite um die Höhe der Navigationsleiste scrollt

3. **Konfiguration anpassen (falls nötig):**
   - Öffnen Sie die Browser-Konsole (F12)
   - Passen Sie die Konfiguration an:
     ```javascript
     window.smartMastheadScroll.updateConfig({
       animationDuration: 250,     // Schnellere Animation
       scrollThreshold: 15,        // Höherer Schwellenwert
       mastheadSelector: '.your-masthead-class'  // Falls Sie einen anderen Selektor verwenden
     });
     ```

### Schritt 5: Fehlerbehebung

Falls Probleme auftreten:

1. **Debug-Modus aktivieren:**
   ```javascript
   window.smartMastheadScroll.updateConfig({ debug: true });
   ```

2. **Masthead-Höhe manuell aktualisieren:**
   ```javascript
   window.smartMastheadScroll.updateMastheadHeight();
   ```

3. **Komponente deaktivieren (falls nötig):**
   ```javascript
   window.smartMastheadScroll.disable();
   ```

### Schritt 6: Feinabstimmung

Nach erfolgreicher Implementierung können Sie die Konfiguration weiter optimieren:

```javascript
window.smartMastheadScroll.updateConfig({
  animationDuration: 300,     // Dauer der Animation
  scrollThreshold: 10,        // Schwellenwert für Scroll-Erkennung
  debounceDelay: 50,          // Verzögerung für Debouncing
  offsetTolerance: 5          // Toleranz für Offset-Berechnungen
});
```

## Zusammenfassung

Mit diesen Schritten haben Sie erfolgreich das verbesserte Hybrid-Scroll-System und die Smart Masthead Scroll-Komponente implementiert. Diese Verbesserungen bieten:

1. **Zuverlässigeres Snapping** zu allen definierten Abschnittstypen
2. **Natürlicheres Scroll-Erlebnis** mit optimierten Schwellenwerten
3. **Intelligentes Navigationsleisten-Verhalten**, das den Bildschirmplatz maximiert

Weitere Details finden Sie in den Dokumentationsdateien:
- `ENHANCED_HYBRID_SCROLL_DOKUMENTATION.md`
- `SMART_MASTHEAD_SCROLL_DOKUMENTATION.md`

Bei Fragen oder Problemen konsultieren Sie die Fehlerbehebungsabschnitte oder wenden Sie sich an den Support. 