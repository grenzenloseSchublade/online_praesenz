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

Hier finden Sie alle meine Blogbeiträge zu verschiedenen Themen. Die Beiträge sind nach Datum sortiert, können aber auch nach Kategorien und Tags gefiltert werden.

## Kategorien

<div class="category-buttons">
  {% for category in site.categories %}
    <a href="/categories/#{{ category[0] | slugify }}" class="btn btn--primary">{{ category[0] }}</a>
  {% endfor %}
</div>

## Neueste Beiträge 