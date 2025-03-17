---
title: "Über mich"
excerpt: "Eine kurze Einführung in meine Person und meine Interessen."
permalink: /about/
layout: single
author_profile: true
toc: false
# toc_label: "Inhalt"
# toc_icon: "user-circle"
# toc_collapse: true
# toc_sticky: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Persönliches Profil und Interessen"
---

<div class="about-container">
{% assign sections_by_name = site.data.about | group_by: "section" %}

<div class="notice--info feature-box" style="padding: 1.5em; margin: 2em 0; border-radius: 5px; background-color: rgba(0, 0, 0, 0.2); border-left: 5px solid #05d9e8;">
  <details>
    <summary style="display: flex; align-items: center; cursor: pointer;">
      <div style="flex: 0 0 64px; margin-right: 1em;">
        <i class="fas fa-file-alt" style="font-size: 3em; color: #05d9e8;"></i>
      </div>
      <h3 style="margin: 0; color: #ffffff;">Wie gehts es weiter? Lesen Sie hier, was mit dieser Seite passieren wird.</h3>
    </summary>
    <div style="margin-top: 1em;">
      <p>
        Auch wenn es anfänglich eine Zeit dauern wird dieses Vorhaben, all die verschiedenen Projekte und Gedanken entsprechend aufzubereiten und zu dokumentieren,  
        so ist es mir wichtig diese Dinge auch für mich selbst festzuhalten. So steht an erster Stelle Qualität und Einträge werden ohne Zeitdruck und unter Wohlbefinden erstellt und umgesetzt.

        Für ein Projekt bringe ich mir im Allgemeinen schrittweise autodidaktisch Grundlagen und alle notwendigen Fähigkeiten bei. 
        Dabei ist es wichtig, dass ich mich selbst motiviere und die Herausforderungen so lange angehen, bis ich das gewünschte Ergebnis erreicht habe.
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