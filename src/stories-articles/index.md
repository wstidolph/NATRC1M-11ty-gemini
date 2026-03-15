---
layout: base.njk
title: Stories & Articles
---

<div class="hero">
  <h2>Stories, Articles, Blogs, etc.</h2>
  <p>Learn more about Competitive Trail Riding from our members' experiences.</p>
</div>

<div class="content-grid">
  <div class="card card-featured">
    <h3>New Rider Information</h3>
    <p>This section has information that might be useful to you as you gear up for a ride: answers to frequently asked questions and answers to infrequently-asked-questions-that-should-be-asked-more-often, first-ride stories, "how-tos", etc.</p>
    <ul>
      <li><a href="{{ '/articles/ADayInTheLife/' | url }}" target="_blank">A Day in the Life of a NATRC Ride</a></li>
      <li><a href="{{ '/articles/Ride_Your_Own_Ride/' | url }}" target="_blank">Ride Your Own Ride</a></li>
      <li><a href="{{ '/articles/Judging_Explained/' | url }}" target="_blank">Horsemanship Judging Explained</a></li>
      <li><a href="{{ '/articles/taking_juniors_to_natrc_rides/' | url }}" target="_blank">Taking Juniors to NATRC Rides</a></li>
      <li><a href="{{ '/articles/NATRC_101/' | url }}" target="_blank">NATRC 101</a></li>
      <li><a href="{{ '/articles/FAQ/' | url }}" target="_blank">Frequently Asked Questions</a></li>
      <li><a href="https://www.natrcregion1.org/Articles/RIDE%20CHECKLIST.pdf" target="_blank">Things to bring to a NATRC ride (PDF)</a></li>
    </ul>
  </div>

  <div class="card" style="grid-column: 1 / -1;">
    <h3>Ride Stories</h3>
    <p>Catherine de la Cruz finished her first NATRC ride at Jackson Forest. At age 74. <a href="{{ '/articles/Differently-abledRider/' | url }}" target="_blank">Here's her story.</a></p>
    <ul>
      <li><a href="http://wp.me/p2kYH8-3c" target="_blank">2012 Round Valley blog entry (Ellis)</a></li>
      <li><a href="http://fullheartsfarm.wordpress.com/2012/06/08/cowboy-campers/" target="_blank">Cowboy Camp, 2012 (Ellis)</a></li>
      <li><a href="http://fullheartsfarm.wordpress.com/2012/06/06/slow-horse-in-the-winners-circle/" target="_blank">Mt Diablo Spring Ride (Mary-Ellis Arnold)</a></li>
      <li><a href="{{ '/articles/MtDiablo2012/' | url }}" target="_blank">Mt Diablo Spring Ride 2012</a></li>
      <li><a href="{{ '/articles/CowboyCampInaugural/' | url }}" target="_blank">Inaugural Cowboy Camp 2011</a></li>
      <li><a href="{{ '/articles/CMDTRA_story/' | url }}" target="_blank">The Story of the first Diablo Springs ride in 1941</a></li>
    </ul>
  </div>

  <div class="card">
    <h3>Region 1 Remembrances</h3>
    <p>Honoring the riders, friends, and legends of NATRC Region 1.</p>
    <a href="{{ '/articles/Remembrances/' | url }}" class="btn btn-primary" style="margin-top: 10px;">View Remembrances</a>
  </div>

  <div class="card">
    <h3>Trail News Archives</h3>
    <ul>
      <li><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_Summer_2020.pdf" target="_blank">Summer 2020</a></li>
      <li><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_Winter_2020.pdf" target="_blank">Winter 2020</a></li>
      <li><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_April_2016.pdf" target="_blank">April 2016</a></li>
      <li><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_Nov_2015.pdf" target="_blank">November 2015</a></li>
    </ul>
    <p style="margin-top: 15px;"><a href="https://www.natrcregion1.org/Articles/R1_Bylaws_080316.pdf" target="_blank">Region 1 Bylaws</a></p>
  </div>

  <div class="card" style="grid-column: 1 / -1; border: 2px solid var(--color-primary-dark);">
    <h3>Member Contributions</h3>
    <p>Recently submitted stories and articles from our members.</p>
    
    {% set articles = collections.contributions | reverse %}
    
    {% if articles.length > 0 %}
      <!-- Desktop/Tablet View: Top 5 List -->
      <div class="desktop-only">
        <ul class="contributions-list">
          {% for article in articles.slice(0, 5) %}
            <li class="contribution-item">
              <a href="{{ article.url | url }}">{{ article.data.title }}</a>
              <div class="contribution-meta">
                By {{ article.data.author }} | {{ article.date | dateFilter }}
              </div>
            </li>
          {% endfor %}
        </ul>
        {% if articles.length > 5 %}
          <p style="margin-top: 20px;"><a href="{{ '/stories-articles/contributions/' | url }}" class="btn btn-secondary" style="margin-top: 20px;">More Contributions...</a></p>
        {% endif %}
      </div>

      <!-- Mobile View: Select Dropdown -->
      <div class="mobile-only">
        <select class="draft-select-control" onchange="window.location.href = this.value">
          <option value="">-- Read a Member Story --</option>
          {% for article in articles %}
            <option value="{{ article.url | url }}">{{ article.data.title }} (by {{ article.data.author }})</option>
          {% endfor %}
        </select>
        {% if articles.length > 5 %}
           <p style="margin-top: 15px; text-align: center;"><a href="{{ '/stories-articles/contributions/' | url }}">View All Contributions</a></p>
        {% endif %}
      </div>
    {% else %}
      <p><em>No contributions yet. Be the first to share your story!</em></p>
    {% endif %}
  </div>
</div>

<div style="text-align: center; margin-top: 60px; padding: 40px; background-color: var(--color-secondary); border-radius: var(--border-radius);">
  <h3>Have a story to share?</h3>
  <p>We'd love to hear about your NATRC experiences! You can now write and submit your own articles directly.</p>
  <a href="{{ '/admin/add-article/' | url }}" class="btn btn-primary" style="margin-top: 15px;">Write a Story</a>
</div>
