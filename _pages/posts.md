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

<style>
  #blog-entries .post-item {
    border-radius: 8px;
    padding: 0.15em 0.2em; // 0.1em 0.3em
    transition: box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
  }

  #blog-entries .post-item:hover {
    box-shadow: 0 0 0 1px #f0f, 0 8px 18px rgba(240, 0, 255, 0.3);
    background-color: rgba(240, 0, 255, 0.06);
    transform: translateY(-1px);
  }

  #blog-entries .post-item:hover .archive__item-title a {
    color: #f0f;
  }
</style>

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
  <div style="display: flex; gap: 0.6em; flex-wrap: wrap; align-items: center;">
    <input id="blog-search-input" type="search" placeholder="Beiträge auf dieser Seite durchsuchen..." aria-label="Blogsuche"
      style="min-width: 220px; flex: 1 1 260px; padding: 0.55em 0.7em; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: #fff;">
    <button id="blog-search-clear" class="btn btn--primary" type="button">Zurücksetzen</button>
  </div>
  <div style="margin-top: 0.75em; margin-bottom: 1.5em;">
    <a href="{{ '/archiv/' | relative_url }}" class="btn btn--primary btn--large" style="box-shadow: 0 6px 16px rgba(0,0,0,0.35); letter-spacing: 0.02em;">Archiv</a>
  </div>
</div>

<div class="entries-{{ site.entries_layout | default: 'list' }}" id="blog-entries">
  {% for post in paginator.posts %}
    <div class="post-item" data-search="{{ post.title | strip | downcase }} {{ post.excerpt | strip | downcase }}">
      {% include archive-single.html %}
    </div>
  {% endfor %}
</div>

<div id="blog-empty-message" class="notice notice--warning" style="display: none; margin-top: 1em;">
  <p><i class="fas fa-exclamation-circle"></i> Keine Beiträge für diese Suche gefunden.</p>
</div>

{% include paginator.html %}

<script>
  (function() {
    var input = document.getElementById('blog-search-input');
    var clearBtn = document.getElementById('blog-search-clear');
    var entries = document.querySelectorAll('#blog-entries .post-item');
    var emptyMessage = document.getElementById('blog-empty-message');

    function normalize(value) {
      return (value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(input.value);
      var visibleCount = 0;
      entries.forEach(function(item) {
        var haystack = item.getAttribute('data-search') || '';
        var visible = query === '' || haystack.indexOf(query) !== -1;
        item.style.display = visible ? '' : 'none';
        if (visible) visibleCount += 1;
      });
      emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    input.addEventListener('input', applyFilter);
    clearBtn.addEventListener('click', function() {
      input.value = '';
      applyFilter();
      input.focus();
    });
  })();
</script>