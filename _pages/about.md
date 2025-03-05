---
title: "Über mich"
excerpt: "Eine kurze Einführung in meine Person und meine Interessen."
permalink: /about/
layout: single
author_profile: true
toc: true
toc_label: "Inhalt"
toc_icon: "user-circle"
toc_collapse: true
toc_sticky: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Persönliches Profil und Interessen"
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

  {% if section.quote %}
    {% include quote.html author=section.quote.author text=section.quote.text %}
  {% endif %}

  {% if section.quotes %}
    {% for quote in section.quotes %}
      {% include quote.html author=quote.author text=quote.text %}
    {% endfor %}
  {% endif %}
{% endcapture %}

{% include cv-section.html 
  icon=section.icon 
  title=section.section 
  content=section.content 
  inner_content=inner_content %}

{% endfor %} 