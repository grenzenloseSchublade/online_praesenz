# Dokumentation: Hybrides Scroll-System

## Überblick

Das hybride Scroll-System bietet eine Kombination aus normalem Scrollverhalten und einem "Einrast"-Mechanismus für Abschnitte. Es ermöglicht:

1. **Normales Scrollen** innerhalb von Abschnitten
2. **Automatisches Einrasten** an Abschnittsgrenzen, wenn man sich in deren Nähe befindet
3. **Sanfte Übergänge** zwischen normalem Scrollen und dem Einrasten
4. **Koordination mit der Navigationsleiste** für ein konsistentes Benutzererlebnis
5. **Erzwungenes Einrasten** in bestimmten Situationen für eine zuverlässige Ausrichtung

Im Gegensatz zum vorherigen Scroll-System, das das Standard-Scrollverhalten vollständig überschrieben hat, erlaubt dieses hybride System ein natürlicheres Scrollen mit zusätzlicher Unterstützung für das Einrasten an wichtigen Abschnitten.

## Funktionsweise

Das System funktioniert nach folgenden Prinzipien:

1. **Normales Scrollen bleibt erhalten**: Das Standard-Scrollverhalten des Browsers wird nicht überschrieben.
2. **Geschwindigkeitsbasiertes Einrasten**: Wenn die Scroll-Geschwindigkeit unter einen bestimmten Schwellenwert fällt und man sich in der Nähe eines Abschnitts befindet, wird automatisch zu diesem Abschnitt gescrollt.
3. **Nähe-basiertes Einrasten**: Wenn man sich innerhalb eines konfigurierbaren Schwellenwerts zu einem Abschnitt befindet, wird zu diesem Abschnitt gescrollt.
4. **Ausschluss bestimmter Elemente**: Innerhalb bestimmter Elemente (z.B. Code-Blöcke, Textfelder) wird das Einrasten deaktiviert, um normales Scrollen zu ermöglichen.
5. **Koordination mit der Navigationsleiste**: Bei programmatischen Scrolls wird die Navigationsleiste entsprechend ein- oder ausgeblendet.
6. **Erzwungenes Einrasten**: In bestimmten Situationen (Seitenladung, Resize, DOM-Änderungen, Ende des Scrollens) wird das Einrasten erzwungen, um eine zuverlässige Ausrichtung zu gewährleisten.

## Benutzerfreundliches Einrasten und Locken

Das hybride Scroll-System wurde speziell entwickelt, um ein benutzerfreundliches Einrasten zu ermöglichen, das sich natürlich anfühlt und nicht störend wirkt:

### Intelligentes Einrasten

1. **Geschwindigkeitsbasierte Entscheidung**: 
   - Das System rastet nur ein, wenn die Scroll-Geschwindigkeit unter einem bestimmten Schwellenwert liegt (standardmäßig 30 Pixel/s).
   - Bei schnellem Scrollen wird das Einrasten deaktiviert, sodass Benutzer schnell durch die Seite scrollen können.
   - Bei langsamem Scrollen oder beim Anhalten wird das Einrasten aktiviert, um präzise Navigation zu ermöglichen.

2. **Nähe-basierte Entscheidung**:
   - Das Einrasten erfolgt nur, wenn man sich in der Nähe eines Abschnitts befindet (standardmäßig 25% der Viewport-Höhe).
   - Je näher man an einem Abschnitt ist, desto wahrscheinlicher ist das Einrasten.
   - Für Überschriften (H1, H2, H3) wird ein größerer Einrast-Bereich verwendet, da diese oft wichtige Navigationspunkte sind.

3. **Zeitbasierte Begrenzung**:
   - Ein Mindestintervall zwischen Einrast-Vorgängen (standardmäßig 800ms) verhindert zu häufiges Einrasten.
   - Dies sorgt für ein ruhigeres Scroll-Erlebnis ohne ständige Unterbrechungen.

### Erzwungenes Einrasten

Das System erzwingt das Einrasten in folgenden Situationen:

1. **Nach dem Laden der Seite**:
   - Sicherstellt, dass die Seite immer an einem Abschnitt ausgerichtet ist, wenn sie geladen wird.

2. **Nach dem Beenden des Scrollens**:
   - Wenn die Scroll-Geschwindigkeit sehr niedrig wird (< 5 Pixel/s), wird das Einrasten erzwungen.
   - Dies hilft, wenn der Benutzer das Scrollen beendet hat und die Seite an einem Abschnitt ausgerichtet werden soll.

3. **Nach Änderung der Fenstergröße**:
   - Sicherstellt, dass die Seite nach einer Größenänderung des Fensters an einem Abschnitt ausgerichtet ist.

4. **Nach DOM-Änderungen**:
   - Wenn dynamische Inhalte hinzugefügt oder entfernt werden, wird das Einrasten erzwungen.
   - Dies sorgt für eine konsistente Ausrichtung auch bei dynamischen Inhalten.

5. **Nach Klick auf einen Link**:
   - Sicherstellt, dass die Seite nach der Navigation an einem Abschnitt ausgerichtet ist.

6. **Manuell über die API**:
   - Entwickler können das Einrasten manuell über `window.hybridScroll.forceSnap()` erzwingen.

### Sanfte Übergänge

1. **Weiche Animation**:
   - Das Einrasten erfolgt mit einer sanften Animation (standardmäßig 400ms).
   - Eine kubische Easing-Funktion sorgt für natürliches Beschleunigen und Abbremsen.
   - Die Animation ist kurz genug, um nicht störend zu wirken, aber lang genug, um flüssig zu erscheinen.

2. **Kontextsensitives Verhalten**:
   - In bestimmten Bereichen (Code-Blöcke, Textfelder, Inhaltsverzeichnis) wird das Einrasten deaktiviert.
   - Dies ermöglicht normales Scrollen in Bereichen, wo präzises Scrollen wichtig ist.

### Koordination mit der Navigationsleiste

1. **Synchronisierte Bewegung**:
   - Bei jedem automatischen Einrasten wird die Navigationsleiste über die Scroll-Richtung informiert.
   - Die Navigationsleiste passt ihr Verhalten entsprechend an (ausblenden bei Abwärts-Scroll, einblenden bei Aufwärts-Scroll).
   - Dies sorgt für ein konsistentes Benutzererlebnis, unabhängig davon, ob der Scroll manuell oder automatisch erfolgt.

2. **Nahtlose Integration**:
   - Die Kommunikation erfolgt über benutzerdefinierte Events, die Zeitstempel enthalten.
   - Dies ermöglicht eine präzise Synchronisation zwischen Scroll-System und Navigationsleiste.
   - Beide Komponenten verwenden ähnliche Animationskurven für ein harmonisches Gesamterlebnis.

## Konfigurationsoptionen

Das Scroll-System bietet folgende Konfigurationsoptionen:

| Option | Beschreibung | Empfohlene Werte | Auswirkung auf das Einrasten |
|--------|-------------|------------------|---------------------------|
| `scrollDuration` | Dauer des Scrollens in Millisekunden | 300-800 | Längere Dauer = sanfteres Einrasten, aber langsamere Reaktion |
| `snapThreshold` | Schwellenwert für das Einrasten (in % der Viewport-Höhe) | 0.15-0.3 | Höherer Wert = größerer Einrast-Bereich, aber potenziell unerwünschtes Einrasten |
| `scrollDelay` | Verzögerung nach Scroll-Event in Millisekunden | 50-200 | Höherer Wert = weniger häufiges Einrasten, aber verzögerte Reaktion |
| `minSnapInterval` | Mindestabstand zwischen Snap-Scrolls in Millisekunden | 500-1000 | Höherer Wert = weniger häufiges Einrasten, aber natürlicheres Gefühl |
| `scrollOffset` | Offset für das Scrollen (in Pixel) | 0-100 | Höherer Wert = mehr Abstand zum oberen Rand, besser für Seiten mit fixiertem Header |
| `minSectionHeight` | Mindesthöhe für Abschnitte (in Pixel) | 20-50 | Höherer Wert = weniger kleine Abschnitte werden erkannt |
| `speedThreshold` | Scroll-Geschwindigkeit-Schwellenwert | 30-50 | Höherer Wert = Einrasten auch bei schnellerem Scrollen, aber potenziell störender |
| `resizeDelay` | Verzögerung für die Aktualisierung der Abschnitte bei Resize-Events | 100-500 | Höherer Wert = bessere Performance, aber verzögerte Anpassung bei Größenänderungen |
| `enabled` | Aktivieren/Deaktivieren des hybriden Scrollings | true/false | Bei false wird das System vollständig deaktiviert |
| `sections` | Array von CSS-Selektoren für Abschnitte | - | Mehr Selektoren = mehr Einrast-Punkte |
| `excludedElements` | Array von CSS-Selektoren für ausgeschlossene Elemente | - | Mehr Selektoren = mehr Bereiche ohne Einrasten |

## Anpassung der Konfiguration

Sie können die Konfiguration des Scroll-Systems nach dem Laden der Seite anpassen:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Konfiguration anpassen
    window.hybridScroll.updateConfig({
      snapThreshold: 0.25,        // Schwellenwert für das Einrasten (25% der Viewport-Höhe)
      scrollDuration: 400,        // Scroll-Dauer in Millisekunden
      scrollOffset: 50,           // Offset für fixierte Header
      speedThreshold: 30          // Geschwindigkeitsschwellenwert für das Einrasten
    });
  });
</script>
```

Diese Anpassungen können Sie in der Datei `_includes/head/custom.html` vornehmen.

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

// Erzwungenes Einrasten zum nächsten Abschnitt
window.hybridScroll.forceSnap();

// Zu einem bestimmten Element scrollen
window.hybridScroll.scrollToElement('#ziel-element', {
  offset: 60,           // Optionaler benutzerdefinierter Offset
  duration: 600,        // Optionale benutzerdefinierte Dauer
  callback: function() { // Optionaler Callback nach Abschluss
    console.log('Scroll abgeschlossen');
  }
});
```

## Interaktion mit der Navigationsleiste

Das hybride Scroll-System wurde speziell angepasst, um mit der automatisch ein- und ausblendenden Navigationsleiste zu interagieren:

### Kommunikationsmechanismus

1. **Event-basierte Kommunikation**: 
   - Das Scroll-System sendet ein benutzerdefiniertes Event (`hybridScroll`) an das Fenster.
   - Dieses Event enthält Informationen über die Scroll-Richtung und ob es sich um einen programmatischen Scroll handelt.
   - Die Navigationsleiste hört auf dieses Event und passt ihr Verhalten entsprechend an.

2. **Zeitstempel für Synchronisation**:
   - Jedes Event enthält einen Zeitstempel, der eine präzise Synchronisation ermöglicht.
   - Dies verhindert Probleme mit verzögerten oder veralteten Events.

### Verhalten der Navigationsleiste

1. **Richtungsbasiertes Verhalten**:
   - Bei Scrolls nach unten wird die Navigationsleiste ausgeblendet, um mehr Platz für den Inhalt zu schaffen.
   - Bei Scrolls nach oben wird die Navigationsleiste eingeblendet, um die Navigation zu erleichtern.
   - Dieses Verhalten ist konsistent, unabhängig davon, ob der Scroll manuell oder automatisch erfolgt.

2. **Inaktivitäts-Erkennung**:
   - Nach einer bestimmten Zeit ohne Scroll-Aktivität wird die Navigationsleiste automatisch eingeblendet.
   - Dies sorgt dafür, dass die Navigation immer verfügbar ist, wenn der Benutzer sie benötigt.

### Implementierungsdetails

1. **Benachrichtigung bei programmatischen Scrolls**:
   - Vor jedem automatischen Scroll (z.B. beim Einrasten oder bei Tastatur-Navigation) wird die Navigationsleiste benachrichtigt.
   - Die Funktion `notifyMasthead(direction)` sendet das Event mit der entsprechenden Richtung.

2. **Event-Verarbeitung in der Navigationsleiste**:
   - Die Navigationsleiste hört auf das `hybridScroll`-Event und prüft, ob es sich um einen programmatischen Scroll handelt.
   - Basierend auf der Richtung wird die Navigationsleiste ein- oder ausgeblendet.
   - Die Animation erfolgt mit CSS-Transitions für flüssige Übergänge.

## Fehlerbehebung

### Das Einrasten funktioniert nicht

- Prüfen Sie, ob das Skript korrekt eingebunden ist
- Prüfen Sie, ob die Selektoren in der `sections`-Konfiguration korrekt sind
- Erhöhen Sie den `snapThreshold`-Wert, um den Einrast-Bereich zu vergrößern
- Prüfen Sie die Browser-Konsole auf JavaScript-Fehler
- Verwenden Sie `window.hybridScroll.forceSnap()`, um das Einrasten manuell zu erzwingen

### Das Scrollen ist zu empfindlich

- Erhöhen Sie den `scrollDelay`-Wert (z.B. auf 200ms)
- Erhöhen Sie den `minSnapInterval`-Wert (z.B. auf 1000ms)
- Erhöhen Sie den `speedThreshold`-Wert (z.B. auf 40)
- Verringern Sie den `snapThreshold`-Wert (z.B. auf 0.1)

### Die Navigationsleiste verhält sich nicht wie erwartet

- Prüfen Sie, ob die Navigationsleiste auf das `hybridScroll`-Event hört
- Prüfen Sie, ob die CSS-Transitions für die Navigationsleiste korrekt definiert sind
- Stellen Sie sicher, dass die Navigationsleiste die Klassen `masthead--visible` und `masthead--hidden` korrekt verarbeitet

### Konflikte mit anderen Skripten

- Stellen Sie sicher, dass das alte Scroll-System entfernt wurde
- Prüfen Sie, ob andere Skripte das Scroll-Verhalten beeinflussen
- Verwenden Sie die `excludedElements`-Konfiguration, um Konflikte zu vermeiden

### Dynamische Inhalte werden nicht erkannt

- Rufen Sie `window.hybridScroll.refresh()` auf, nachdem Sie dynamische Inhalte hinzugefügt haben
- Prüfen Sie, ob der MutationObserver korrekt funktioniert
- Verwenden Sie `window.hybridScroll.forceSnap()` nach dem Hinzufügen von Inhalten

## Verbesserungen gegenüber dem alten System

1. **Normales Scrollen innerhalb von Abschnitten** ist jetzt möglich
2. **Automatisches Einrasten** nur bei langsamer Scroll-Geschwindigkeit
3. **Verbesserte Fehlerbehandlung** für robustere Funktionalität
4. **Unterstützung für dynamische Inhalte** durch MutationObserver
5. **Performance-Optimierungen** durch Debouncing und passive Event-Listener
6. **Konsistente Interaktion mit der Navigationsleiste** für ein harmonisches Gesamterlebnis
7. **Erweiterte öffentliche API** mit zusätzlichen Funktionen wie `scrollToElement` und `forceSnap`
8. **Erzwungenes Einrasten** in bestimmten Situationen für eine zuverlässige Ausrichtung 