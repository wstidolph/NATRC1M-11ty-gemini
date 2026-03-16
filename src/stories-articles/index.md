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
    <p>Useful resources for gearing up: FAQs, "how-tos", and first-ride advice.</p>
    <ul>
      <li><a href="{{ '/articles/ADayInTheLife/' | url }}">A Day in the Life of a NATRC Ride</a></li>
      <li><a href="{{ '/articles/Ride_Your_Own_Ride/' | url }}">Ride Your Own Ride</a></li>
      <li><a href="{{ '/articles/Judging_Explained/' | url }}">Horsemanship Judging Explained</a></li>
      <li><a href="{{ '/articles/taking_juniors_to_natrc_rides/' | url }}">Taking Juniors to NATRC Rides</a></li>
      <li><a href="{{ '/articles/NATRC_101/' | url }}">NATRC 101</a></li>
      <li><a href="{{ '/articles/FAQ/' | url }}">Frequently Asked Questions</a></li>
      <li><a href="https://www.natrcregion1.org/Articles/RIDE%20CHECKLIST.pdf" target="_blank">Things to bring to a NATRC ride (PDF) <i class="fas fa-external-link-alt" style="font-size: 0.8em;"></i></a></li>
    </ul>
  </div>

  <div class="card" style="grid-column: 1 / -1; border-top: 4px solid var(--color-primary);">
    <h3>Ride Stories & Member Contributions</h3>
    <p>Read about first-hand experiences on the trail, from 1941 to today!</p>
    
    <div style="background: var(--color-bg); padding: 15px; border-radius: 8px; margin: 15px 0;">
      <p style="font-size: 0.95rem; margin-bottom: 0;">
        <strong>Featured Story:</strong> Catherine de la Cruz finished her first NATRC ride at Jackson Forest at age 74. 
        <a href="{{ '/articles/Differently-abledRider/' | url }}" style="font-weight: 600;">Read her story &rarr;</a>
      </p>
    </div>

    <!-- Search Section -->
    <div style="position: relative; margin: 25px 0 15px 0;">
      <input type="text" id="contributionSearch" placeholder="Search stories by topic, author, or keyword..." 
        class="draft-select-control" style="padding-left: 45px; border: 2px solid var(--color-secondary-dark); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); opacity: 0.5;">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </span>
      <button id="clearSearch" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: none; color: var(--color-text-muted); padding: 5px;">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div id="searchResults" class="contributions-list" style="display: none; margin-bottom: 30px;"></div>
    
    <div id="defaultStories">
      <div style="display: flex; flex-wrap: wrap; gap: 30px; align-items: flex-start;">
        <div style="flex: 1; min-width: 300px;">
          <h4 style="margin-bottom: 15px; color: var(--color-primary-dark); font-size: 1.1rem; border-bottom: 2px solid var(--color-secondary); padding-bottom: 5px;">Recent Stories</h4>
          <ul class="contributions-list">
            {% for article in collections.contributions | reverse %}
              {% if loop.index0 < 5 %}
                <li class="contribution-item" style="padding: 10px 0;">
                  <a href="{{ article.url | url }}" style="display: block; font-weight: 600;">{{ article.data.title }}</a>
                  <span style="font-size: 0.85rem; color: var(--color-text-muted);">By {{ article.data.author }}</span>
                </li>
              {% endif %}
            {% endfor %}
          </ul>
          <div style="margin-top: 15px;">
            <a href="{{ '/stories-articles/contributions/' | url }}" class="btn btn-secondary" style="font-size: 0.9rem; padding: 6px 15px;">View All Stories</a>
          </div>
        </div>

        <div style="flex: 1; min-width: 300px;">
          <h4 style="margin-bottom: 15px; color: var(--color-primary-dark); font-size: 1.1rem; border-bottom: 2px solid var(--color-secondary); padding-bottom: 5px;">Classic Blogs & Links</h4>
          <ul class="contributions-list">
            <li class="contribution-item" style="padding: 10px 0;">
              <a href="http://wp.me/p2kYH8-3c" target="_blank">2012 Round Valley blog entry (Ellis) <i class="fas fa-external-link-alt" style="font-size: 0.8em; opacity: 0.5;"></i></a>
            </li>
            <li class="contribution-item" style="padding: 10px 0;">
              <a href="http://fullheartsfarm.wordpress.com/2012/06/08/cowboy-campers/" target="_blank">Cowboy Camp, 2012 (Ellis) <i class="fas fa-external-link-alt" style="font-size: 0.8em; opacity: 0.5;"></i></a>
            </li>
            <li class="contribution-item" style="padding: 10px 0;">
              <a href="http://fullheartsfarm.wordpress.com/2012/06/06/slow-horse-in-the-winners-circle/" target="_blank">Mt Diablo Spring Ride (Mary-Ellis Arnold) <i class="fas fa-external-link-alt" style="font-size: 0.8em; opacity: 0.5;"></i></a>
            </li>
            <li class="contribution-item" style="padding: 10px 0;">
              <a href="{{ '/articles/CMDTRA_story/' | url }}">The First Diablo Springs Ride (1941)</a>
            </li>
             <li class="contribution-item" style="padding: 10px 0;">
              <a href="{{ '/articles/CowboyCampInaugural/' | url }}">Inaugural Cowboy Camp 2011</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>Region 1 Remembrances</h3>
    <p>Honoring the riders, friends, and legends of NATRC Region 1.</p>
    <a href="{{ '/articles/Remembrances/' | url }}" class="btn btn-primary" style="margin-top: 10px;">View Remembrances</a>
  </div>

  <div class="card">
    <h3>Leadline Archives</h3>
    <p>A complete historical archive of the NATRC Region 1 Leadline newsletters dating back to 2006.</p>
    <a href="{{ '/leadlines/' | url }}" class="btn btn-secondary" style="margin-top: 10px;">Browse Leadlines</a>
  </div>

  <div class="card">
    <h3>Trail News Archives</h3>
    <ul style="list-style: none;">
      <li style="margin-bottom: 8px;"><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_Summer_2020.pdf" target="_blank">Summer 2020 (PDF)</a></li>
      <li style="margin-bottom: 8px;"><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_Winter_2020.pdf" target="_blank">Winter 2020 (PDF)</a></li>
      <li style="margin-bottom: 8px;"><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_April_2016.pdf" target="_blank">April 2016 (PDF)</a></li>
      <li style="margin-bottom: 15px;"><a href="https://www.natrcregion1.org/Articles/Trail_News/Trail_News_Nov_2015.pdf" target="_blank">November 2015 (PDF)</a></li>
    </ul>
    <p><a href="https://www.natrcregion1.org/Articles/R1_Bylaws_080316.pdf" target="_blank" style="font-size: 0.9rem; font-weight: 600;">Region 1 Bylaws (PDF)</a></p>
  </div>
</div>

<div style="text-align: center; margin-top: 60px; padding: 50px; background: linear-gradient(145deg, var(--color-secondary), var(--color-surface)); border-radius: var(--border-radius); box-shadow: var(--box-shadow);">
  <h3 style="color: var(--color-primary-dark); font-size: 1.8rem;">Have a story to share?</h3>
  <p style="font-size: 1.1rem; margin-bottom: 25px; color: var(--color-text);">We'd love to hear about your NATRC experiences! You can now write and submit your own articles directly.</p>
  <a href="{{ '/admin/add-article/' | url }}" class="btn btn-primary" style="padding: 12px 30px; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(45, 106, 79, 0.3);">Write a Story</a>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('contributionSearch');
  const searchResultsDiv = document.getElementById('searchResults');
  const defaultStories = document.getElementById('defaultStories');
  const clearBtn = document.getElementById('clearSearch');
  
  let contributionIndex = [];
  
  // Fetch the search index
  fetch("{{ '/assets/js/contributions_search_index.json' | url }}")
    .then(res => res.json())
    .then(data => {
      contributionIndex = data;
    })
    .catch(err => console.error("Error loading contributions index:", err));

  const highlightTerms = (text, terms) => {
    if (!terms || terms.length === 0 || !text) return text;
    const div = document.createElement('div');
    div.innerHTML = text;
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    let node;
    while(node = walker.nextNode()) nodes.push(node);
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
    nodes.forEach(textNode => {
      let content = textNode.nodeValue;
      let hasMatches = false;
      sortedTerms.forEach(term => {
        if (term.length < 2) return;
        const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        if (content.match(regex)) hasMatches = true;
      });
      if (hasMatches) {
        let tempContent = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        sortedTerms.forEach(term => {
          if (term.length < 2) return;
          const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
          tempContent = tempContent.replace(regex, `<mark>$1</mark>`);
        });
        const span = document.createElement('span');
        span.innerHTML = tempContent;
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
    return div.innerHTML;
  };

  const performSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query.length === 0) {
      clearBtn.style.display = 'none';
      searchResultsDiv.innerHTML = '';
      searchResultsDiv.style.display = 'none';
      defaultStories.style.display = 'block';
      return;
    }
    clearBtn.style.display = 'block';
    if (query.length < 2) {
      searchResultsDiv.innerHTML = '';
      searchResultsDiv.style.display = 'none';
      defaultStories.style.display = 'block';
      return;
    }
    const terms = query.split(/\s+/).filter(t => t.length > 0);
    const matches = contributionIndex.filter(item => {
      const searchSpace = `${item.title} ${item.author} ${item.summary} ${item.content}`.toLowerCase();
      return terms.every(term => searchSpace.includes(term));
    });
    const baseUrl = "{{ '/' | url }}";
    defaultStories.style.display = 'none';
    searchResultsDiv.style.display = 'block';
    if (matches.length > 0) {
      searchResultsDiv.innerHTML = `<h4 style="margin-bottom: 20px; color: var(--color-primary); border-bottom: 2px solid var(--color-secondary); padding-bottom: 8px;">Found ${matches.length} matches:</h4>` + 
        matches.map(item => `
          <div class="contribution-item" style="animation: fadeInUp 0.3s ease forwards; padding-bottom: 20px; border-bottom: 1px solid #eee; margin-bottom: 20px;">
            <a href="${baseUrl}${item.url}" style="font-size: 1.1rem; font-weight: 600;">${highlightTerms(item.title, terms)}</a>
            <div class="contribution-meta" style="font-size: 0.85rem; color: var(--color-primary-dark); margin: 3px 0 8px 0;">By ${highlightTerms(item.author, terms)}</div>
            <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.5;">
              ${highlightTerms(item.summary || item.content.replace(/<[^>]*>/g, ' ').substring(0, 180) + '...', terms)}
            </p>
          </div>
        `).join('');
    } else {
      searchResultsDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 20px; opacity: 0.2;">🔍</div>
          <p>No matching stories found for "<strong>${searchInput.value}</strong>".</p>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 10px;">Try searching for names, ride locations, or horse breeds.</p>
        </div>
      `;
    }
  };
  searchInput.addEventListener('input', performSearch);
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    performSearch();
    searchInput.focus();
  });
});
</script>

<style>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
#contributionSearch:focus {
  outline: none;
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 4px rgba(45, 106, 79, 0.1) !important;
}
.contribution-item mark {
  background-color: #fff3bf;
  color: #856404;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}
.contribution-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
