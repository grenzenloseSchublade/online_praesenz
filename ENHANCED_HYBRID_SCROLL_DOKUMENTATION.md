# Dokumentation: Verbessertes Hybrides Scroll-System

## Überblick

Das verbesserte hybride Scroll-System löst das Problem des unzuverlässigen Einrastens an Abschnitten, insbesondere bei Nicht-H1-Elementen. Es bietet folgende Verbesserungen:

1. **Zuverlässiges Einrasten** an allen definierten Abschnittstypen (nicht nur H1)
2. **Intelligentere Abschnittserkennung** mit Berücksichtigung der Scroll-Richtung
3. **Dynamische Schwellenwerte** basierend auf Elementtyp und Größe
4. **Verbesserte Debug-Ausgaben** für einfachere Fehlersuche
5. **Optimierte Einrast-Logik** für ein natürlicheres Scroll-Erlebnis

## Hauptverbesserungen

### 1. Verbesserte Abschnittserkennung

Die Funktion `getNearestSection()` wurde grundlegend überarbeitet:

- **Berücksichtigung der Scroll-Richtung**: Abschnitte in der aktuellen Scroll-Richtung werden bevorzugt
- **Bessere Sortierung**: Abschnitte werden nach Nähe zum Viewport-Mittelpunkt sortiert
- **Detaillierte Logging**: Alle gefundenen Abschnitte werden im Debug-Modus ausgegeben

### 2. Dynamische Schwellenwerte

Die Funktion `isNearSection()` verwendet jetzt dynamische Schwellenwerte:

- **Elementtyp-basiert**: Unterschiedliche Schwellenwerte für H1, H2/H3 und andere Überschriften
- **Größenbasiert**: Größere Elemente erhalten einen größeren Einrast-Bereich
- **Konfigurierbar**: Basis-Schwellenwert über `config.snapThreshold` anpassbar

### 3. Zuverlässigeres Einrasten

Die Funktion `snapToNearestSectionIfNeeded()` wurde verbessert:

- **Bessere Fehlerbehandlung**: Robustere Prüfung auf gültige Abschnitte
- **Erzwungenes Einrasten**: Größerer Schwellenwert bei `forceSnap=true`
- **Rückgabewerte**: Gibt `true` zurück, wenn ein Einrasten erfolgt ist

### 4. Optimierte Event-Handler

Alle Event-Handler wurden optimiert:

- **Wheel-Events**: Bessere Erkennung der Scroll-Richtung
- **Touch-Events**: Zuverlässigeres Einrasten nach Touch-Gesten
- **Tastatur-Navigation**: Verbesserte Unterstützung für Tastatur-Scrollen

## Konfigurationsoptionen

Das System bietet folgende Konfigurationsoptionen:

| Option | Beschreibung | Empfohlener Wert |
|--------|-------------|------------------|
| `scrollDuration` | Dauer des Scrollens in Millisekunden | 400 |
| `snapThreshold` | Basis-Schwellenwert für das Einrasten (in % der Viewport-Höhe) | 0.25 |
| `scrollDelay` | Verzögerung nach Scroll-Event in Millisekunden | 100 |
| `minSnapInterval` | Mindestabstand zwischen Snap-Scrolls in Millisekunden | 800 |
| `scrollOffset` | Offset für das Scrollen (in Pixel) | 0 |
| `minSectionHeight` | Mindesthöhe für Abschnitte (in Pixel) | 30 |
| `speedThreshold` | Scroll-Geschwindigkeit-Schwellenwert | 30 |
| `resizeDelay` | Verzögerung für die Aktualisierung der Abschnitte bei Resize-Events | 200 |
| `enabled` | Aktivieren/Deaktivieren des hybriden Scrollings | true |
| `debug` | Debug-Modus aktiviert für Fehlerdiagnose | true |

## Fehlerbehebung

### Problem: Einrasten funktioniert nicht an allen Abschnitten

**Lösung:**
1. Prüfen Sie die Debug-Ausgaben in der Konsole, um zu sehen, welche Abschnitte erkannt werden
2. Erhöhen Sie den `snapThreshold`-Wert (z.B. auf 0.3 oder 0.35)
3. Stellen Sie sicher, dass die Abschnitte die Mindesthöhe (`minSectionHeight`) überschreiten
4. Verwenden Sie `window.hybridScroll.refresh()`, um die Abschnitte neu zu sammeln

### Problem: Einrasten ist zu empfindlich

**Lösung:**
1. Erhöhen Sie den `speedThreshold`-Wert (z.B. auf 40 oder 50)
2. Erhöhen Sie den `minSnapInterval`-Wert (z.B. auf 1000 oder 1200)
3. Verringern Sie den `snapThreshold`-Wert (z.B. auf 0.2 oder 0.15)

### Problem: Einrasten erfolgt zu langsam

**Lösung:**
1. Verringern Sie den `scrollDelay`-Wert (z.B. auf 50 oder 75)
2. Verringern Sie den `scrollDuration`-Wert (z.B. auf 300 oder 350)

## Öffentliche API

Das System bietet eine öffentliche API über das globale `window.hybridScroll`-Objekt:

```javascript
// Konfiguration aktualisieren
window.hybridScroll.updateConfig({
    snapThreshold: 0.3,
    scrollDuration: 350
});

// Scroll-System aktivieren/deaktivieren
window.hybridScroll.enable();
window.hybridScroll.disable();

// Abschnitte aktualisieren
window.hybridScroll.refresh();

// Erzwungenes Einrasten
window.hybridScroll.forceSnap();

// Zu einem Element scrollen
window.hybridScroll.scrollToElement('#ziel-element', {
    offset: 50,
    duration: 500,
    callback: function() {
        console.log('Scroll abgeschlossen');
    }
});
```

## Implementierungshinweise

1. **Einbindung**: Fügen Sie die Datei `enhanced-hybrid-scroll.js` in Ihre HTML-Seite ein
2. **Konfiguration**: Passen Sie die Konfiguration nach Bedarf an
3. **Debugging**: Aktivieren Sie den Debug-Modus, um detaillierte Informationen zu erhalten
4. **Anpassung**: Verwenden Sie die öffentliche API, um das Verhalten anzupassen

## Zusammenfassung der Verbesserungen

Das verbesserte hybride Scroll-System löst das Problem des unzuverlässigen Einrastens durch:

1. **Intelligentere Abschnittserkennung** mit Berücksichtigung der Scroll-Richtung
2. **Dynamische Schwellenwerte** basierend auf Elementtyp und Größe
3. **Verbesserte Debug-Ausgaben** für einfachere Fehlersuche
4. **Optimierte Einrast-Logik** für ein natürlicheres Scroll-Erlebnis
5. **Zuverlässigeres Einrasten** an allen definierten Abschnittstypen 