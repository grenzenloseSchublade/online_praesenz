---
title: "Entwicklung einer ersten Website"
date: 2025-03-04
last_modified_at: 2025-09-05
author_profile: true
categories:
  - Webentwicklung
tags:
  - Jekyll
  - Minimal Mistakes
  - YAML
  - Projektstruktur
  - Entwicklungsprozess
toc: true
toc_label: "Inhalt"
toc_icon: "cog"
toc_sticky: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Projektstruktur und Entwicklungsprozess"
excerpt: "Eine Analyse der Entwicklung meiner ersten (dieser) Website - zwischen Konfigurationsfreiheit und Entwicklungseffizienz"
---

In diesem Beitrag wird der Prozess der Entwicklung dieser Website analysiert und die kleinen Stolpersteine beschrieben, die während der Umsetzung aufgetreten sind. Möglicherweise dient dieser Beitrag als Nachschlagewerk für andere, die ebenfalls ein ähnliches Vorhaben umsetzen wollen.

## Die Entscheidung für Jekyll und Minimal Mistakes

Als ich mich entschied, eine Website für mich und über mich zu erstellen, habe ich mir selbst einige Vorgaben gesetzt. Die Seite...

- ...darf keine (laufenden) Kosten verursachen.
- ...dem heutigen, modernen Anforderungen im Design und der Usability entsprechen.
- ...wartbar und erweiterbar sein.
- ...vollumfänglich individuell gestaltbar sein.

und ich wollte dabei alles selbst machen. Oder zumindest alles machen können.

Nach einiger Recherche fiel meine Wahl auf Jekyll mit dem Minimal Mistakes Theme. Diese Entscheidung basierte auf mehreren Faktoren:

1. **Statische Website-Generierung**: Keine Datenbank, keine komplexe Serverinfrastruktur, nur statische Dateien
2. **Markdown-basierte Inhalte**: Einfache, lesbare Syntax für die Inhaltserstellung
3. **Flexibilität**: Anpassbar an meine spezifischen Bedürfnisse
4. **GitHub Pages Integration**: Einfaches Hosting und Deployment
5. **Open Source**: Freie und aktive Entwicklung
6. **Community**: Aktive Entwickler und Unterstützung
7. **Dokumentation**: Ausführliche Dokumentation und Beispiele

Besonders das Minimal Mistakes Theme von Michael Rose überzeugte mich durch seine Kombination aus schlichtem Design, umfangreicher Dokumentation und aktiver Community. Mit über 12.700 Stars und 26.200 Forks auf GitHub ist es eines der beliebtesten Jekyll-Themes. 
Mit dem Theme besteht die Möglichkeit mit sehr wenig Aufwand eine vollumfängliche klassische Website zu erstellen. Mit gewissem Mehraufwand kann man jedoch auch eine individuelle, moderne, dynamische Website erstellen, wie ich es vorhabe und hier machen möchte.

## Die Projektstruktur verstehen

Die Struktur eines Jekyll-Projekts mit Minimal Mistakes folgt einem klaren Muster, das die Trennung von Inhalt und Präsentation in den Vordergrund stellt. Nach einigen Tagen des Experimentierens begann ich, die Logik hinter dieser Struktur zu verstehen und zu schätzen:

```bash
online_praesenz/
├── _data/           # Strukturierte Daten (YAML)
├── _includes/       # Wiederverwendbare HTML-Komponenten
├── _layouts/        # Seitenlayouts
├── _pages/          # Statische Seiten
├── _posts/          # Blog-Beiträge
├── _sass/           # SCSS-Dateien
├── assets/          # Bilder, JavaScript, CSS
├── _config.yml      # Hauptkonfiguration
└── index.html       # Startseite
```

Diese Struktur ermöglicht es, Inhalte und Design sauber zu trennen. Während ich anfangs dachte, dass dies nur eine Konvention sei, erkannte ich bald den tieferen Sinn: **Wartbarkeit und Skalierbarkeit**.

## Die Magie der YAML-Dateien

Eine der wichtigsten Erkenntnisse während meiner Arbeit mit Jekyll war die Bedeutung von YAML-Dateien für die Strukturierung von Inhalten. In meinem Projekt habe ich mich entschieden, viele Inhalte in YAML-Dateien im `_data`-Verzeichnis zu speichern, anstatt sie direkt in Markdown-Dateien zu schreiben.

Zum Beispiel habe ich für meine "Über mich"-Seite eine Struktur wie diese verwendet:

```yaml
# _data/about.yml
- section: "Profil"
  icon: "user"
  content: "Hier steht eine Beschreibung meiner Person..."
  
- section: "Fähigkeiten"
  icon: "code"
  skills:
    - category: "Programmiersprachen"
      items:
        - name: "Python"
          level: 90
        - name: "JavaScript"
          level: 85
        # weitere Fähigkeiten...
```

Diese Daten werden dann in einer Markdown-Datei wie `_pages/about.md` verwendet:

```markdown
---
title: "Über mich"
permalink: /about/
layout: single
---

{% raw %}
{% for section in site.data.about %}
  <h2><i class="fas fa-{{ section.icon }}"></i> {{ section.section }}</h2>
  
  {% if section.content %}
    <p>{{ section.content }}</p>
  {% endif %}
  
  {% if section.skills %}
    {% include skills.html skill_categories=section.skills %}
  {% endif %}
{% endfor %}
{% endraw %}
```

Der Vorteil dieses Ansatzes liegt auf der Hand: Ich kann die Inhalte ändern, ohne die Struktur der Seite zu beeinflussen. Wenn ich eine neue Fähigkeit hinzufügen möchte, muss ich nur die YAML-Datei bearbeiten, nicht das Template.

## Die Herausforderung der Konfigurationstiefe

Hier komme ich zu einem der zentralen Punkte meiner Erfahrung: **Die Balance zwischen Konfigurationsfreiheit und Zeitaufwand**.

Jekyll und Minimal Mistakes bieten eine beeindruckende Tiefe an Konfigurationsmöglichkeiten. Von Farbschemata über Layoutoptionen bis hin zu benutzerdefinierten Taxonomien - fast alles kann angepasst werden. Diese Freiheit ist sowohl Segen als auch Fluch.

In den ersten Tagen meines Projekts verlor ich mich in den endlosen Möglichkeiten. Ich verbrachte Stunden damit, kleine Details anzupassen, verschiedene Optionen auszuprobieren und die Dokumentation zu studieren. Die Versuchung, jedes Detail zu perfektionieren, führte zu einem ineffizienten Entwicklungsprozess.

Ein konkretes Beispiel: Für die Darstellung meiner Fähigkeiten experimentierte ich mit verschiedenen Visualisierungen - Balkendiagramme, Kreisdiagramme, Tag-Clouds. Jede Option erforderte Anpassungen an den Templates und CSS-Dateien. Nach einem Tag des Experimentierens erkannte ich, dass ich mehr Zeit mit der Konfiguration als mit dem eigentlichen Inhalt verbracht hatte.

## Der Weg zur Effizienz

Nach dieser Erkenntnis änderte ich meinen Ansatz. Statt jedes Detail sofort perfektionieren zu wollen, definierte ich klare Prioritäten:

1. **Inhaltsstruktur zuerst**: Definition der grundlegenden Datenstrukturen in YAML
2. **Minimale funktionale Templates**: Erstellung einfacher Templates, die die Daten korrekt darstellen
3. **Iterative Verbesserung**: Schrittweise Verfeinerung des Designs und der Funktionalität

Dieser Ansatz führte zu einer deutlich effizienteren Entwicklung. Anstatt mich in den Konfigurationsmöglichkeiten zu verlieren, konzentrierte ich mich auf das Wesentliche: Eine klare, wartbare Struktur für meine Inhalte.

Ein praktisches Beispiel für diesen Ansatz ist meine Implementierung der "Über mich"-Seite:

```markdown
{% raw %}
{% for section in site.data.about %}
<span id="{{ section.section | slugify }}" class="section-anchor"></span>
## <i class="fas fa-{{ section.icon }}"></i> {{ section.section }}

{% capture inner_content %}
  {% if section.interests %}
    {% include interests.html interests=section.interests %}
  {% endif %}

  {% if section.skills %}
    {% include skills.html skill_categories=section.skills %}
  {% endif %}

  {% if section.contact_info %}
    {% include contact-info.html contact_info=section.contact_info %}
  {% endif %}
{% endcapture %}

{% include cv-section.html 
  icon=section.icon 
  title=section.section 
  content=section.content 
  inner_content=inner_content %}
{% endfor %}
{% endraw %}
```

Dieser Code ist modular, erweiterbar und folgt einem klaren Muster. Neue Abschnittstypen können einfach hinzugefügt werden, ohne die grundlegende Struktur zu ändern.

## Technische Herausforderungen und Lösungen

Während der Entwicklung stieß ich auf einige technische Herausforderungen, die typisch für Jekyll-Projekte sind:

### 1. Die Jekyll-Ausführbarkeit

Ein unerwartetes Problem war, dass die Jekyll-Executable nach der Installation nicht ausführbar war. Die Lösung bestand darin, die Berechtigungen anzupassen und den Pfad in der Entwicklungsumgebung zu konfigurieren:

```json
// .devcontainer/devcontainer.json
{
  "remoteEnv": {
    "PATH": "${containerEnv:PATH}:/workspaces/online_praesenz/vendor/bundle/ruby/3.4.0/bin"
  },
  "postStartCommand": "find /workspaces/online_praesenz/vendor/bundle -name jekyll -type f -exec chmod +x {} \\;"
}
```

### 2. Komplexe Datenstrukturen in YAML

Die Arbeit mit verschachtelten Datenstrukturen in YAML kann komplex werden. Ich lernte, dass eine klare Dokumentation und konsistente Namenskonventionen entscheidend sind:

```yaml
# Beispiel für eine gut strukturierte YAML-Datei
- section: "Projekte"
  icon: "project-diagram"
  projects:
    - title: "Website-Relaunch"
      description: "Komplette Überarbeitung der Unternehmenswebsite"
      technologies:
        - name: "Jekyll"
          icon: "gem"
        - name: "SCSS"
          icon: "css3"
      links:
        - url: "https://example.com"
          text: "Live-Demo"
          icon: "external-link-alt"
```

### 3. Liquid-Templates und Leistung

Bei komplexen Seiten mit vielen verschachtelten Schleifen und Bedingungen in Liquid-Templates kann die Generierungszeit ansteigen. Ich optimierte meine Templates durch:

- Verwendung von `{% raw %}{% capture %}{% endraw %}` für komplexe Inhaltsblöcke
- Vermeidung unnötiger Verschachtelungen
- Auslagerung wiederholter Logik in separate Includes

## Lessons Learned

Nach mehreren Wochen intensiver Arbeit mit Jekyll und Minimal Mistakes habe ich einige wichtige Erkenntnisse gewonnen:

1. **Struktur vor Styling**: Eine klare, durchdachte Datenstruktur ist wichtiger als perfektes Styling
2. **Iteratives Vorgehen**: Schrittweise Verbesserungen führen zu besseren Ergebnissen als der Versuch, sofort alles perfekt zu machen
3. **Dokumentation ist entscheidend**: Sowohl für die eigene Arbeit als auch für zukünftige Wartung
4. **Weniger ist mehr**: Nicht jede Konfigurationsmöglichkeit muss genutzt werden

## Fazit und Ausblick

Die Arbeit mit Jekyll und Minimal Mistakes hat mir gezeigt, dass die wahre Kunst der Webentwicklung nicht darin besteht, alle verfügbaren Optionen zu nutzen, sondern die richtigen Optionen für das spezifische Projekt auszuwählen.

Die datengesteuerte Struktur, die ich implementiert habe, bietet eine solide Grundlage für zukünftige Erweiterungen. Anstatt mich in endlosen Konfigurationsoptionen zu verlieren, kann ich mich auf das konzentrieren, was wirklich wichtig ist: Qualitative Inhalte zu erstellen und sie in einer benutzerfreundlichen, wartbaren Struktur zu präsentieren.

Für zukünftige Projekte werde ich diesen Ansatz beibehalten: Klare Prioritäten setzen, eine solide Datenstruktur definieren und iterativ verbessern. Die Balance zwischen Konfigurationsfreiheit und Entwicklungseffizienz ist der Schlüssel zu erfolgreichen Projekten - nicht nur mit Jekyll, sondern in der Softwareentwicklung allgemein.
