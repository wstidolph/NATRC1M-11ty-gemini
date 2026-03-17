---
layout: base.njk
title: Information Links
---

<div class="hero">
  <h2>Information Links</h2>
  <p>Resources for competitive trail riding and NATRC.</p>
</div>

<div class="content-grid">
  <div class="card">
    <h3>Websites</h3>
    <ul>
      <li><a href="https://www.natrc.org/" target="_blank">NATRC National Site</a></li>
      <li><a href="https://www.natrc2.org/" target="_blank">NATRC Region 2</a></li>
      <li><a href="https://www.natrc3.org/" target="_blank">NATRC Region 3</a></li>
      <li><a href="https://www.natrc4.org/" target="_blank">NATRC Region 4</a></li>
      <li><a href="https://www.natrc5.org/" target="_blank">NATRC Region 5</a></li>
      <li><a href="https://www.natrcregion6.org/" target="_blank">NATRC Region 6</a></li>
      <li><a href="http://www.whitedogranch.com/" target="_blank">White Dog Ranch</a>, a Region 1 resource</li>
    </ul>
  </div>

  <div class="card">
    <h3>Region 1 Remembrances</h3>
    <p>Read stories and memories covering our trail legends.</p>
    <a href="{{ '/articles/Remembrances/' | url }}" class="btn btn-primary" style="margin-top: 10px;">View Remembrances</a>
  </div>

  <div class="card">
    <h3>NATRC Sponsors</h3>
    <ul>
      <li><a href="http://www.equisure-inc.com/" target="_blank">Equisure</a></li>
      <li><a href="https://www.ridingwarehouse.com/" target="_blank">Riding Warehouse</a></li>
      <li><a href="https://www.tennesseesaddlery.com/" target="_blank">Tennessee Saddlery</a></li>
      <li><a href="https://www.thedistancedepot.com/" target="_blank">Distance Depot</a></li>
      <li><a href="https://www.slypnergear.com/" target="_blank">Slypner Gear</a></li>
      <li><a href="https://www.roguepetscience.com" target="_blank">Rogue Pet Science</a></li>
      <li><a href="https://www.renegadehoofboot.com/" target="_blank">Renegade Hoof Boots</a></li>
      <li><a href="https://specializedsaddles.com/" target="_blank">Specialized Saddles</a></li>
      <li><a href="http://sportssaddle.com/" target="_blank">Sports Saddle</a></li>
    </ul>
  </div>

  <div class="card" id="admin-docs-card">
    <h3>Internal Documentation</h3>
    <p>Site architecture, administration guides, and technical specifications.</p>
    <ul style="list-style: none; padding-left: 0; font-size: 0.95rem;">
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/walkthrough/' | url }}" style="font-weight: 600;">Project Walkthrough</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">High-level overview of the site architecture and technical components.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/admin_guide/' | url }}" style="font-weight: 600;">Maintenance & Operations Guide</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Instructions for adding articles, managing PDFs, and updating sponsors.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/CMS_ARCHITECTURE/' | url }}" style="font-weight: 600;">CMS Architecture</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Technical data-flow and security details for the browser-based editor.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/deployment/' | url }}" style="font-weight: 600;">Deployment & Infrastructure Guide</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Guide for CI/CD, hosting, and repository ownership migration.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/leadlines_guide/' | url }}" style="font-weight: 600;">Leadline Upload Guide</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Simple steps for administrators to add new newsletter PDFs.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/content_vs_assets/' | url }}" style="font-weight: 600;">Content vs. Assets</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Technical difference between web pages (Markdown) and documents (PDF).</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/member_contributions_search_walkthrough/' | url }}" style="font-weight: 600;">Search Implementation Guide</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Developer overview of indexing scripts and search engine logic.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/theme_switching/' | url }}" style="font-weight: 600;">Theme Switching & National Branding</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Explanation of the switching mechanism and alternative design tokens.</span>
      </li>
      <li style="margin-bottom: 12px;">
        <a href="{{ '/docs/PRD/' | url }}" style="font-weight: 600;">Project PRD</a><br>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">Original requirements defining goals, scope, and phases.</span>
      </li>
    </ul>
  </div>
</div>
