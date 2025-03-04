# Hybrides Section-Scrolling

Dieses Dokument erklärt die Funktionsweise und Integration des hybriden Section-Scrolling-Systems.

## Überblick

Das hybride Scroll-System bietet eine Kombination aus normalem Scrollverhalten und einem "Einrast"-Mechanismus für Abschnitte. Es ermöglicht:

1. **Normales Scrollen** innerhalb von Abschnitten
2. **Automatisches Einrasten** an Abschnittsgrenzen, wenn man sich in deren Nähe befindet
3. **Sanfte Übergänge** zwischen normalem Scrollen und dem Einrasten

Im Gegensatz zum vorherigen Scroll-System (`smooth-section-scroll.js`), das das Standard-Scrollverhalten vollständig überschrieben hat, erlaubt dieses hybride System ein natürlicheres Scrollen mit zusätzlicher Unterstützung für das Einrasten an wichtigen Abschnitten.

## Funktionsweise

Das System funktioniert nach folgenden Prinzipien:

1. **Normales Scrollen bleibt erhalten**: Das Standard-Scrollverhalten des Browsers wird nicht überschrieben.
2. **Geschwindigkeitsbasiertes Einrasten**: Wenn die Scroll-Geschwindigkeit unter einen bestimmten Schwellenwert fällt und man sich in der Nähe eines Abschnitts befindet, wird automatisch zu diesem Abschnitt gescrollt.
3. **Nähe-basiertes Einrasten**: Wenn man sich innerhalb eines konfigurierbaren Schwellenwerts zu einem Abschnitt befindet, wird zu diesem Abschnitt gescrollt.
4. **Ausschluss bestimmter Elemente**: Innerhalb bestimmter Elemente (z.B. Code-Blöcke, Textfelder) wird das Einrasten deaktiviert, um normales Scrollen zu ermöglichen.

## Integration in die Website

### 1. Einbinden des Skripts

Fügen Sie das Skript in Ihre HTML-Seite ein:

```html
<script src="assets/js/hybrid-section-scroll.js"></script>
```

Idealerweise sollte das Skript vor dem schließenden `</body>`-Tag eingefügt werden.

### 2. Entfernen des alten Scroll-Skripts

Wenn Sie das vorherige Scroll-System (`smooth-section-scroll.js`) verwenden, entfernen Sie es aus Ihrer HTML-Seite, um Konflikte zu vermeiden.

### 3. Anpassung der Konfiguration (optional)

Sie können die Konfiguration des Scroll-Systems nach dem Laden der Seite anpassen:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Konfiguration anpassen
    window.hybridScroll.updateConfig({
      snapThreshold: 0.15,        // Schwellenwert für das Einrasten (15% der Viewport-Höhe)
      scrollDuration: 400,        // Scroll-Dauer in Millisekunden
      scrollOffset: 50,           // Offset für fixierte Header
      speedThreshold: 40          // Geschwindigkeitsschwellenwert für das Einrasten
    });
  });
</script>
```

## Konfigurationsoptionen

Das Scroll-System bietet folgende Konfigurationsoptionen:

| Option | Beschreibung | Empfohlene Werte |
|--------|-------------|------------------|
| `scrollDuration` | Dauer des Scrollens in Millisekunden | 300-800 |
| `snapThreshold` | Schwellenwert für das Einrasten (in % der Viewport-Höhe) | 0.15-0.3 |
| `scrollDelay` | Verzögerung nach Scroll-Event in Millisekunden | 50-200 |
| `minSnapInterval` | Mindestabstand zwischen Snap-Scrolls in Millisekunden | 500-1000 |
| `scrollOffset` | Offset für das Scrollen (in Pixel) | 0-100 |
| `minSectionHeight` | Mindesthöhe für Abschnitte (in Pixel) | 20-50 |
| `speedThreshold` | Scroll-Geschwindigkeit-Schwellenwert | 50-100 |
| `enabled` | Aktivieren/Deaktivieren des hybriden Scrollings | true/false |
| `sections` | Array von CSS-Selektoren für Abschnitte | - |
| `excludedElements` | Array von CSS-Selektoren für ausgeschlossene Elemente | - |

## Öffentliche API

Das Scroll-System bietet eine öffentliche API über das globale `window.hybridScroll`-Objekt:

```javascript
// Aktivieren des Scroll-Systems
window.hybridScroll.enable();

// Deaktivieren des Scroll-Systems
window.hybridScroll.disable();

// Aktualisieren der Abschnitte (z.B. nach DOM-Änderungen)
window.hybridScroll.refresh();

// Aktuelle Konfiguration abrufen
const config = window.hybridScroll.getConfig();

// Konfiguration aktualisieren
window.hybridScroll.updateConfig({
  snapThreshold: 0.25,
  scrollDuration: 500
});
```

## Unterschiede zum vorherigen Scroll-System

| Funktion | Vorheriges System | Hybrides System |
|----------|-------------------|-----------------|
| Standard-Scrollverhalten | Überschrieben | Beibehalten |
| Scrollen innerhalb von Abschnitten | Nicht möglich | Möglich |
| Einrasten an Abschnitten | Immer | Nur bei langsamer Geschwindigkeit und Nähe |
| Ausschluss bestimmter Elemente | Ja | Ja |
| Tastatur-Navigation | Ja | Ja |
| Touch-Unterstützung | Ja | Ja |

## Fehlerbehebung

### Das Einrasten funktioniert nicht

- Prüfen Sie, ob das Skript korrekt eingebunden ist
- Prüfen Sie, ob die Selektoren in der `sections`-Konfiguration korrekt sind
- Erhöhen Sie den `snapThreshold`-Wert, um den Einrast-Bereich zu vergrößern

### Das Scrollen ist zu empfindlich

- Erhöhen Sie den `scrollDelay`-Wert
- Erhöhen Sie den `minSnapInterval`-Wert
- Erhöhen Sie den `speedThreshold`-Wert

### Konflikte mit anderen Skripten

- Stellen Sie sicher, dass das alte Scroll-System entfernt wurde
- Prüfen Sie, ob andere Skripte das Scroll-Verhalten beeinflussen
- Verwenden Sie die `excludedElements`-Konfiguration, um Konflikte zu vermeiden 