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
{% assign sections_by_name = site.data.about | group_by: "section" %}


{% for section in site.data.about %}
  {% if section.section != "Kontakt" and section.section != "Inspirierende Zitate" %}
    <span id="{{ section.section | slugify }}" class="section-anchor"></span>
    <div class="about-section {% if section.section == 'Wer bin ich?' %}section-wer-bin-ich{% elsif section.section == 'Meine Interessen' %}section-meine-interessen{% elsif section.section == 'Meine Projekte' %}section-meine-projekte{% endif %}">
      <h2 id="{{ section.section | slugify }}-heading"><i class="fas fa-{{ section.icon }}"></i> {{ section.section }}</h2>
      
      {% if section.section == "Meine Interessen" %}
        <p>Hier findest du einen Überblick über meine vielfältigen Interessen und Leidenschaften, die mich antreiben und inspirieren.</p>
      {% endif %}
      
      {% if section.section == "Meine Projekte" %}
        <p>Entdecke einige meiner spannendsten Projekte, an denen ich gearbeitet habe oder aktuell arbeite.</p>
      {% endif %}
      
      {% if section.content %}
        <p>{{ section.content }}</p>
      {% endif %}
      
      {% if section.interests %}
        {% include about-interests.html interests=section.interests %}
      {% endif %}
      
      {% if section.skills %}
        {% include about-skills.html skill_categories=section.skills %}
      {% endif %}
    </div>
  {% endif %}
{% endfor %}

<!-- Kontakt und Zitate nebeneinander -->
<div class="contact-quotes-container">
  {% for section in site.data.about %}
    {% if section.section == "Kontakt" or section.section == "Inspirierende Zitate" %}
      <span id="{{ section.section | slugify }}" class="section-anchor"></span>
      <div class="about-section">
        <h2 id="{{ section.section | slugify }}-heading"><i class="fas fa-{{ section.icon }}"></i> {{ section.section }}</h2>
        
        {% if section.content %}
          <p>{{ section.content }}</p>
        {% endif %}
        
        {% if section.contact_info %}
          <div class="contact-container">
            {% include about-contact.html contact_info=section.contact_info %}
          </div>
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
    {% endif %}
  {% endfor %}
</div>
</div> 