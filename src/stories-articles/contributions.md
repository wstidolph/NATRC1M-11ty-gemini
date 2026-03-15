---
layout: base.njk
title: All Member Contributions
---

<div class="hero">
  <h2>All Member Contributions</h2>
  <p>Every story and article shared by our community.</p>
</div>

<div class="card">
  <ul class="contributions-list">
    {% for article in collections.contributions | reverse %}
      <li class="contribution-item">
        <a href="{{ article.url | url }}">{{ article.data.title }}</a>
        <div class="contribution-meta">
          By {{ article.data.author }} | {{ article.date | dateFilter }}
        </div>
        {% if article.data.summary %}
          <p style="margin-top: 10px; color: var(--color-text-muted);">{{ article.data.summary }}</p>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</div>

<div style="margin-top: 40px; text-align: center;">
  <a href="{{ '/stories-articles/' | url }}" class="btn btn-secondary">Back to Stories & Articles</a>
</div>
