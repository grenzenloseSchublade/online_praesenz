---
title: "Wie Blogbeiträge auf dieser Website erstellt werden"
date: 2025-03-04
categories:
  - Tutorial
tags:
  - Jekyll
  - Blogging
  - Markdown
  - Minimal Mistakes
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Ein Einblick in die Technik hinter den Blogbeiträgen"
toc: true
toc_label: "Inhalt"
toc_icon: "file-alt"
toc_sticky: true
---

In diesem Beitrag wird ein Einblick in die Technik und den Stil gegeben, der hinter den Blogbeiträgen auf dieser Website steht. Wenn Sie einen Beitrag vorschlagen möchten, erfahren Sie hier, wie der technische Prozess abläuft und welche Formatierungsmöglichkeiten zur Verfügung stehen.

## Die technische Grundlage

Diese Website basiert auf [Jekyll](https://jekyllrb.com/), einem statischen Website-Generator, und verwendet das [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) Theme. Diese Kombination bietet eine hervorragende Grundlage für Blogbeiträge mit:

- Sauberer, responsiver Darstellung auf allen Geräten
- Schnellen Ladezeiten durch statische Seiten
- Umfangreichen Formatierungsmöglichkeiten durch Markdown
- Flexibler Metadaten-Verwaltung durch YAML-Frontmatter

## Das Post-Template

Für jeden Blogbeitrag wird ein standardisiertes Template verwendet, das unter `_templates/post-template.md` gespeichert ist. Dieses Template gewährleistet ein einheitliches Erscheinungsbild und enthält alle notwendigen Strukturelemente.

<a href="{{ site.baseurl }}/assets/downloads/post-template.md" class="btn btn--primary btn--large" download><i class="fas fa-download"></i> Template herunterladen</a>

Hier ist ein Blick auf den Anfang des Templates:

```yaml
---
title: "Titel des Blogbeitrags"
date: YYYY-MM-DD
categories:
  - Blog
  # Weitere Kategorien hier hinzufügen
tags:
  # Tags hier hinzufügen
header:
  teaser: "/assets/images/posts/teaser-bild.jpg"
  overlay_image: "/assets/images/posts/header-bild.jpg"
  overlay_filter: 0.5
  caption: "Bildunterschrift"
toc: true
toc_label: "Inhalt"
toc_sticky: true
---
```

## Der YAML-Frontmatter erklärt

Der Bereich am Anfang jedes Blogbeitrags, der von `---` umschlossen ist, wird als "Frontmatter" bezeichnet. Hier werden Metadaten für den Beitrag definiert:

- **title**: Der Titel des Beitrags, der oben auf der Seite angezeigt wird
- **date**: Das Veröffentlichungsdatum im Format YYYY-MM-DD
- **categories**: Eine oder mehrere Kategorien, denen der Beitrag zugeordnet wird
- **tags**: Schlagwörter, die den Inhalt des Beitrags beschreiben
- **header**: Einstellungen für das Headerbild
  - **teaser**: Ein kleineres Bild für die Vorschau in Listenansichten
  - **overlay_image**: Das große Bild am Anfang des Beitrags
  - **overlay_filter**: Eine Abdunkelung des Bildes (0.0 bis 1.0)
  - **caption**: Eine Bildunterschrift
- **toc**: Aktiviert das Inhaltsverzeichnis (true/false)
- **toc_label**: Die Überschrift des Inhaltsverzeichnisses
- **toc_sticky**: Lässt das Inhaltsverzeichnis beim Scrollen an der Seite haften (true/false)

## Markdown-Formatierung

Der Inhalt der Blogbeiträge wird in Markdown geschrieben, einer einfachen Auszeichnungssprache. Hier sind die wichtigsten Formatierungsmöglichkeiten, die verwendet werden:

### Überschriften

```markdown
## Überschrift Ebene 2
### Überschrift Ebene 3
#### Überschrift Ebene 4
```

### Listen

```markdown
- Ungeordneter Listenpunkt
- Noch ein Punkt
  - Eingerückter Unterpunkt

1. Nummerierter Listenpunkt
2. Zweiter Punkt
   1. Eingerückter Unterpunkt
```

### Hervorhebungen

```markdown
*Kursiver Text*
**Fetter Text**
***Fett und kursiv***
```

### Links

```markdown
[Linktext](https://www.beispiel.de)
[Link zu einem anderen Beitrag]({% post_url 2025-02-15-erster-beitrag %})
```

### Bilder

```markdown
![Alternativtext]({{ site.url }}{{ site.baseurl }}/assets/images/beispiel-bild.jpg)
```

### Code

```markdown
`Inline-Code`

```python
# Code-Block mit Syntax-Highlighting
def hello_world():
    print("Hallo Welt!")
```
```

### Zitate

```markdown
> Dies ist ein Zitat.
> Es kann mehrere Zeilen umfassen.
```

### Tabellen

```markdown
| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| Zeile 1  | Daten    | Daten    |
| Zeile 2  | Daten    | Daten    |
```

## Bilder in Blogbeiträgen

Bilder sind ein wichtiger Bestandteil der Blogbeiträge. Sie werden im Verzeichnis `assets/images/posts/` gespeichert und können wie folgt eingebunden werden:

```markdown
![Beschreibung]({{ site.url }}{{ site.baseurl }}/assets/images/posts/mein-bild.jpg)
```

Für das Header-Bild und das Teaser-Bild werden die Pfade im Frontmatter angegeben:

```yaml
header:
  teaser: "/assets/images/posts/teaser-bild.jpg"
  overlay_image: "/assets/images/posts/header-bild.jpg"
```

## Einen Blogbeitrag vorschlagen

Wenn Sie einen Blogbeitrag für diese Website vorschlagen möchten, gehen Sie bitte wie folgt vor:

1. **Kontaktiere den Administrator**: Senden Sie eine E-Mail an den Website-Administrator (mich) mit Ihrem Vorschlag.
2. **Bereite Ihren Inhalt vor**: Wenn möglich, formatieren Sie Ihren Beitrag bereits in Markdown und orientieren Sie sich am oben beschriebenen Stil. Sie können das [Template herunterladen](#das-post-template) und als Grundlage verwenden.
3. **Füge Metadaten hinzu**: Schlagen Sie Kategorien, Tags und ggf. Bilder für Ihren Beitrag vor.

Als Administrator werde ich Ihren Beitrag prüfen, ggf. anpassen und auf der Website veröffentlichen. Nur Administratoren haben direkten Zugriff auf das Repository und können Beiträge hinzufügen.

## Qualitätsstandards für Blogbeiträge

Um die Qualität und Konsistenz der Blogbeiträge zu gewährleisten, werden folgende Standards beachtet:

1. **Klare Struktur**: Jeder Beitrag hat eine logische Gliederung mit Überschriften.
2. **Kurze Absätze**: Halten Sie Absätze kurz und prägnant für bessere Lesbarkeit.
3. **Visuelle Elemente**: Wo sinnvoll, fügen Sie Bilder, Diagramme oder Code-Beispiele ein.
4. **Konsistenter Stil**: Verwenden Sie einen einheitlichen Schreibstil.
5. **Sorgfältige Korrektur**: Alle Beiträge werden auf Rechtschreib- und Grammatikfehler geprüft.
6. **Relevante Metadaten**: Wählen Sie passende Kategorien und Tags für bessere Auffindbarkeit.

## Fazit

Die Blogbeiträge auf dieser Website folgen einem durchdachten technischen und stilistischen Konzept. Durch die Verwendung von Jekyll, Markdown und dem Minimal Mistakes Theme können Sie ansprechende, gut strukturierte Inhalte präsentieren.

Wenn Sie Fragen zur Technik hinter den Blogbeiträgen haben oder einen eigenen Beitrag vorschlagen möchten, kontaktieren Sie mich gerne direkt. Ich freue mich über Ihr Interesse!
