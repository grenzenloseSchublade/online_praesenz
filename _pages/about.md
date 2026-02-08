---
title: "Über mich"
excerpt: "Ingenieur aus Leidenschaft, Autodidakt aus Überzeugung – ein Profil zwischen Technik und Neugier."
permalink: /about/
layout: single
author_profile: true
toc: false
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Der Mensch hinter den Projekten"
---

<div class="about-container">
{% assign sections_by_name = site.data.about | group_by: "section" %}

<div class="notice--info feature-box about-intro">
  <details>
    <summary class="about-intro__summary">
      <div class="feature-box__icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <h3 class="about-intro__title">Über diese Seite – Entstehung und Philosophie</h3>
    </summary>
    <div class="about-intro__content">
      <p>
        Auch wenn es anfänglich eine Zeit dauern wird dieses Vorhaben, all die verschiedenen Projekte und Gedanken entsprechend aufzubereiten und zu dokumentieren,  
        so ist es mir wichtig diese Dinge auch für mich selbst festzuhalten. So steht an erster Stelle Qualität und Einträge werden ohne Zeitdruck und unter Wohlbefinden erstellt und umgesetzt.

        Für ein Projekt bringe ich mir im Allgemeinen schrittweise autodidaktisch Grundlagen und alle notwendigen Fähigkeiten bei. 
        Dabei ist es wichtig, dass ich mich selbst motiviere und die Herausforderungen so lange angehe, bis das gewünschte Ergebnis erreicht ist.
        Daher wird keinerlei Zeitrahmen für die Aktualisierung dieser Seite angegeben.
        <br>
        <br>
        <strong>Ich hoffe, dass Ihnen diese Seite gefällt und Sie viel Freude daran haben.</strong>
      </p>
    </div>
  </details>
</div>

{% for section in site.data.about %}
  {% if section.section != "Kontakt" and section.section != "Inspirierende Zitate" %}
    <span id="{{ section.section | slugify }}" class="section-anchor"></span>
    <div class="about-section {% if section.section == 'Wer bin ich?' %}section-wer-bin-ich{% elsif section.section == 'Meine Interessen' %}section-meine-interessen{% elsif section.section == 'Meine Projekte' %}section-meine-projekte{% endif %}">
      <h2 id="{{ section.section | slugify }}-heading"><i class="fas fa-{{ section.icon }}"></i> {{ section.section }}</h2>


      {% if section.section == "Meine Interessen" %}
        <p>Hier ist ein Überblick über die vielfältigen Interessen und Leidenschaften, die mich antreiben und inspirieren.</p>
      {% endif %}
      
      {% if section.section == "Meine Projekte" %}
        <p>Einige der spannendsten Projekte, mit denen ich mich beschäftigt habe.</p>
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