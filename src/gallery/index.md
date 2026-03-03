---
layout: base.njk
title: Gallery
---
<style>
  .event-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .photo-container {
    display: none;
  }
  .event-desc {
    display: none;
  }
  .mobile-select {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: auto;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    background-color: var(--color-surface);
  }
  .desktop-links {
    display: none;
    margin-top: auto;
  }
  .desktop-links ul {
    margin: 0;
    padding-left: 20px;
  }
  .single-link {
    margin-top: auto;
  }

  /* Medium (Tablet) */
  @media (min-width: 601px) {
    .photo-container {
      display: block;
      margin-bottom: 15px;
      border-radius: 8px;
      overflow: hidden;
      max-height: 200px;
    }
    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .event-desc {
      display: block;
      margin-bottom: 20px;
      font-style: italic;
      color: var(--color-text-muted);
      font-size: 0.95rem;
    }
  }

  /* Large (Desktop) */
  @media (min-width: 1025px) {
    .mobile-select {
      display: none;
    }
    .desktop-links {
      display: block;
    }
  }
</style>

<div class="hero">
  <h2>Region 1 Photo Links</h2>
  <p>Memories from the trail.</p>
</div>

<div class="content-grid">

  <div class="card event-card">
    <h3>Arnold Rim</h3>
    <div class="photo-container">
      <img src="/assets/images/ArnoldRim_head.gif" alt="Arnold Rim">
    </div>
    <p class="event-desc">A scenic ride along the breathtaking Arnold Rim Trail.</p>
    <p class="single-link"><a href="https://goo.gl/photos/VWzgEpkgAsR7zSNTA" target="_blank">Arnold Rim 2010</a></p>
  </div>

  <div class="card event-card">
    <h3>Calero</h3>
    <div class="photo-container">
      <img src="/assets/images/Calero_head.gif" alt="Calero">
    </div>
    <p class="event-desc">Beautiful views and open trails at Calero County Park.</p>
    <p class="single-link"><a href="https://goo.gl/photos/9wXeMG4Ma73gCE2K7" target="_blank">Calero 2010</a></p>
  </div>

  <div class="card event-card">
    <h3>Cool Canyon Ride</h3>
    <div class="photo-container">
      <img src="/assets/images/CoolCanyon_head.jpg" alt="Cool Canyon">
    </div>
    <p class="event-desc">Explore the historic and challenging trails of Cool Canyon.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/UsaAmQ8jkCrhbRYt9" target="_blank">Cool Canyon 2019</a></li>
        <li><a href="https://photos.app.goo.gl/6yrY45fSRt9RB4GG7" target="_blank">Cool Canyon 2022</a></li>
        <li><a href="https://photos.app.goo.gl/ACVBSgobpxihGRm49" target="_blank">Cool Canyon 2024</a></li>
        <li><a href="https://photos.app.goo.gl/9WpbjHQ4kfp8C6KQ7" target="_blank">Cool Canyon 2025</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/9WpbjHQ4kfp8C6KQ7">Cool Canyon 2025</option>
      <option value="https://photos.app.goo.gl/ACVBSgobpxihGRm49">Cool Canyon 2024</option>
      <option value="https://photos.app.goo.gl/6yrY45fSRt9RB4GG7">Cool Canyon 2022</option>
      <option value="https://photos.app.goo.gl/UsaAmQ8jkCrhbRYt9">Cool Canyon 2019</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>CMDTRA (Mt Diablo)</h3>
    <div class="photo-container">
      <img src="/assets/images/MtDiablo_head.gif" alt="CMDTRA (Mt Diablo)">
    </div>
    <p class="event-desc">A classic Region 1 challenge on the rugged slopes of Mt. Diablo.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/VjtGCE7rPYijaaQE8" target="_blank">CMDTRA 2025</a></li>
        <li><a href="https://photos.google.com/share/AF1QipMyWmEkgOJPUKGB7ZLj54bGwevuaYb4rw1_HLw9za1zw5BqHIlR7JE8e6gvGH3yfQ" target="_blank">CMDTRA 2025 - Linda</a></li>
        <li><a href="https://photos.app.goo.gl/z3CxHympUzJqzFkK6" target="_blank">CMDTRA 2024-1</a></li>
        <li><a href="https://photos.app.goo.gl/YPKL1svC8ctuSZPE9" target="_blank">CMDTRA 2024-2</a></li>
        <li><a href="https://photos.app.goo.gl/VkpaeD6WtRtnmdSL8" target="_blank">CMDTRA 2023</a></li>
        <li><a href="https://photos.app.goo.gl/H6aEaAfhiW5y6AD69" target="_blank">CMDTRA 2019</a></li>
        <li><a href="https://goo.gl/photos/3us31qRSdyg9bm4z9" target="_blank">CMDTRA 2016</a></li>
        <li><a href="https://goo.gl/photos/6YqF4Sg3EY9TDRqp9" target="_blank">CMDTRA 2014</a></li>
        <li><a href="https://goo.gl/photos/F13iUghpmn73ViH57" target="_blank">CMDTRA 2011</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/VjtGCE7rPYijaaQE8">CMDTRA 2025</option>
      <option value="https://photos.google.com/share/AF1QipMyWmEkgOJPUKGB7ZLj54bGwevuaYb4rw1_HLw9za1zw5BqHIlR7JE8e6gvGH3yfQ">CMDTRA 2025 - Linda</option>
      <option value="https://photos.app.goo.gl/z3CxHympUzJqzFkK6">CMDTRA 2024-1</option>
      <option value="https://photos.app.goo.gl/YPKL1svC8ctuSZPE9">CMDTRA 2024-2</option>
      <option value="https://photos.app.goo.gl/VkpaeD6WtRtnmdSL8">CMDTRA 2023</option>
      <option value="https://photos.app.goo.gl/H6aEaAfhiW5y6AD69">CMDTRA 2019</option>
      <option value="https://goo.gl/photos/3us31qRSdyg9bm4z9">CMDTRA 2016</option>
      <option value="https://goo.gl/photos/6YqF4Sg3EY9TDRqp9">CMDTRA 2014</option>
      <option value="https://goo.gl/photos/F13iUghpmn73ViH57">CMDTRA 2011</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Cowboy Camp</h3>
    <div class="photo-container">
      <img src="/assets/images/CowboyCamp_head.gif" alt="Cowboy Camp">
    </div>
    <p class="event-desc">A relaxed and fun gathering at Cowboy Camp with unbeatable trails.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.google.com/album/AF1QipNHoS3aiZYMBYupINAylQKCyuxEpKRMum4BGQT1" target="_blank">Cowboy Camp 2024</a></li>
        <li><a href="https://photos.app.goo.gl/moD3crnrkCrmo1EB7" target="_blank">Cowboy Camp 2019</a></li>
        <li><a href="https://photos.app.goo.gl/AW5fjCSZeZJx38vI2" target="_blank">Cowboy Camp 2018</a></li>
        <li><a href="https://goo.gl/photos/UBNTKuL6nPa5jx1T9" target="_blank">Cowboy Camp 2017</a></li>
        <li><a href="https://goo.gl/photos/XpVxK5T37Rk275VWA" target="_blank">Cowboy Camp 2016</a></li>
        <li><a href="https://goo.gl/photos/P48gmLG2MjTKp2Q59" target="_blank">Cowboy Camp 2015</a></li>
        <li><a href="https://goo.gl/photos/Wj9cF8qfrCLgdQ1r9" target="_blank">Cowboy Camp 2014</a></li>
        <li><a href="https://goo.gl/photos/4JDdnNFhZTqGHCVq6" target="_blank">Cowboy Camp 2013</a></li>
        <li><a href="https://goo.gl/photos/teTMe9Z83Fgehwdt5" target="_blank">Cowboy Camp 2012</a></li>
        <li><a href="https://goo.gl/photos/HvbCxf2K7JXobyVq9" target="_blank">Cowboy Camp 2011</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.google.com/album/AF1QipNHoS3aiZYMBYupINAylQKCyuxEpKRMum4BGQT1">Cowboy Camp 2024</option>
      <option value="https://photos.app.goo.gl/moD3crnrkCrmo1EB7">Cowboy Camp 2019</option>
      <option value="https://photos.app.goo.gl/AW5fjCSZeZJx38vI2">Cowboy Camp 2018</option>
      <option value="https://goo.gl/photos/UBNTKuL6nPa5jx1T9">Cowboy Camp 2017</option>
      <option value="https://goo.gl/photos/XpVxK5T37Rk275VWA">Cowboy Camp 2016</option>
      <option value="https://goo.gl/photos/P48gmLG2MjTKp2Q59">Cowboy Camp 2015</option>
      <option value="https://goo.gl/photos/Wj9cF8qfrCLgdQ1r9">Cowboy Camp 2014</option>
      <option value="https://goo.gl/photos/4JDdnNFhZTqGHCVq6">Cowboy Camp 2013</option>
      <option value="https://goo.gl/photos/teTMe9Z83Fgehwdt5">Cowboy Camp 2012</option>
      <option value="https://goo.gl/photos/HvbCxf2K7JXobyVq9">Cowboy Camp 2011</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Eel River</h3>
    <div class="photo-container">
      <img src="/assets/images/EelRiver_head.gif" alt="Eel River">
    </div>
    <p class="event-desc">Winding trails and river crossings at the spectacular Eel River.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/B7wZK1GJd9CvrEDf7" target="_blank">Eel River 2025</a></li>
        <li><a href="https://photos.app.goo.gl/wtqTJdGb3hHZvwpB8" target="_blank">Eel River 2024-1</a></li>
        <li><a href="https://photos.app.goo.gl/Y8Sy4qi19v4JQr3C8" target="_blank">Eel River 2024-2</a></li>
        <li><a href="https://photos.app.goo.gl/6BpcHs2FLbZkPoUQ6" target="_blank">Eel River 2023</a></li>
        <li><a href="https://photos.app.goo.gl/niiftAzUFnDiMM7R6" target="_blank">Eel River 2019</a></li>
        <li><a href="https://photos.app.goo.gl/uRQYQUBgqbvnLJNr5" target="_blank">Eel River 2019-2</a></li>
        <li><a href="https://photos.app.goo.gl/qfzPm77gXyxP7FiE8" target="_blank">Eel River 2018</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/B7wZK1GJd9CvrEDf7">Eel River 2025</option>
      <option value="https://photos.app.goo.gl/wtqTJdGb3hHZvwpB8">Eel River 2024-1</option>
      <option value="https://photos.app.goo.gl/Y8Sy4qi19v4JQr3C8">Eel River 2024-2</option>
      <option value="https://photos.app.goo.gl/6BpcHs2FLbZkPoUQ6">Eel River 2023</option>
      <option value="https://photos.app.goo.gl/niiftAzUFnDiMM7R6">Eel River 2019</option>
      <option value="https://photos.app.goo.gl/uRQYQUBgqbvnLJNr5">Eel River 2019-2</option>
      <option value="https://photos.app.goo.gl/qfzPm77gXyxP7FiE8">Eel River 2018</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Fall Fiesta</h3>
    <div class="photo-container">
      <img src="/assets/images/FallFiesta_head.gif" alt="Fall Fiesta">
    </div>
    <p class="event-desc">A festive end-of-season ride through the beautiful Georgetown pines.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/ZUAWQAwTtCZdsf6p8" target="_blank">Fall Fiesta 2018</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/ZUAWQAwTtCZdsf6p8">Fall Fiesta 2018</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Georgetown</h3>
    <div class="photo-container">
      <img src="/assets/images/Georgetown_head.gif" alt="Georgetown">
    </div>
    <p class="event-desc">A beautiful ride through the Georgetown pines.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://goo.gl/photos/z4yTqpSvFVoPyqa1A" target="_blank">Georgetown 2014</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://goo.gl/photos/z4yTqpSvFVoPyqa1A">Georgetown 2014</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Jackson Forest</h3>
    <div class="photo-container">
      <img src="/assets/images/JacksonForest_head.gif" alt="Jackson Forest">
    </div>
    <p class="event-desc">Deep redwood forests and coastal breezes await at Jackson Forest.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/RRF76wiGEspviuVa8" target="_blank">Jackson Forest 2025</a></li>
        <li><a href="https://photos.app.goo.gl/yqsSB6Xojy2Fh6vX9" target="_blank">Jackson Forest 2024</a></li>
        <li><a href="https://photos.app.goo.gl/6zHdXqtJs7fpWWACA" target="_blank">Jackson Forest 2023-1</a></li>
        <li><a href="https://photos.app.goo.gl/rFL29HgJCzv79ihy8" target="_blank">Jackson Forest 2023-2</a></li>
        <li><a href="https://photos.app.goo.gl/wU7oqoUJeGXQq31t6" target="_blank">Jackson Forest Summer Ride 2022</a></li>
        <li><a href="https://photos.app.goo.gl/QSZUR7VCTXdh6vLE6" target="_blank">Jackson Forest 2021</a></li>
        <li><a href="https://photos.app.goo.gl/ufFJoUyKmXNGbUKp6" target="_blank">Jackson Forest 2019-1</a></li>
        <li><a href="https://photos.app.goo.gl/R3LVLgE9Ttmeitfe6" target="_blank">Jackson Forest 2019-2</a></li>
        <li><a href="https://photos.app.goo.gl/5MfxqJVmc9SViTcr5" target="_blank">Jackson Forest 2018</a></li>
        <li><a href="https://goo.gl/photos/8ofjXQ1kycdayAfz8" target="_blank">Jackson Forest 2016</a></li>
        <li><a href="https://goo.gl/photos/etGdT1swuD4g3cTx8" target="_blank">Jackson Forest 2014</a></li>
        <li><a href="https://goo.gl/photos/PJJehUEkPZkb57rW6" target="_blank">Jackson Forest 2013</a></li>
        <li><a href="https://goo.gl/photos/Px8HxZntvyQtqa997" target="_blank">Jackson Forest 2012</a></li>
        <li><a href="https://goo.gl/photos/ESfZYkpBMXLyVT3YA" target="_blank">Jackson Forest 2011</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/RRF76wiGEspviuVa8">Jackson Forest 2025</option>
      <option value="https://photos.app.goo.gl/yqsSB6Xojy2Fh6vX9">Jackson Forest 2024</option>
      <option value="https://photos.app.goo.gl/6zHdXqtJs7fpWWACA">Jackson Forest 2023-1</option>
      <option value="https://photos.app.goo.gl/rFL29HgJCzv79ihy8">Jackson Forest 2023-2</option>
      <option value="https://photos.app.goo.gl/wU7oqoUJeGXQq31t6">Summer Ride 2022</option>
      <option value="https://photos.app.goo.gl/QSZUR7VCTXdh6vLE6">Jackson Forest 2021</option>
      <option value="https://photos.app.goo.gl/ufFJoUyKmXNGbUKp6">Jackson Forest 2019-1</option>
      <option value="https://photos.app.goo.gl/R3LVLgE9Ttmeitfe6">Jackson Forest 2019-2</option>
      <option value="https://photos.app.goo.gl/5MfxqJVmc9SViTcr5">Jackson Forest 2018</option>
      <option value="https://goo.gl/photos/8ofjXQ1kycdayAfz8">Jackson Forest 2016</option>
      <option value="https://goo.gl/photos/etGdT1swuD4g3cTx8">Jackson Forest 2014</option>
      <option value="https://goo.gl/photos/PJJehUEkPZkb57rW6">Jackson Forest 2013</option>
      <option value="https://goo.gl/photos/Px8HxZntvyQtqa997">Jackson Forest 2012</option>
      <option value="https://goo.gl/photos/ESfZYkpBMXLyVT3YA">Jackson Forest 2011</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Lake Mendocino</h3>
    <div class="photo-container">
      <img src="/assets/images/LakeMendo_head.gif" alt="Lake Mendocino">
    </div>
    <p class="event-desc">A lovely ride featuring beautiful lake views and varying terrain.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/DpL3HFUhNYnNoL5n7" target="_blank">Lake Mendocino 2022</a></li>
        <li><a href="https://goo.gl/photos/7qwZsaZYX8fYq2V76" target="_blank">Lake Mendocino 2012</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/DpL3HFUhNYnNoL5n7">Lake Mendocino 2022</option>
      <option value="https://goo.gl/photos/7qwZsaZYX8fYq2V76">Lake Mendocino 2012</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Round Valley</h3>
    <div class="photo-container">
      <img src="/assets/images/RoundValley_head.gif" alt="Round Valley">
    </div>
    <p class="event-desc">Expansive trails and challenging elevation changes in Round Valley.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/16cAfqPLPfzE266k6" target="_blank">Round Valley 2023</a></li>
        <li><a href="https://photos.app.goo.gl/1NHnwNZHh61pmGLE6" target="_blank">Round Valley 2021</a></li>
        <li><a href="https://photos.app.goo.gl/6aTMrzEoMQkQBDfr7" target="_blank">Round Valley 2019</a></li>
        <li><a href="https://www.facebook.com/ksnaugle/media_set?set=a.10211982116099767&type=1&l=140c9a7827" target="_blank">Round Valley 2018</a></li>
        <li><a href="https://www.facebook.com/ksnaugle/media_set?set=a.10209621538726808&type=1&l=f6d4eb9d76" target="_blank">Round Valley 2017</a></li>
        <li><a href="https://goo.gl/photos/xCDNpjLCXP64GqQ5A" target="_blank">Round Valley 2016</a></li>
        <li><a href="https://goo.gl/photos/6vAy4xnBnZ6pghjN9" target="_blank">Round Valley 2015</a></li>
        <li><a href="https://goo.gl/photos/BkYu1LzEDYxa8NPY6" target="_blank">Round Valley 2014</a></li>
        <li><a href="https://goo.gl/photos/VfG2JKqS965mLXBC6" target="_blank">Round Valley 2012</a></li>
        <li><a href="https://goo.gl/photos/vHAn6N9Akne1qFKa8" target="_blank">Round Valley 2011</a></li>
        <li><a href="https://photos.app.goo.gl/ob8sLUaPB4jwGYjP9" target="_blank">Round Valley 2009</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/16cAfqPLPfzE266k6">Round Valley 2023</option>
      <option value="https://photos.app.goo.gl/1NHnwNZHh61pmGLE6">Round Valley 2021</option>
      <option value="https://photos.app.goo.gl/6aTMrzEoMQkQBDfr7">Round Valley 2019</option>
      <option value="https://www.facebook.com/ksnaugle/media_set?set=a.10211982116099767&type=1&l=140c9a7827">Round Valley 2018</option>
      <option value="https://www.facebook.com/ksnaugle/media_set?set=a.10209621538726808&type=1&l=f6d4eb9d76">Round Valley 2017</option>
      <option value="https://goo.gl/photos/xCDNpjLCXP64GqQ5A">Round Valley 2016</option>
      <option value="https://goo.gl/photos/6vAy4xnBnZ6pghjN9">Round Valley 2015</option>
      <option value="https://goo.gl/photos/BkYu1LzEDYxa8NPY6">Round Valley 2014</option>
      <option value="https://goo.gl/photos/VfG2JKqS965mLXBC6">Round Valley 2012</option>
      <option value="https://goo.gl/photos/vHAn6N9Akne1qFKa8">Round Valley 2011</option>
      <option value="https://photos.app.goo.gl/ob8sLUaPB4jwGYjP9">Round Valley 2009</option>
    </select>
  </div>

  <div class="card event-card">
    <h3>Spring in the Redwoods</h3>
    <div class="photo-container">
      <img src="/assets/images/SpringInTheRedwoods_head.jpg" alt="Spring in the Redwoods">
    </div>
    <p class="event-desc">A magical spring ride beneath towering, ancient redwoods.</p>
    <p class="single-link"><a href="https://goo.gl/photos/eeZ3LigfXwovBTDm9" target="_blank">Spring in the Redwoods 2017</a></p>
  </div>

  <div class="card event-card card-featured">
    <h3>The Mini-Conventions & More</h3>
    <div class="photo-container">
      <img src="/assets/images/2017_conv_head.gif" alt="Mini-Conventions & More">
    </div>
    <p class="event-desc">Celebrating our riders, awards, and the NATRC community.</p>
    <div class="desktop-links">
      <ul>
        <li><a href="https://photos.app.goo.gl/V5Xrqa9rSLMxMn6DA" target="_blank">2025 Convention Luncheon and Awards</a></li>
        <li><a href="https://photos.app.goo.gl/GTxaEAhLDyV7oEr16" target="_blank">2024 Convention Luncheon and Awards</a></li>
        <li><a href="https://photos.app.goo.gl/B3ET6tJUMG2NqUrt9" target="_blank">2023 Convention Luncheon and Awards</a></li>
        <li><a href="https://www.natrcregion1.org/picture_library/2022_Conv/2022_Mini_Convention_Wrapup.pdf" target="_blank">2022 Mini-Conv Wrap Up</a></li>
        <li><a href="https://www.natrcregion1.org/picture_library/2022_Conv/2022_Convention_Award_Recipients.pdf" target="_blank">2022 Mini-Conv Award Recipients</a></li>
        <li><a href="https://photos.app.goo.gl/qFvnRZkFE5JfJnz98" target="_blank">2022 Awards</a></li>
        <li><a href="https://photos.app.goo.gl/oDqbxwpidn6raO3g2" target="_blank">2018 Convention Luncheon and Awards Ceremony</a></li>
        <li><a href="https://goo.gl/photos/k7umhPbvK3tUgWFn9" target="_blank">Photos of 2016 Season Winners</a></li>
        <li><a href="https://goo.gl/photos/Cact6xqjkQjZaHUz8" target="_blank">What NATRC Riders Do When They Aren't Riding NATRC</a></li>
      </ul>
    </div>
    <select class="mobile-select" onchange="if(this.value) window.open(this.value, '_blank');">
      <option value="">Select a Gallery...</option>
      <option value="https://photos.app.goo.gl/V5Xrqa9rSLMxMn6DA">2025 Convention Luncheon and Awards</option>
      <option value="https://photos.app.goo.gl/GTxaEAhLDyV7oEr16">2024 Convention Luncheon and Awards</option>
      <option value="https://photos.app.goo.gl/B3ET6tJUMG2NqUrt9">2023 Convention Luncheon and Awards</option>
      <option value="https://www.natrcregion1.org/picture_library/2022_Conv/2022_Mini_Convention_Wrapup.pdf">2022 Mini-Conv Wrap Up</option>
      <option value="https://www.natrcregion1.org/picture_library/2022_Conv/2022_Convention_Award_Recipients.pdf">2022 Mini-Conv Award Recipients</option>
      <option value="https://photos.app.goo.gl/qFvnRZkFE5JfJnz98">2022 Awards</option>
      <option value="https://photos.app.goo.gl/oDqbxwpidn6raO3g2">2018 Convention Luncheon and Awards Ceremony</option>
      <option value="https://goo.gl/photos/k7umhPbvK3tUgWFn9">Photos of 2016 Season Winners</option>
      <option value="https://goo.gl/photos/Cact6xqjkQjZaHUz8">When They Aren't Riding NATRC</option>
    </select>
  </div>

</div>
