---
title: "Curriculum Vitae"
excerpt: "Eine detaillierte Übersicht über meine berufliche und akademische Laufbahn"
permalink: /cv/
layout: single
author_profile: true
toc: true
toc_label: "Inhalt"
toc_icon: "graduation-cap"
toc_sticky: true
toc_collapse: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Berufliche und akademische Laufbahn"
---

<div class="notice">
  <p>Diese Seite zeigt den Lebenslauf im neuen modernen Stil. Wenn Sie den Lebenslauf im ursprünglichen Stil sehen möchten, klicken Sie bitte <a href="{{ site.baseurl }}/cv-old/">hier</a>.</p>
</div>

<div class="about-container">
{% for section in site.data.cv %}
<span id="{{ section.section | slugify }}" class="section-anchor"></span>
<div class="cv-section-about-style">
  <h2 id="{{ section.section | slugify }}-heading"><i class="fas fa-{{ section.icon }}"></i> {{ section.section }}</h2>
  
  <div class="cv-section-content">
    {% if section.content %}
    <p>{{ section.content }}</p>
    {% endif %}
    
    {% if section.experiences %}
      <div class="cv-entries-container-about-style experiences-container">
        {% include cv-experience-about-style.html experiences=section.experiences %}
      </div>
    {% endif %}

    {% if section.education %}
      <div class="cv-entries-container-about-style">
        {% include cv-education-about-style.html educations=section.education %}
      </div>
    {% endif %}

    {% if section.skill_categories %}
      {% include cv-skills-about-style.html skill_categories=section.skill_categories %}
    {% endif %}

    {% if section.languages %}
      {% include cv-languages-about-style.html languages=section.languages %}
    {% endif %}

    {% if section.awards %}
      {% include cv-awards-about-style.html awards=section.awards %}
    {% endif %}
  </div>
</div>
{% endfor %}
</div> 