---
title: "Curriculum Vitae"
excerpt: "Elektrotechnik, Eingebettete Systeme, Machine Learning – ein Werdegang zwischen Theorie und Praxis."
permalink: /cv-old/
layout: single
author_profile: true
toc: true
toc_label: "Inhalt"
toc_icon: "list"
toc_sticky: true
toc_collapse: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Berufliche und akademische Laufbahn"
---

<div class="notice">
  <p>Diese Seite zeigt den Lebenslauf im ursprünglichen Stil. Wenn Sie den Lebenslauf im neuen Stil sehen möchten, klicken Sie bitte <a href="{{ '/cv/' | relative_url }}">hier</a>.</p>
</div>

{% for section in site.data.cv %}
<span id="{{ section.section | slugify }}" class="section-anchor"></span>
## <i class="fas fa-{{ section.icon }}"></i> {{ section.section }}

{% capture inner_content %}
  {% if section.experiences %}
    {% include cv-experience.html experiences=section.experiences %}
  {% endif %}

  {% if section.education %}
    {% include cv-education.html education=section.education %}
  {% endif %}

  {% if section.skill_categories %}
    {% include cv-skills.html skill_categories=section.skill_categories %}
  {% endif %}

  {% if section.languages %}
    {% include cv-languages.html languages=section.languages %}
  {% endif %}

  {% if section.awards %}
    {% include cv-awards.html awards=section.awards %}
  {% endif %}
{% endcapture %}

{% include profile-section.html 
  icon=section.icon 
  title=section.section 
  content=section.content 
  inner_content=inner_content %}

{% endfor %} 