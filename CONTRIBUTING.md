# Beitragen zum Fraktale-Welten-Projekt

Vielen Dank für Ihr Interesse, zum Fraktale-Welten-Projekt beizutragen! Dieses Dokument enthält Richtlinien und Informationen, die Ihnen helfen sollen, effektiv zum Projekt beizutragen.

## Wie kann ich beitragen?

Es gibt viele Möglichkeiten, zum Projekt beizutragen:

### Fehler melden

Wenn Sie einen Fehler finden, erstellen Sie bitte einen Issue mit folgenden Informationen:
- Klare Beschreibung des Fehlers
- Schritte zur Reproduktion
- Erwartetes vs. tatsächliches Verhalten
- Screenshots (falls relevant)
- Browser und Betriebssystem

### Verbesserungen vorschlagen

Haben Sie Ideen für neue Funktionen oder Verbesserungen? Erstellen Sie einen Issue mit:
- Klare Beschreibung der vorgeschlagenen Funktion
- Begründung, warum diese Funktion nützlich wäre
- Mögliche Implementierungsansätze

### Code beitragen

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add amazing feature'`)
4. Pushen Sie den Branch (`git push origin feature/amazing-feature`)
5. Öffnen Sie einen Pull Request

## Entwicklungsrichtlinien

### Codestruktur

- `_includes/`: Enthält die interaktiven Visualisierungen
  - `julia-interactive.html`: Interaktive Julia-Menge
  - `mandelbrot-julia-explorer.html`: Mandelbrot-Julia-Explorer
- `_pages/`: Enthält die Markdown-Seiten mit Erklärungen
- `assets/`: Bilder, CSS und andere statische Dateien

### Technische Anforderungen

- **JavaScript**: Verwenden Sie modernes JavaScript (ES6+)
- **Performance**: Achten Sie auf Performanceoptimierungen, besonders bei rechenintensiven Operationen
  - Verwenden Sie Web Workers für parallele Berechnungen
  - Implementieren Sie progressive Rendering-Techniken
- **Responsive Design**: Alle Komponenten sollten auf verschiedenen Geräten gut funktionieren
- **Zugänglichkeit**: Achten Sie auf grundlegende Zugänglichkeitsstandards

### Mathematische Genauigkeit

Da es sich um ein mathematisches Projekt handelt, ist die Genauigkeit der Implementierungen und Erklärungen besonders wichtig:
- Stellen Sie sicher, dass Algorithmen korrekt implementiert sind
- Überprüfen Sie mathematische Formeln und Erklärungen auf Richtigkeit
- Dokumentieren Sie mathematische Konzepte klar und verständlich

## Ideen für zukünftige Entwicklungen

Hier sind einige Ideen für zukünftige Erweiterungen:
- Implementierung weiterer Fraktaltypen (z.B. Newton-Fraktale, Burning Ship)
- 3D-Visualisierungen von Fraktalen
- Animationen zur Veranschaulichung der Entstehung von Fraktalen
- Optimierung für mobile Geräte
- Implementierung von GPU-Beschleunigung mit WebGL
- Erweiterung der mathematischen Erklärungen und Tutorials

## Kontakt

Bei Fragen oder Unklarheiten können Sie ein Issue erstellen oder sich direkt an die Projektbetreuer wenden.

Vielen Dank für Ihre Unterstützung! 