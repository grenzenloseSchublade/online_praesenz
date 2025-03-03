# Meine Jekyll Website mit Minimal Mistakes

Dies ist eine persönliche Website, die mit Jekyll und dem Minimal Mistakes Theme erstellt wurde.

## TODO
- about me mit inhalt füllen
- lebenslauf mit inhalt füllen
- 
- Touch funktion für Zoom Mandelbrotmenge vernünftig umsetzen
- 
- clean up python scripts
  - mandelbrot calculation
  - julia calculation
  - mandelbrot animation
  - julia animation


 
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

## Markdown und Kramdown

Kramdown ist der Standard-Markdown-Prozessor für Jekyll und spielt eine wichtige Rolle bei der Verarbeitung mathematischer Formeln:

### Was ist Kramdown?
- Ein leistungsfähiger Markdown-Parser für Ruby
- Standardmäßig in Jekyll integriert
- Unterstützt erweiterte Funktionen wie Fußnoten, Definitionen und mathematische Formeln
- Bietet bessere Unterstützung für HTML-Ausgabe als andere Markdown-Parser

### Kramdown und MathJax
Die Kramdown-Konfiguration ist entscheidend für die korrekte Darstellung mathematischer Formeln:

```yaml
markdown: kramdown
kramdown:
  math_engine: mathjax    # Verwendet MathJax zur Formeldarstellung
  input: GFM             # GitHub Flavored Markdown
  syntax_highlighter: rouge
```

### Häufige Kramdown-bezogene Probleme
1. **Falsche Formeldarstellung**
   - Überprüfen Sie, ob `math_engine: mathjax` in `_config.yml` gesetzt ist
   - Stellen Sie sicher, dass keine Leerzeilen in Formeln sind
   - Escapen Sie Unterstriche in Formeln: `a\_b` statt `a_b`

2. **Parsing-Fehler**
   - Verwenden Sie `{: .class}` für Kramdown-spezifische Attribute
   - Achten Sie auf korrekte Einrückung in Listen
   - Vermeiden Sie Mischung von Tabs und Leerzeichen

3. **GFM-Kompatibilität**
   - `input: GFM` ermöglicht GitHub-Flavored Markdown
   - Unterstützt Tabellen und durchgestrichenen Text
   - Beachten Sie die unterschiedliche Behandlung von Unterstrichen

### Kramdown-Tipps
1. **Mathematische Formeln**
   ```markdown
   $$ 
   \begin{align*}
   y &= mx + b \\
   y &= 2x + 1
   \end{align*}
   $$
   ```

2. **Attribute**
   ```markdown
   {: .notice--info}
   Dieser Text erhält eine spezielle Formatierung
   ```

3. **Fußnoten**
   ```markdown
   Ein Text mit einer Fußnote[^1]
   [^1]: Dies ist die Fußnote
   ```

## Mathematische Formeln mit MathJax

Diese Website unterstützt mathematische Formeln durch MathJax. Die Konfiguration erfolgt in zwei Dateien:

### 1. _config.yml
```yaml
# Math Settings
markdown: kramdown
mathjax: true
kramdown:
  math_engine: mathjax
  syntax_highlighter: rouge
  input: GFM

# MathJax specific settings
head_scripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS-MML_HTMLorMML
```

### 2. _includes/head/custom.html
```html
{% if page.mathjax %}
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    displayMath: [['$$','$$'], ['\\[','\\]']],
    processEscapes: true,
    skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  },
  messageStyle: "none",
  TeX: {
    equationNumbers: { autoNumber: "AMS" },
    extensions: ["AMSmath.js", "AMSsymbols.js"]
  },
  CommonHTML: { linebreaks: { automatic: true } },
  "HTML-CSS": { linebreaks: { automatic: true } },
  SVG: { linebreaks: { automatic: true } }
});
</script>
{% endif %}
```

### Verwendung in Markdown-Dateien
1. Aktivieren Sie MathJax im Frontmatter der Seite:
   ```yaml
   ---
   title: "Meine Seite"
   mathjax: true
   ---
   ```

2. Verwenden Sie LaTeX-Syntax:
   - Inline-Formeln: `$E = mc^2$`
   - Display-Formeln: `$$\sum_{i=1}^n i = \frac{n(n+1)}{2}$$`

## Troubleshooting

### MathJax-Probleme

Wenn mathematische Formeln nicht korrekt angezeigt werden:

1. Cache leeren:
   ```bash
   rm -rf .jekyll-cache
   bundle exec jekyll clean
   ```

2. Überprüfen Sie die folgenden Punkte:
   - `mathjax: true` ist im Frontmatter der Seite gesetzt
   - Die MathJax-Version in `_config.yml` ist korrekt (2.7.7 empfohlen)
   - Die LaTeX-Syntax verwendet `$$` für Display-Math und `$` für Inline-Math
   - Der Browser-Cache wurde geleert

3. Server neu starten:
   ```bash
   bundle exec jekyll serve
   ```

### Allgemeine Probleme

1. Bei Gem-Konflikten:
   ```bash
   bundle clean --force
   bundle install
   ```

2. Bei Jekyll-Build-Fehlern:
   ```bash
   bundle update
   bundle exec jekyll build --trace
   ```

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
- [MathJax Dokumentation](https://docs.mathjax.org/) 
