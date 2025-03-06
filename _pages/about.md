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

<div class="about-container">
{% for section in site.data.about %}
  <span id="{{ section.section | slugify }}" class="section-anchor"></span>
  <div class="about-section {% if section.section == 'Wer bin ich?' %}section-wer-bin-ich{% elsif section.section == 'Meine Interessen' %}section-meine-interessen{% elsif section.section == 'Meine Projekte' %}section-meine-projekte{% endif %}">
    <h2 id="{{ section.section | slugify }}-heading"><i class="fas fa-{{ section.icon }}"></i> {{ section.section }}</h2>
    
    {% if section.content %}
      <p>{{ section.content }}</p>
    {% endif %}
    
    {% if section.interests %}
      {% include about-interests.html interests=section.interests %}
    {% endif %}
    
    {% if section.skills %}
      {% include about-skills.html skill_categories=section.skills %}
    {% endif %}
    
    {% if section.contact_info %}
      {% include about-contact.html contact_info=section.contact_info %}
    {% endif %}
    
    {% if section.quote %}
      <div class="quote-container">
        <div class="quote-text">
          <p>"{{ section.quote.text }}"</p>
        </div>
        <div class="quote-author">
          <p>— {{ section.quote.author }}</p>
        </div>
      </div>
    {% endif %}
    
    {% if section.quotes %}
      <div class="quotes-container">
      {% for quote in section.quotes %}
        <div class="quote-container">
          <div class="quote-text">
            <p>"{{ quote.text }}"</p>
          </div>
          <div class="quote-author">
            <p>— {{ quote.author }}</p>
          </div>
        </div>
      {% endfor %}
      </div>
    {% endif %}
  </div>
{% endfor %}
</div> 