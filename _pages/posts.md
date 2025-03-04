---
title: "Blog"
permalink: /posts/
layout: posts
author_profile: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Meine Gedanken und Projekte"
---

Auf dieser Seite findest du eine Sammlung an Blogbeiträgen – eine bunte Mischung aus persönlichen Reflexionen und allgemein interessanten Themen. Inspiriert durch Alltägliches, besondere Momente und Gespräche mit Freunden, entsteht hier ein vielfältiges Mosaik an Gedanken. Ohne einem starren Konzept zu folgen erscheinen neue Beiträge, wenn die Zeit es zulässt – Qualität steht über Regelmäßigkeit.

Die Artikel sind chronologisch sortiert, lassen sich aber auch bequem nach Kategorien und Tags durchsuchen.

## Kategorien

<div class="category-buttons">
  {% for category in site.categories %}
    <a href="{{ site.baseurl }}/categories/#{{ category[0] | slugify }}" class="btn btn--primary">{{ category[0] }}</a>
  {% endfor %}
</div>

## Neueste Beiträge 