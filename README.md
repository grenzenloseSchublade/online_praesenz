# Meine Jekyll Website mit Minimal Mistakes

Dies ist eine persönliche Website, die mit Jekyll und dem Minimal Mistakes Theme erstellt wurde.

## Installation

1. Stellen Sie sicher, dass Ruby (Version 2.5.0 oder höher) installiert ist:
   ```bash
   ruby --version
   ```

2. Installieren Sie die Bundler gem:
   ```bash
   gem install bundler
   ```

3. Klonen Sie dieses Repository:
   ```bash
   git clone [REPOSITORY-URL]
   cd [REPOSITORY-NAME]
   ```

4. Installieren Sie die erforderlichen Gems:
   ```bash
   bundle install
   ```

## Lokale Entwicklung

Um die Website lokal zu entwickeln:

1. Starten Sie den Jekyll-Server:
   ```bash
   bundle exec jekyll serve
   ```

2. Öffnen Sie http://localhost:4000 in Ihrem Browser

## Neue Inhalte erstellen

### Blogbeiträge

Neue Blogbeiträge werden im `_posts` Verzeichnis erstellt. Die Dateinamen müssen dem Format `JAHR-MONAT-TAG-titel.md` folgen.

### Seiten

Statische Seiten werden im `_pages` Verzeichnis erstellt.

## Anpassungen

- Die Hauptkonfiguration befindet sich in `_config.yml`
- Layouts können in `_layouts` angepasst werden
- Assets (Bilder, CSS, JS) gehören in den `assets` Ordner

## Deployment

Die Website kann auf verschiedenen Plattformen gehostet werden:

1. GitHub Pages (kostenlos)
2. Netlify
3. Eigener Webserver

Für GitHub Pages:
1. Erstellen Sie ein Repository auf GitHub
2. Pushen Sie Ihren Code
3. Aktivieren Sie GitHub Pages in den Repository-Einstellungen

## Weitere Ressourcen

- [Minimal Mistakes Dokumentation](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/)
- [Jekyll Dokumentation](https://jekyllrb.com/docs/) 