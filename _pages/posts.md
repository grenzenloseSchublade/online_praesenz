---
title: "Blog"
excerpt: "Eine Sammlung von Beiträgen - eine vielfältige Mischung aus persönlichen Gedanken, interessanten Themen, Projekten und weiteren relevanten Aspekten, die bewegen und inspirieren."
permalink: /posts/
layout: single
author_profile: false
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

<div class="category-filter-container">
  <span class="filter-label">Die Artikel sind chronologisch sortiert und können nach Kategorien gefiltert werden:</span>
  <div class="category-buttons" style="margin-top: 1em;">
    <a href="#" class="btn btn--primary filter-category active" data-category="all">Alle</a>
    {% for category in site.categories %}
      <a href="#" class="btn btn--primary filter-category" data-category="{{ category[0] | slugify }}">{{ category[0] }}</a>
    {% endfor %}
  </div>
</div>

<div id="posts-container">
  <!-- Jahres-Gruppen-Ansicht -->
  <div id="yearly-groups-view">
    {% assign postsByYear = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}
    {% for year in postsByYear %}
      <section id="year-{{ year.name }}" class="taxonomy__section">
        <h2 class="archive__subtitle">{{ year.name }}</h2>
        <div class="entries-{{ site.entries_layout | default: 'list' }}">
          {% for post in year.items %}
            <div class="post-item" data-categories="{% for category in post.categories %}{{ category | slugify }} {% endfor %}">
              {% include archive-single.html %}
            </div>
          {% endfor %}
        </div>
      </section>
    {% endfor %}
  </div>
  
  <!-- Leere Kategorie Meldung -->
  <div id="empty-category-message" class="notice notice--warning" style="display: none;">
    <p><i class="fas fa-exclamation-circle"></i> Keine Beiträge in dieser Kategorie gefunden.</p>
  </div>
</div>

<!-- Kategoriefilterung einbinden -->
<script src="{{ site.baseurl }}/assets/js/category-filter.js"></script>