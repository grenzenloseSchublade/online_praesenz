# Dokumentation: Minimal Mistakes Implementierung

Diese Dokumentation erklärt, wie die Website mit dem Minimal Mistakes Theme aufgebaut ist und wie neue Seiten erstellt werden können.

## Struktur der Website

Die Website basiert auf Jekyll mit dem Minimal Mistakes Theme und folgt einer klaren Trennung von Inhalt und Präsentation:

1. **Inhalte**: Werden in Markdown-Dateien und YAML-Datendateien gespeichert
2. **Präsentation**: Wird durch Layouts, Includes und CSS gesteuert
3. **Konfiguration**: Erfolgt über die `_config.yml` Datei

## Erstellen neuer Seiten

### 1. Einfache Seite erstellen

Um eine einfache Seite zu erstellen:

1. Erstelle eine neue Markdown-Datei im `_pages` Verzeichnis, z.B. `neue-seite.md`
2. Füge den Frontmatter hinzu:

```yaml
---
title: "Meine neue Seite"
permalink: /neue-seite/
layout: single
author_profile: true
---

Hier kommt der Inhalt der Seite in Markdown.
```

### 2. Seite mit strukturierten Daten erstellen

Für komplexere Seiten mit strukturierten Daten (wie about.md oder cv.md):

1. **Erstelle eine Datendatei** in `_data/`, z.B. `_data/neue_seite.yml`:

```yaml
- section: "Erste Sektion"
  icon: "star"
  content: "Hier steht der Inhalt der ersten Sektion."

- section: "Zweite Sektion"
  icon: "book"
  content: "Hier steht der Inhalt der zweiten Sektion."
  items:
    - "Erster Punkt"
    - "Zweiter Punkt"
    - "Dritter Punkt"
```

2. **Erstelle bei Bedarf neue Includes** in `_includes/` für spezielle Darstellungen

3. **Erstelle die Markdown-Datei** in `_pages/`, z.B. `_pages/neue-seite.md`:

```yaml
---
title: "Meine neue Seite"
permalink: /neue-seite/
layout: single
author_profile: true
toc: true
toc_label: "Inhalt"
toc_sticky: true
---

<style>
/* Stelle sicher, dass die Anker-Links korrekt funktionieren */
.section-anchor {
  display: block;
  position: relative;
  top: -100px;
  visibility: hidden;
}
</style>

{% for section in site.data.neue_seite %}
<span id="{{ section.section | slugify }}" class="section-anchor"></span>
## {{ section.section }}

  {% capture inner_content %}
    {% if section.items %}
    <ul>
      {% for item in section.items %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
    {% endif %}
  {% endcapture %}

  {% include cv-section.html 
    icon=section.icon 
    title=section.section 
    content=section.content 
    inner_content=inner_content %}

{% endfor %}
```

## Verfügbare Includes

Die folgenden Includes stehen zur Verfügung:

- `cv-section.html`: Grundlegendes Layout für Abschnitte
- `interests.html`: Darstellung von Interessen mit Kategorien
- `skills.html`: Darstellung von Fähigkeiten mit Fortschrittsbalken
- `experiences.html`: Darstellung von Berufserfahrungen
- `education.html`: Darstellung von Ausbildung
- `languages.html`: Darstellung von Sprachkenntnissen
- `contact-info.html`: Darstellung von Kontaktinformationen
- `awards.html`: Darstellung von Auszeichnungen
- `quote.html`: Darstellung von Zitaten

## Best Practices

1. **Trennung von Inhalt und Präsentation**:
   - Speichere strukturierte Daten in YAML-Dateien im `_data/` Verzeichnis
   - Verwende Includes für die Darstellung
   - Halte Markdown-Dateien sauber und fokussiert auf den Inhalt

2. **Wiederverwendbarkeit**:
   - Erstelle generische Includes, die in verschiedenen Kontexten verwendet werden können
   - Parametrisiere Includes, um sie flexibel zu halten

3. **Konsistenz**:
   - Verwende einheitliche Benennungskonventionen
   - Halte die Struktur der Datendateien konsistent

4. **Erweiterbarkeit**:
   - Dokumentiere neue Includes und deren Parameter
   - Halte die Struktur modular, um einfache Erweiterungen zu ermöglichen

## Beispiel: Neue Seite mit benutzerdefinierten Daten

### 1. Datendatei erstellen (`_data/projekte.yml`):

```yaml
- section: "Aktuelle Projekte"
  icon: "rocket"
  content: "Hier sind meine aktuellen Projekte."
  projekte:
    - titel: "Projekt A"
      beschreibung: "Beschreibung des Projekts A"
      technologien: ["HTML", "CSS", "JavaScript"]
      link: "https://example.com/projektA"
    - titel: "Projekt B"
      beschreibung: "Beschreibung des Projekts B"
      technologien: ["Python", "Django", "PostgreSQL"]
      link: "https://example.com/projektB"
```

### 2. Include erstellen (`_includes/projekte.html`):

```html
{% for projekt in include.projekte %}
<div class="cv-entry">
  <div class="cv-entry-header">
    <h3>{{ projekt.titel }}</h3>
  </div>
  <div class="cv-entry-content">
    <p>{{ projekt.beschreibung }}</p>
    <p><strong>Technologien:</strong> {{ projekt.technologien | join: ", " }}</p>
    <p><a href="{{ projekt.link }}" target="_blank">Projekt ansehen</a></p>
  </div>
</div>
{% endfor %}
```

### 3. Markdown-Datei erstellen (`_pages/projekte.md`):

```yaml
---
title: "Meine Projekte"
permalink: /projekte/
layout: single
author_profile: true
toc: true
toc_label: "Inhalt"
toc_sticky: true
---

{% for section in site.data.projekte %}
<section id="{{ section.section | slugify }}" class="projekte-section">
  <h2>{{ section.section }}</h2>

  {% capture inner_content %}
    {% if section.projekte %}
      {% include projekte.html projekte=section.projekte %}
    {% endif %}
  {% endcapture %}

  {% include cv-section.html 
    icon=section.icon 
    title=section.section 
    content=section.content 
    inner_content=inner_content %}
</section>
{% endfor %}
```

## Wichtige Hinweise zum Inhaltsverzeichnis (TOC)

Das Inhaltsverzeichnis (Table of Contents, TOC) wird in Jekyll mit dem Minimal Mistakes Theme automatisch aus den Markdown-Überschriften generiert. Damit das TOC korrekt funktioniert, müssen folgende Punkte beachtet werden:

1. **Aktivierung des TOC in der Front Matter:**
   ```yaml
   toc: true
   toc_label: "Inhalt"  # Optional: Titel des Inhaltsverzeichnisses
   toc_icon: "list"     # Optional: Icon aus Font Awesome
   toc_sticky: true     # Optional: Fixiert das TOC beim Scrollen
   ```

2. **Korrekte Verwendung von Markdown-Überschriften:**
   - Überschriften müssen im Markdown-Format definiert werden (`##`, `###`, etc.)
   - Die Überschriften müssen direkt im Markdown-Code stehen, nicht in HTML-Tags oder Liquid-Templates
   - Überschriften sollten aufeinanderfolgende Ebenen haben (keine Ebenen überspringen)

3. **Beispiel für korrekte Implementierung mit YAML-Daten:**
   ```liquid
   {% for section in site.data.example.sections %}
   <span id="{{ section.section | slugify }}" class="section-anchor"></span>
   
   ## <i class="fas fa-{{ section.icon }}"></i> {{ section.section }}
   
   {{ section.content | markdownify }}
   
   {% if section.subsections %}
     {% for subsection in section.subsections %}
   ### {{ subsection.title }}
   
   {{ subsection.content | markdownify }}
     {% endfor %}
   {% endif %}
   {% endfor %}
   ```

4. **Wichtige Hinweise:**
   - Achten Sie auf die Leerzeilen vor und nach den Markdown-Überschriften
   - Vermeiden Sie HTML-Container um die Überschriften
   - Verwenden Sie Anker-Spans für korrekte Verlinkung und Positionierung

Diese Implementierung stellt sicher, dass das TOC korrekt generiert wird und alle Links zu den entsprechenden Abschnitten funktionieren.

## Startseite und Blog

### Startseite (index.html)

Die Startseite verwendet das `home`-Layout und ist in mehrere Abschnitte unterteilt:

1. **Hero-Bereich**: Ein großes Bild mit Überschrift und Call-to-Action-Buttons
2. **Teaser-Abschnitte**: Kurze Beschreibungen der wichtigsten Bereiche der Website (Über mich, CV, Projekte)
3. **Neueste Beiträge**: Eine Übersicht der neuesten Blogbeiträge im Grid-Layout

Die Startseite kann über die Datei `index.html` im Hauptverzeichnis angepasst werden. Die Styles für die Startseite sind in `assets/css/main.scss` definiert.

### Blog-Seite (posts.md)

Die Blog-Seite verwendet das `posts`-Layout und zeigt alle Blogbeiträge chronologisch an. Zusätzlich bietet sie:

1. **Kategoriefilter**: Buttons zum Filtern der Beiträge nach Kategorien
2. **Archiv**: Gruppierung der Beiträge nach Jahr und Monat
3. **Suchfunktion**: Möglichkeit, nach Beiträgen zu suchen (über die Suchfunktion der Website)

## Erstellen von Blogbeiträgen

Blogbeiträge werden automatisch aus Markdown-Dateien im `_posts`-Verzeichnis generiert. Die Dateinamen müssen dem Format `YYYY-MM-DD-titel-des-beitrags.md` folgen.

### Vorlage für Blogbeiträge

Im Verzeichnis `_templates` befindet sich eine Vorlage für neue Blogbeiträge (`post-template.md`). Diese Vorlage enthält:

1. **Front Matter**: Metadaten wie Titel, Datum, Kategorien, Tags und Header-Bilder
2. **Inhaltsverzeichnis**: Konfiguration für das automatische Inhaltsverzeichnis
3. **Beispiele**: Beispiele für verschiedene Markdown-Elemente wie Überschriften, Listen, Code-Blöcke, Bilder, Links, Zitate und Tabellen

### Schritte zum Erstellen eines neuen Blogbeitrags

1. **Kopieren der Vorlage**:
   ```bash
   cp _templates/post-template.md _posts/YYYY-MM-DD-titel-des-beitrags.md
   ```

2. **Anpassen des Front Matter**:
   - Setzen Sie den Titel des Beitrags
   - Aktualisieren Sie das Datum
   - Wählen Sie passende Kategorien und Tags
   - Fügen Sie Header-Bilder hinzu

3. **Schreiben des Inhalts**:
   - Verwenden Sie Markdown für die Formatierung
   - Strukturieren Sie den Beitrag mit Überschriften
   - Fügen Sie Bilder, Links und andere Elemente hinzu

4. **Vorschau**:
   - Starten Sie den lokalen Server mit `bundle exec jekyll serve`
   - Überprüfen Sie den Beitrag unter `http://localhost:4000/posts/`

### Best Practices für Blogbeiträge

1. **Klare Struktur**:
   - Verwenden Sie Überschriften, um den Beitrag zu strukturieren
   - Beginnen Sie mit einer kurzen Einleitung
   - Schließen Sie mit einem Fazit ab

2. **Medien einbinden**:
   - Speichern Sie Bilder im Verzeichnis `assets/images/posts/`
   - Verwenden Sie aussagekräftige Dateinamen
   - Fügen Sie Alt-Text für Bilder hinzu

3. **SEO-Optimierung**:
   - Wählen Sie einen aussagekräftigen Titel
   - Verwenden Sie relevante Kategorien und Tags
   - Schreiben Sie eine kurze Beschreibung im Front Matter

4. **Konsistenz**:
   - Halten Sie sich an ein einheitliches Format
   - Verwenden Sie die gleichen Kategorien und Tags für ähnliche Beiträge
   - Achten Sie auf eine einheitliche Bildgröße für Teaser-Bilder

## Beispiel für einen Blogbeitrag

```markdown
---
title: "Einführung in Jekyll"
date: 2024-03-15
categories:
  - Tutorials
tags:
  - Jekyll
  - Webentwicklung
  - Markdown
header:
  teaser: "/assets/images/posts/jekyll-teaser.jpg"
  overlay_image: "/assets/images/posts/jekyll-header.jpg"
  overlay_filter: 0.5
  caption: "Jekyll Logo und Beispielcode"
toc: true
toc_label: "Inhalt"
toc_sticky: true
---

In diesem Beitrag erkläre ich, wie man mit Jekyll eine statische Website erstellt.

## Was ist Jekyll?

Jekyll ist ein Generator für statische Websites, der Markdown-Dateien in HTML-Seiten umwandelt.

## Installation

Die Installation von Jekyll ist einfach:

```bash
gem install jekyll bundler
```

## Fazit

Jekyll ist ein leistungsstarkes Tool für die Erstellung von Websites und Blogs.
```

Diese Struktur stellt sicher, dass Blogbeiträge einheitlich formatiert sind und alle wichtigen Elemente enthalten.

## Verwendung von YAML-Daten für Inhaltsseiten

Für komplexe Inhaltsseiten wie die Mandelbrot-Seite empfehlen wir die Verwendung von YAML-Daten, um Inhalte von der Präsentation zu trennen. Dies bietet mehrere Vorteile:

1. **Trennung von Inhalt und Präsentation**: Die Inhalte werden in YAML-Dateien im `_data`-Verzeichnis gespeichert, während die Präsentation durch Templates gesteuert wird.
2. **Bessere Wartbarkeit**: Änderungen an Inhalten können vorgenommen werden, ohne die Präsentationslogik zu beeinflussen.
3. **Wiederverwendbarkeit**: Inhalte können in verschiedenen Kontexten wiederverwendet werden.
4. **Konsistenz**: Alle Seiten können einem einheitlichen Muster folgen.

### Beispiel: Mandelbrot-Seite

Die Mandelbrot-Seite verwendet YAML-Daten, um ihre Inhalte zu strukturieren:

1. **YAML-Datei**: `_data/mandelbrot.yml` enthält alle Inhalte der Seite, strukturiert in Abschnitte und Unterabschnitte.
2. **Template**: `_includes/mandelbrot-section.html` definiert, wie jeder Abschnitt gerendert wird.
3. **Markdown-Datei**: `_pages/mandelbrot.md` enthält nur noch die Front Matter und einen Loop, der durch die YAML-Daten iteriert.

#### Struktur der YAML-Datei

```yaml
sections:
  - section: "Abschnittstitel"
    icon: "icon-name"  # FontAwesome-Icon
    anchor: "optional-anchor-id"  # Optional
    content: >-
      Markdown-formatierter Inhalt des Abschnitts.
      Kann mehrere Zeilen umfassen.
    include: "optional-include-file.html"  # Optional
    subsections:  # Optional
      - title: "Unterabschnittstitel"
        content: >-
          Markdown-formatierter Inhalt des Unterabschnitts.
```

#### Verwendung in der Markdown-Datei

```markdown
---
title: "Seitentitel"
permalink: /permalink/
classes: wide
mathjax: true  # Falls MathJax benötigt wird
toc: true      # Aktiviert das Inhaltsverzeichnis
toc_label: "Inhalt"
toc_icon: "list"
header:
  overlay_image: /path/to/image.jpg
  overlay_filter: 0.5
  caption: "Bildunterschrift"
  actions:
    - label: "Button-Label"
      url: "/permalink/#anchor"
---

{% for section in site.data.dateiname.sections %}
  {% include template-name.html section=section %}
{% endfor %}
```

Diese Methode ist besonders nützlich für Seiten mit vielen Abschnitten oder für Seiten, deren Inhalte häufig aktualisiert werden müssen.