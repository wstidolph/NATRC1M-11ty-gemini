---
title: "CMS Architecture & Data Flow"
---
# CMS Architecture & Data Flow

This document outlines the technical workflow for the anonymous content management system (CMS). For details on the underlying infrastructure, hosting, and deployment, see the [Deployment & Infrastructure Guide](../deployment/).

## Sequence Diagram

The following sequence diagram visualizes the flow of data between the anonymous user, the frontend application (`cms.js`), the securely hosted Cloudflare Worker, the GitHub Repository, and the Site Administrator.

<figure>
  <p class="centeredImage">
    <img src="{{ '/assets/images/cms_architecture_diagram.png' | url }}" alt="CMS Architecture Sequence Diagram" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
  </p>
  <figcaption style="text-align:center">CMS Data Flow: From Draft to Deployment</figcaption>
</figure>

## Component Breakdown

### 1. Frontend App (`cms.js`)
The javascript running in the user's browser acts as a simple HTTP client. Instead of interacting with the `octokit` library directly and requiring a GitHub Personal Access Token, it executes standard `fetch` requests (GET, POST, DELETE) pointing to the Cloudflare Worker URL.

### 2. Cloudflare Worker (The Security Proxy)
The serverless Cloudflare Worker sits between the frontend and GitHub. It holds the `GITHUB_TOKEN` securely in its encrypted environment variables. Its sole purpose is to receive verified API requests from the frontend, inject the GitHub authentication headers, and execute the commits using the `@octokit/rest` library on behalf of the user.

### 3. GitHub Bot Account
The Cloudflare Worker uses an explicit automation "Bot Account" to interface with GitHub. Because the commits and pull requests are originating from this separate account, it allows GitHub's native notification system to correctly ping the actual Site Admin (the owner of the repository) whenever a new Pull Request is opened.

### 4. Continuous Deployment
Once the Site Admin reviews the PR and hits "Merge", the pre-existing GitHub Actions pipeline automatically triggers, running Eleventy (`11ty`) to compile the site and push the new files to the live GitHub Pages environment.

---
*For administrative instructions on updating the Cloudflare Worker or migrating the bot account, see the [Deployment & Infrastructure Guide](../deployment/).*
