---
title: "Die faszinierende Welt der Mandelbrot-Menge"
excerpt: "Tauchen Sie ein in die Welt mathematischer Fraktale und entdecken Sie die Schönheit der Mandelbrot-Menge. Durch interaktive Visualisierungen können Sie sowohl die Mandelbrot-Menge als auch ihre zugehörigen Julia-Mengen selbst erkunden und deren einzigartige Eigenschaften kennenlernen."
permalink: /mandelbrot/
layout: single
author_profile: true
classes: 
  - wide
  - mandelbrot-page
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
