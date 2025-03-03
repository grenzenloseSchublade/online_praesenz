# Python-Umgebung für Online-Präsenz

Diese Python-Umgebung ist für die Generierung von Inhalten und Visualisierungen für die Jekyll-Website konfiguriert.

## Einrichtung

Die Entwicklungsumgebung ist mit Visual Studio Code und Dev Containers konfiguriert. Um sie zu nutzen:

1. Installieren Sie [Visual Studio Code](https://code.visualstudio.com/)
2. Installieren Sie die [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Installieren Sie [Docker Desktop](https://www.docker.com/products/docker-desktop)
4. Öffnen Sie dieses Projekt in VS Code und klicken Sie auf "Reopen in Container", wenn Sie dazu aufgefordert werden

## Enthaltene Bibliotheken

Die Python-Umgebung enthält folgende Hauptbibliotheken:

- **Wissenschaftliche Bibliotheken**: NumPy, Matplotlib, SciPy, SymPy
- **Datenverarbeitung**: Pandas, Jupyter
- **Visualisierung**: Seaborn, Plotly, ipywidgets
- **Bildverarbeitung**: Pillow
- **Webentwicklung**: Flask, Requests
- **Entwicklungswerkzeuge**: pytest, black, flake8, pylint, mypy

## Mandelbrot-Set Generator

Das Projekt enthält einen Mandelbrot-Set Generator (`generate_mandelbrot.py`), der hochauflösende Bilder des Mandelbrot-Sets erstellt. Um ihn auszuführen:

```bash
python generate_mandelbrot.py
```

Das generierte Bild wird unter `assets/images/mandelbrot-header.jpg` gespeichert.

## Eigene Python-Skripte hinzufügen

Sie können eigene Python-Skripte im Hauptverzeichnis oder in einem neuen Unterverzeichnis erstellen. Alle Abhängigkeiten sind bereits installiert und können direkt importiert werden.

## Jupyter Notebooks

Um Jupyter Notebooks zu verwenden:

```bash
jupyter notebook
```

Dies startet den Notebook-Server, und Sie können über den Browser auf die Notebooks zugreifen.

## Abhängigkeiten aktualisieren

Wenn Sie neue Python-Pakete hinzufügen möchten, fügen Sie sie zur `requirements.txt`-Datei hinzu und führen Sie folgenden Befehl aus:

```bash
pip install -r requirements.txt
``` 