---
title: "Blog"
excerpt: "Eine Sammlung von Beiträgen - eine vielfältige Mischung aus persönlichen Gedanken, interessanten Themen, Projekten und weiteren relevanten Aspekten, die bewegen und inspirieren."
permalink: /posts/
layout: single
author_profile: false
pagination:
  enabled: true
  collection: posts
  per_page: 6
  sort_field: "date"
  sort_reverse: true
header:
  overlay_image: /assets/images/background.jpg
  overlay_filter: 0.5
  caption: "Gedanken und Projekte"
---

Auf dieser Seite finden Sie eine Sammlung von Blogbeiträgen - eine bunte Mischung aus persönlichen Gedanken und allgemein interessanten Themen. Inspiriert durch Alltägliches, besondere Momente und Gespräche mit Freunden entsteht hier ein vielfältiges Mosaik an Gedanken. Ohne einem starren Konzept zu folgen, erscheinen neue Beiträge, wenn es die Zeit zulässt - **Qualität geht vor Regelmäßigkeit**.

<div class="notice--info feature-box" style="padding: 1.5em; margin: 2em 0; border-radius: 5px; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.2); border-left: 5px solid #05d9e8;">
  <div style="flex: 0 0 64px; margin-right: 1em;">
    <i class="fas fa-file-alt" style="font-size: 3em; color: #05d9e8;"></i>
  </div>
  <div>
    <h3 style="margin-top: 0; color: #ffffff;">Neu hier? Lernen Sie, wie Blogbeiträge erstellt werden</h3>
    <p>Erfahren Sie alles über die Technik und den Stil hinter den Blogbeiträgen. Dieser Leitfaden erklärt den gesamten Prozess und zeigt, wie Beiträge eigenständig erstellt werden können.</p>
    <a href="{{ "/posts/blogbeitrag-erstellen/" | relative_url }}" class="btn notice--info" >Zum Leitfaden <i class="fas fa-arrow-right"></i></a>
  </div>
</div>

{% assign postsByYear = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}

<div class="category-filter-container">
  <span class="filter-label">Schnellzugriff nach Jahr:</span>
  <div class="category-buttons" style="margin-top: 1em;">
    {% for year in postsByYear %}
      <a href="{{ '/archiv/#year-' | append: year.name | relative_url }}" class="btn btn--primary">{{ year.name }}</a>
    {% endfor %}
  </div>
  <div style="margin-top: 0.75em;">
    <a href="{{ '/archiv/' | relative_url }}" class="btn btn--info">Zum vollständigen Archiv</a>
    <a href="{{ '/categories/' | relative_url }}" class="btn btn--info">Kategorien</a>
    <a href="{{ '/tags/' | relative_url }}" class="btn btn--info">Tags</a>
  </div>
</div>

<div class="entries-{{ site.entries_layout | default: 'list' }}">
  {% for post in paginator.posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>

{% include paginator.html %}