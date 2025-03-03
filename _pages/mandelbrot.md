---
title: "Die faszinierende Welt der Mandelbrot-Menge"
permalink: /mandelbrot/
layout: single
classes: wide
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
      url: "/mandelbrot/#interaktive-julia-menge"
    - label: "Mandelbrot-Julia-Explorer"
      url: "/mandelbrot/#interaktiver-mandelbrot-julia-explorer"
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

{% comment %}
Entfernung der doppelten H1-Überschrift, da der Seitentitel bereits als H1 angezeigt wird
{% endcomment %}

{% for section in site.data.mandelbrot.sections %}
<span id="{{ section.section | slugify }}" class="section-anchor"></span>

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
