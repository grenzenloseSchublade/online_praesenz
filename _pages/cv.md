---
title: "Curriculum Vitae"
permalink: /cv/
layout: single
author_profile: true
toc: true
toc_label: "Inhalt"
toc_icon: "graduation-cap"
toc_sticky: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Berufliche und akademische Laufbahn"
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

{% for section in site.data.cv %}
<span id="{{ section.section | slugify }}" class="section-anchor"></span>
## <i class="fas fa-{{ section.icon }}"></i> {{ section.section }}

{% capture inner_content %}
  {% if section.experiences %}
    {% include experiences.html experiences=section.experiences %}
  {% endif %}

  {% if section.education %}
    {% include education.html education=section.education %}
  {% endif %}

  {% if section.skill_categories %}
    {% include skills.html skill_categories=section.skill_categories %}
  {% endif %}

  {% if section.languages %}
    {% include languages.html languages=section.languages %}
  {% endif %}

  {% if section.awards %}
    {% include awards.html awards=section.awards %}
  {% endif %}
{% endcapture %}

{% include cv-section.html 
  icon=section.icon 
  title=section.section 
  content=section.content 
  inner_content=inner_content %}

{% endfor %} 