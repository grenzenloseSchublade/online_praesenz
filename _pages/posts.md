---
title: "Blog"
excerpt: "Eine Sammlung an Beiträgen – eine bunte Mischung aus persönlichen Reflexionen, interessanten Themen, Projekten und alles was sonst noch bewegt."
permalink: /posts/
layout: posts
author_profile: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Gedanken und Projekte"
---

Auf dieser Seite findest du eine Sammlung an Blogbeiträgen – eine bunte Mischung aus persönlichen Reflexionen und allgemein interessanten Themen. Inspiriert durch Alltägliches, besondere Momente und Gespräche mit Freunden, entsteht hier ein vielfältiges Mosaik an Gedanken. Ohne einem starren Konzept zu folgen erscheinen neue Beiträge, wenn die Zeit es zulässt – Qualität steht über Regelmäßigkeit.

Die Artikel sind chronologisch sortiert, lassen sich aber auch bequem nach Kategorien und Tags durchsuchen.

<div class="notice--info feature-box" style="padding: 1.5em; margin: 2em 0; border-radius: 5px; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.2); border-left: 5px solid #05d9e8;">
  <div style="flex: 0 0 64px; margin-right: 1em;">
    <i class="fas fa-file-alt" style="font-size: 3em; color: #05d9e8;"></i>
  </div>
  <div>
    <h3 style="margin-top: 0; color: #ffffff;">Neu hier? Lerne, wie Blogbeiträge erstellt werden</h3>
    <p>Erfahre alles über die Technik und den Stil hinter den Blogbeiträgen. Dieser Leitfaden erklärt den gesamten Prozess und zeigt, wie Beiträge eigenständig erstellt werden können.</p>
    <a href="{{ site.baseurl }}{% post_url 2025-03-04-blogbeitrag-erstellen %}" class="btn btn--primary">Zum Leitfaden <i class="fas fa-arrow-right"></i></a>
  </div>
</div>

## Kategorien

<div class="category-buttons">
  {% for category in site.categories %}
    <a href="{{ site.baseurl }}/categories/#{{ category[0] | slugify }}" class="btn btn--primary">{{ category[0] }}</a>
  {% endfor %}
</div>

## Neueste Beiträge