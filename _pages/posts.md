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

{{ "Auf dieser Seite finden Sie eine Sammlung von Blogbeiträgen - eine bunte Mischung aus persönlichen Gedanken und allgemein interessanten Themen. Inspiriert durch Alltägliches, besondere Momente und Gespräche mit Freunden entsteht hier ein vielfältiges Mosaik an Gedanken. Ohne einem starren Konzept zu folgen, erscheinen neue Beiträge, wenn es die Zeit zulässt - **Qualität geht vor Regelmäßigkeit**." | markdownify }}

<div class="notice--info feature-box feature-box--with-icon">
  <div class="feature-box__icon">
    <i class="fas fa-file-alt"></i>
  </div>
  <div>
    <h3 class="feature-box__title">Neu hier? Lernen Sie, wie Blogbeiträge erstellt werden</h3>
    <p>Erfahren Sie alles über die Technik und den Stil hinter den Blogbeiträgen. Dieser Leitfaden erklärt den gesamten Prozess und zeigt, wie Beiträge eigenständig erstellt werden können.</p>
    <a href="{{ "/posts/blogbeitrag-erstellen/" | relative_url }}" class="btn notice--info" >Zum Leitfaden <i class="fas fa-arrow-right"></i></a>
  </div>
</div>

<div class="category-filter-container">
  <div class="blog-filter-row">
    <input id="blog-search-input" class="blog-search-input" type="search" placeholder="Beiträge auf dieser Seite durchsuchen..." aria-label="Blogsuche">
    <button id="blog-search-clear" class="btn btn--primary" type="button">Zurücksetzen</button>
  </div>
  <div class="blog-filter-actions">
    <a href="{{ '/archiv/' | relative_url }}" class="btn btn--primary btn--large blog-archive-button">Archiv</a>
  </div>
</div>

<div class="entries-{{ site.entries_layout | default: 'list' }}" id="blog-entries">
  {% for post in paginator.posts %}
    <div class="post-item" data-search="{{ post.title | strip | downcase }} {{ post.excerpt | strip | downcase }}">
      {% include archive-single.html %}
    </div>
  {% endfor %}
</div>

<div id="blog-empty-message" class="notice notice--warning blog-empty-message">
  <p><i class="fas fa-exclamation-circle"></i> Keine Beiträge für diese Suche gefunden.</p>
</div>

{% include paginator.html %}