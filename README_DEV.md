# Entwicklungsumgebung für Fraktale Welten

Diese Entwicklungsumgebung kombiniert Python 3.11 und Jekyll, um sowohl die Website-Entwicklung als auch die Generierung von Fraktal-Visualisierungen zu unterstützen.

## Einrichtung

Die Entwicklungsumgebung ist mit Visual Studio Code und Dev Containers konfiguriert:

1. Installieren Sie [Visual Studio Code](https://code.visualstudio.com/)
2. Installieren Sie die [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Installieren Sie [Docker Desktop](https://www.docker.com/products/docker-desktop)
4. Öffnen Sie dieses Projekt in VS Code und klicken Sie auf "Reopen in Container", wenn Sie dazu aufgefordert werden

## Enthaltene Komponenten

Die Entwicklungsumgebung enthält:

### Python-Umgebung
- Python 3.11 mit wissenschaftlichen Bibliotheken (NumPy, Matplotlib, SciPy)
- Jupyter Notebooks für interaktive Entwicklung
- Bildverarbeitungsbibliotheken (Pillow)
- Entwicklungswerkzeuge (pytest, black, flake8, pylint)

### Jekyll-Umgebung
- Ruby mit Jekyll und Bundler
- Minimal Mistakes Theme
- Liquid-Templates
- SCSS/SASS für Styling

## Interaktive Komponenten

Das Projekt enthält mehrere interaktive Komponenten zur Visualisierung von Fraktalen:

### Julia-Menge Interaktiv
- Anpassen der Parameter (Realteil und Imaginärteil von c)
- Einstellen der maximalen Iterationszahl
- Auswahl verschiedener Farbschemata
- Zoom-Funktionen (Mausrad, Klick, Doppelklick, Zoom-Box)
- Speichern der generierten Bilder
- Ausführliche Erklärungen zu allen Parametern

### Mandelbrot-Julia-Explorer
- Erkundung des Zusammenhangs zwischen Mandelbrot- und Julia-Mengen
- Auswahl von Punkten in der Mandelbrot-Menge zur Anzeige der entsprechenden Julia-Menge
- Anpassung von Iterationen und Farbschemata
- Speichern der generierten Bilder

## Fraktal-Generatoren

Das Projekt enthält mehrere Skripte zur Generierung von Fraktalen:

### Hauptskript

```