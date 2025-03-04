# Dokumentation: Smart Masthead Scroll

## Überblick

Die Smart Masthead Scroll-Komponente implementiert ein intelligentes Scroll-Verhalten für die Navigationsleiste (Masthead). Wenn der Benutzer scrollt, wird die Navigationsleiste ein- oder ausgeblendet, und die Seite scrollt nur um die Höhe der Navigationsleiste, um einen nahtlosen Übergang zu ermöglichen.

Dies erzeugt den Eindruck, dass man die Navigationsleiste "auf- oder zuscrollt", unabhängig davon, wo man sich auf der Seite befindet.

## Funktionsweise

Die Komponente funktioniert nach folgenden Prinzipien:

1. **Erkennung der Scroll-Richtung**: Die Komponente erkennt, ob der Benutzer nach oben oder nach unten scrollt.

2. **Anpassung der Navigationsleiste**: 
   - Bei Scroll nach unten wird die Navigationsleiste ausgeblendet.
   - Bei Scroll nach oben wird die Navigationsleiste eingeblendet.

3. **Anpassung der Scroll-Position**:
   - Wenn die Navigationsleiste ausgeblendet wird, scrollt die Seite automatisch um die Höhe der Navigationsleiste nach unten.
   - Wenn die Navigationsleiste eingeblendet wird, scrollt die Seite automatisch um die Höhe der Navigationsleiste nach oben.

4. **Nahtloser Übergang**: Die Anpassung der Scroll-Position erfolgt mit einer sanften Animation, die mit der Animation der Navigationsleiste synchronisiert ist.

## Vorteile

1. **Verbesserte Benutzererfahrung**: Der Benutzer verliert nie den Kontext, da der Inhalt immer an der gleichen Position bleibt.

2. **Maximale Bildschirmnutzung**: Die Navigationsleiste wird nur angezeigt, wenn sie benötigt wird, was mehr Platz für den Inhalt lässt.

3. **Nahtlose Integration**: Die Komponente arbeitet unabhängig vom Hybrid-Scroll-System und kann mit jeder Website verwendet werden.

## Konfigurationsoptionen

Die Komponente bietet folgende Konfigurationsoptionen:

| Option | Beschreibung | Standardwert |
|--------|-------------|--------------|
| `scrollThreshold` | Mindestscroll-Distanz, um eine Aktion auszulösen | 10 |
| `animationDuration` | Dauer der Animation in Millisekunden | 300 |
| `debounceDelay` | Verzögerung für Debouncing in Millisekunden | 50 |
| `offsetTolerance` | Toleranz für Offset-Berechnungen in Pixeln | 5 |
| `enabled` | Aktivieren/Deaktivieren der Komponente | true |
| `debug` | Debug-Modus aktiviert für Fehlerdiagnose | true |
| `mastheadSelector` | Selektor für die Navigationsleiste | '.masthead' |
| `visibleClass` | Klasse für sichtbare Navigationsleiste | 'masthead--visible' |
| `hiddenClass` | Klasse für ausgeblendete Navigationsleiste | 'masthead--hidden' |

## Implementierung

### 1. Einbinden der Komponente

Fügen Sie die Datei `smart-masthead-scroll.js` in Ihre HTML-Seite ein:

```html
<script src="/assets/js/smart-masthead-scroll.js"></script>
```

Oder fügen Sie sie in Ihre `_config.yml` ein:

```yaml
footer_scripts:
  - https://code.jquery.com/jquery-3.6.0.min.js
  - /assets/js/main.min.js
  - /assets/js/enhanced-hybrid-scroll.js
  - /assets/js/smart-masthead-scroll.js
```

### 2. Anpassen der Konfiguration (optional)

Sie können die Konfiguration der Komponente nach dem Laden der Seite anpassen:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (window.smartMastheadScroll) {
        window.smartMastheadScroll.updateConfig({
            animationDuration: 250,     // Schnellere Animation
            debug: false                // Debug-Modus deaktivieren für Produktionsumgebung
        });
    }
});
```

## Öffentliche API

Die Komponente bietet eine öffentliche API über das globale `window.smartMastheadScroll`-Objekt:

```javascript
// Konfiguration aktualisieren
window.smartMastheadScroll.updateConfig({
    animationDuration: 250,
    debug: false
});

// Aktuelle Konfiguration abrufen
const config = window.smartMastheadScroll.getConfig();

// Komponente aktivieren/deaktivieren
window.smartMastheadScroll.enable();
window.smartMastheadScroll.disable();

// Masthead-Höhe aktualisieren/abrufen
window.smartMastheadScroll.updateMastheadHeight();
const height = window.smartMastheadScroll.getMastheadHeight();
```

## Fehlerbehebung

### Problem: Navigationsleiste wird nicht korrekt ein- oder ausgeblendet

**Lösung:**
1. Prüfen Sie, ob die Selektoren und Klassen korrekt sind:
   ```javascript
   window.smartMastheadScroll.updateConfig({
       mastheadSelector: '.your-masthead-class',
       visibleClass: 'your-visible-class',
       hiddenClass: 'your-hidden-class'
   });
   ```

2. Aktivieren Sie den Debug-Modus, um detaillierte Informationen zu erhalten:
   ```javascript
   window.smartMastheadScroll.updateConfig({ debug: true });
   ```

### Problem: Scroll-Anpassung ist zu schnell oder zu langsam

**Lösung:**
Passen Sie die Animation an:
```javascript
window.smartMastheadScroll.updateConfig({
    animationDuration: 400  // Längere Animation für sanfteren Übergang
});
```

### Problem: Scroll-Anpassung ist zu empfindlich

**Lösung:**
Erhöhen Sie den Scroll-Schwellenwert:
```javascript
window.smartMastheadScroll.updateConfig({
    scrollThreshold: 20  // Höherer Schwellenwert für weniger empfindliches Verhalten
});
```

## Kompatibilität mit dem Hybrid-Scroll-System

Die Smart Masthead Scroll-Komponente wurde so entwickelt, dass sie unabhängig vom Hybrid-Scroll-System funktioniert. Sie können beide Komponenten gleichzeitig verwenden, ohne dass es zu Konflikten kommt.

Die Komponente kommuniziert nicht direkt mit dem Hybrid-Scroll-System, sondern überwacht und modifiziert nur das Scroll-Verhalten der Seite, wenn die Navigationsleiste ein- oder ausgeblendet wird.

## Zusammenfassung

Die Smart Masthead Scroll-Komponente bietet ein intelligentes Scroll-Verhalten für die Navigationsleiste, das die Benutzererfahrung verbessert und mehr Platz für den Inhalt schafft. Durch die Anpassung der Scroll-Position beim Ein- und Ausblenden der Navigationsleiste entsteht ein nahtloser Übergang, der den Eindruck erweckt, dass man die Navigationsleiste "auf- oder zuscrollt". 