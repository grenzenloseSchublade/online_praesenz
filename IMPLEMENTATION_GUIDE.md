# Implementierungsanleitung: Hybrides Scroll-System

Diese Anleitung beschreibt, wie das neue hybride Scroll-System in die Website integriert werden kann.

## Schritt 1: Konfigurationsdatei anpassen

Öffnen Sie die Datei `_config.yml` und ersetzen Sie den Eintrag für das alte Scroll-Skript mit dem neuen:

```yaml
# Scripts, die am Ende der Seite geladen werden
footer_scripts:
  - https://code.jquery.com/jquery-3.6.0.min.js
  - /assets/js/main.min.js
  - /assets/js/hybrid-section-scroll.js  # Hier das neue Skript einbinden
```

## Schritt 2: Altes Skript deaktivieren (Optional)

Wenn Sie das alte Skript nicht vollständig entfernen möchten, können Sie es umbenennen oder in einem Backup-Ordner speichern:

```bash
# Option 1: Umbenennen
mv assets/js/smooth-section-scroll.js assets/js/smooth-section-scroll.js.bak

# Option 2: In Backup-Ordner verschieben
mkdir -p assets/js/backup
mv assets/js/smooth-section-scroll.js assets/js/backup/
```

## Schritt 3: Testen und Anpassen

Nach der Implementierung sollten Sie das Scrollverhalten auf verschiedenen Seiten testen und bei Bedarf die Konfiguration anpassen.

### Konfiguration anpassen

Sie können die Konfiguration des hybriden Scroll-Systems direkt in der Datei `assets/js/hybrid-section-scroll.js` anpassen oder über JavaScript nach dem Laden der Seite:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Konfiguration anpassen
    window.hybridScroll.updateConfig({
      snapThreshold: 0.15,        // Schwellenwert für das Einrasten (15% der Viewport-Höhe)
      scrollDuration: 400,        // Scroll-Dauer in Millisekunden
      scrollOffset: 50,           // Offset für fixierte Header
      speedThreshold: 40          // Geschwindigkeits-schwellenwert für das Einrasten
    });
  });
</script>
```

Diese Anpassungen können Sie in der Datei `_includes/head/custom.html` vornehmen.

## Schritt 4: Fehlerbehebung

Wenn das Scroll-System nicht wie erwartet funktioniert, überprüfen Sie Folgendes:

1. **Konsole auf Fehler prüfen**: Öffnen Sie die Browser-Konsole (F12) und prüfen Sie, ob JavaScript-Fehler auftreten.

2. **Debug-Modus aktivieren**: Setzen Sie in der Datei `assets/js/hybrid-section-scroll.js` die Variable `DEBUG` auf `true`, um detaillierte Debug-Informationen in der Konsole zu sehen:

   ```javascript
   // Debug-Modus: auf true setzen für Entwicklungsumgebung
   const DEBUG = true;
   ```

3. **Abschnitte überprüfen**: Stellen Sie sicher, dass die Selektoren in der `sections`-Konfiguration korrekt sind und die gewünschten Elemente auf der Seite gefunden werden.

4. **Ausgeschlossene Elemente prüfen**: Überprüfen Sie, ob die Selektoren in der `excludedElements`-Konfiguration korrekt sind.

## Schritt 5: Deaktivieren des Scroll-Systems (bei Bedarf)

Wenn Sie das Scroll-System temporär deaktivieren möchten, können Sie dies über die öffentliche API tun:

```javascript
// Deaktivieren des Scroll-Systems
window.hybridScroll.disable();

// Später wieder aktivieren
window.hybridScroll.enable();
```

## Zusammenfassung der Änderungen

Das neue hybride Scroll-System bietet folgende Verbesserungen gegenüber dem alten System:

1. **Normales Scrollen innerhalb von Abschnitten** ist jetzt möglich
2. **Automatisches Einrasten** an Abschnittsgrenzen, wenn man sich in deren Nähe befindet
3. **Sanfte Übergänge** zwischen normalem Scrollen und dem Einrasten
4. **Geschwindigkeitsbasiertes Einrasten**: Nur bei langsamer Scroll-Geschwindigkeit wird eingerastet
5. **Verbesserte Konfigurationsmöglichkeiten** für ein anpassbares Scroll-Erlebnis

Weitere Details zur Funktionsweise und Konfiguration finden Sie in der Datei `assets/js/README_HYBRID_SCROLL.md`. 