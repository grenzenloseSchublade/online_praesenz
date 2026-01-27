---
title: "Die faszinierende Welt der Mandelbrot-Menge"
excerpt: "Tauchen Sie ein in die Welt mathematischer Fraktale und entdecken Sie die Schönheit der Mandelbrot-Menge. Durch interaktive Visualisierungen können Sie sowohl die Mandelbrot-Menge als auch ihre zugehörigen Julia-Mengen selbst erkunden und deren einzigartige Eigenschaften kennenlernen."
permalink: /mandelbrot/
layout: single
author_profile: true
classes: 
  - wide
  #- full-width-page
mathjax: true
toc: true
toc_label: "Inhalt"
toc_icon: "list"
toc_collapse: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Die unendliche Schönheit mathematischer Strukturen"
  actions:
    - label: "Interaktive Julia-Menge"
      url: "/mandelbrot/#julia-container"
    - label: "Mandelbrot-Julia-Explorer"
      url: "/mandelbrot/#explorer-container"
---

<style>
/* Stelle sicher, dass die Anker-Links korrekt funktionieren */
.section-anchor {
  display: block;
  position: relative;
  top: -100px;
  visibility: hidden;
}

/* Erhöhe die Höhe des Header-Bildes */
.page__hero--overlay {
  min-height: 250px !important; /* Passe diesen Wert nach Bedarf an */
}

@media (max-width: 768px) {
  .page__inner-wrap {
    width: 100%;
    max-width: 100vw;
    padding-right: 0;
    padding-left: 0;
  }
  
  .page__content {
    padding: 0;
  }

  .julia-container,
  .explorer-container {
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    border-radius: 0;
    padding-left: 12px;
    padding-right: 12px;
    box-sizing: border-box;
  }
}
</style>

{% for section in site.data.mandelbrot.sections %}
<span id="{% if section.anchor %}{{ section.anchor }}{% else %}{{ section.section | slugify }}{% endif %}" class="section-anchor"></span>

## <i class="fas fa-{{ section.icon }}"></i> {{ section.section }}

{{ section.content | markdownify }}

{% if section.include %}
  {% include {{ section.include }} %}
{% endif %}

{% if section.subsections %}
  {% for subsection in section.subsections %}
### {{ subsection.title }}

{{ subsection.content | markdownify }}
  {% endfor %}
{% endif %}

{% endfor %}
