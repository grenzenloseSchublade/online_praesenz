---
title: "Entwicklung einer ersten Website"
date: 2025-03-04
last_modified_at: 2025-09-10
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
toc_collapse: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Projektstruktur und Entwicklungsprozess"
excerpt: "Eine Analyse der Entwicklung dieser Website mit Fokus auf Best Practices und Lessons Learned."
---

## Einleitung

Im Folgenden wird der Prozess der Entwicklung dieser Website analysiert. Die Darstellung erfolgt objektiv, eingebettet in die persönlichen Erfahrungen, die als Entwickler erfahren wurden. Ziel ist es, zentrale Herausforderungen, die Balance zwischen Konfigurationsfreiheit und Effizienz, sowie die Bedeutung einer sauberen Datenstruktur darzustellen. Dabei wird auf die wesentlichen Aspekte eingegangen, die bei der Entwicklung einer Website zu berücksichtigen sind.

## Konzeption und Motivation

Als ich vor der Aufgabe stand, eine Seite für mich und über mich zu erstellen, stellte ich klare Anforderungen auf: Die Website sollte kostenfrei betreibbar, modernen Ansprüchen gerecht, wartbar und vollständig individualisierbar sein. Insbesondere wollte ich sämtliche Entwicklungsschritte eigenständig durchführen und nachvollziehbar dokumentieren.

Nach eingehender Evaluation verschiedener Lösungen fiel meine Wahl auf Jekyll – einen in der Webentwicklung etablierten Static Site Generator – und das konfigurierbare Minimal Mistakes Theme. Die Entscheidung beruhte auf folgenden Aspekten:

- Statische Generierung ohne Datenbank-Backends, lediglich statische Dateien im Ergebnis
- Markdown-basierte Inhaltspflege, die Fehler vermeidet und transparent bleibt
- Hohe Flexibilität durch modulare Architektur
- Kosteneffizientes, automatisierbares Hosting via GitHub Pages
- Eine aktive Open-Source-Community und ausgereifte Dokumentation

### Bedeutung des Minimal Mistakes Themes

Das Theme erlaubt schon mit Grundkonfiguration eine klassisch gegliederte Website. Mit wenigen Anpassungen ist es möglich, eine moderne, eigene und technisch anspruchsvolle Struktur zu realisieren, wie ich sie umsetzen wollte. Die Popularität in der Community (über 12.000 Sterne auf GitHub) und die ständige Weiterentwicklung unterstützen diesen Ansatz zusätzlich.

## Projektstruktur: Trennung von Inhalt und Präsentation

Die Jekyll-Projektstruktur ist ein Musterbeispiel für Clean Code und Wartbarkeit. Inhalte (_posts, _pages) sind strikt getrennt von Templates (_layouts, _includes) und Daten (_data-Ordner). Nach einigen Tagen des Experimentierens zeigte sich, wie sehr diese Struktur Skalierung und Anpassung erleichtert:

```bash
online_praesenz/
├── _data/
├── _includes/
├── _layouts/
├── _pages/
├── _posts/
├── _sass/
├── assets/
├── _config.yml
└── index.html
```

## Moderne Datenmodellierung mit YAML

Ein zentrales Element meines Vorgehens war die Nutzung von YAML-Dateien zur datengetriebenen Steuerung von Seiteninhalten. Beispielsweise pflege ich persönliche Informationen, Interessen und Fähigkeiten in strukturierter Form innerhalb von `_data/about.yml`:

```yaml
- section: "Wer bin ich?"
  icon: "user"
  content: "Guten Tag, mein Name ist Hans. Ich bin stets bereit, Herausforderungen anzunehmen..."
- section: "Meine Interessen"
  icon: "brain"
  interests:
    - category: "Programmierung"
      items:
        - "Machine Learning"
        - "Computer Vision Algorithmen"
    - category: "Bewegung"
      items:
        - "Fahrrad fahren"
        - "Calisthenics"
        - "Wandern in der Natur"
- section: "Meine Projekte"
  icon: "project-diagram"
  skills:
    - category: "Fraktale Visualisierung"
      items:
        - "Interaktive Darstellung der Mandelbrot-Menge"
        - "Julia-Mengen Explorer"
    - category: "Mobile App"
      items:
        - "Erkennung & Digitalisierung von Kassenzetteln"
- section: "Kontakt"
  icon: "envelope"
  contact_info:
    - type: "E-Mail"
      icon: "envelope"
      value: "ihre@email.de"
      link: "mailto:ihre@email.de"
    - type: "GitHub"
      icon: "github"
      value: "@grenzenloseSchublade"
      link: "https://github.com/grenzenloseSchublade"
```

Mit Liquid-Templates [1] können diese Daten elegant eingebunden werden – größtmögliche Trennung von Daten und Präsentation ist garantiert.

## Konfigurationsfreiheit vs. Entwicklungszeit: Reflexion

Die Vielzahl an Optionen in Jekyll und Minimal Mistakes ist ein doppeltes Schwert. In der Anfangsphase investierte ich signifikant Zeit in das Testen von Layouts und Styles anstatt in die Entwicklung von Inhalten. Erst die Definition klarer Prioritäten erhöhte meine Effizienz:

- Erst eine stabile Datenstruktur entwerfen
- Funktionale Templates aufsetzen
- Design und Funktionalität iterativ verbessern

Das Prinzip: 
> Struktur kommt vor Styling und Funktionalität. Verbesserungen sind iterativ und sollten in kleinen, beherrschbaren Schritten erfolgen.

## Technische Herausforderungen und Lösungen

### Jekyll-Ausführbarkeit

Die Installation von Jekyll gestaltete sich komplex. Die Lösung zur fehlenden Ausführbarkeit lag in korrekt vergebenen Berechtigungen und einer sorgfältigen PATH-Konfiguration.

```json
{
  "remoteEnv": {
    "PATH": "${containerEnv:PATH}:/workspaces/online_praesenz/vendor/bundle/ruby/3.4.0/bin"
  },
  "postStartCommand": "find /workspaces/online_praesenz/vendor/bundle -name jekyll -type f -exec chmod +x {} \;"
}
```

### Komplexe Datenstrukturen

Bei verschachtelten YAML-Dateien ist Präzision gefragt. Konsistente Namenskonventionen und ausführliche Dokumentation waren entscheidend, um die Wartung und Erweiterung zu vereinfachen:

```yaml
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

### Liquid-Templates und Performance

Komplexe Liquid-Schleifen können die Build-Zeit erhöhen. Durch Modularisierung der Includes und Vermeidung unnötiger Verschachtelung ließ sich die Performance signifikant steigern.

## Erkenntnisse und Best Practices

Nach mehreren Wochen Arbeit sind folgende Punkte entscheidend:

- **Struktur vor Styling** – Ein klarer Aufbau ermöglicht Erweiterungen und Wartung
- **Iteratives Vorgehen** – Erst die Basis, dann Verbesserungen
- **Dokumentation** – Unerlässlich für den eigenen Workflow und für Dritte
- **Weniger ist mehr** – Nicht jede Option nutzen, sondern sich auf das Wesentliche konzentrieren

## Fazit und Ausblick

Die Entwicklung der Website hat nicht nur meine technische Kompetenz gestärkt, sondern auch meine Fähigkeit zur Priorisierung und Reflektion im Entwicklungsprozess. Zukünftige Projekte werde ich weiterhin auf solide Datenmodellierung und iterative Verbesserungszyklen stützen. Die bewusste Auswahl der richtigen Optionen erweist sich als zentraler Erfolgsfaktor – dies gilt weit über Jekyll hinaus in der gesamten Softwareentwicklung.

[1]: https://jekyllrb.com/docs/templates/