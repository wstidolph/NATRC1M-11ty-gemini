# Anonymous CMS Submission Architecture

This document outlines the technical workflow for the anonymous content management system (CMS). For details on the underlying infrastructure, hosting, and deployment, see the [Deployment & Infrastructure Guide](deployment.md).

## Sequence Diagram

The following Mermaid sequence diagram visualizes the flow of data between the anonymous user, the frontend application (`cms.js`), the securely hosted Cloudflare Worker, the GitHub Repository, and the Site Administrator.

```mermaid
sequenceDiagram
    autonumber
    actor User as Anonymous User
    participant Browser as Frontend App (cms.js)
    participant Worker as Cloudflare Worker
    participant GitHub as GitHub API (Bot Account)
    actor Admin as Site Admin

    Note over User, Browser: Drafting Phase
    User->>Browser: Writes story & uploads image
    Browser->>Worker: POST /api/image (base64 payload)
    Note over Worker: Worker injects securely<br/>stored GITHUB_TOKEN
    Worker->>GitHub: Commit image file to draft branch
    GitHub-->>Worker: HTTP 201 Created
    Worker-->>Browser: Returns relative image URL

    User->>Browser: Clicks "Save Draft"
    Browser->>Worker: POST /api/draft (markdown payload)
    Worker->>GitHub: Commit .md to draft branch
    GitHub-->>Worker: HTTP 200/201 Success
    Worker-->>Browser: Standard Success JSON

    Note over User, Admin: Publishing & Review Phase
    User->>Browser: Clicks "Request Publish"
    Browser->>Worker: POST /api/publish (slug, title)
    Worker->>GitHub: Create Pull Request (base: main)
    GitHub-->>Worker: PR Created
    Worker-->>Browser: Return PR status directly
    
    Note over GitHub, Admin: GitHub automatically triggers notification<br/>because the PR was created by a different account (Bot)
    GitHub->>Admin: Email Notification: "New Pull Request"
    
    Admin->>GitHub: Reviews PR & Clicks "Merge"
    
    Note over GitHub: Continuous Deployment
    GitHub->>GitHub: GitHub Actions Triggered (npm run build)
    GitHub-->>GitHub: 11ty Compiles Markdown to HTML
    GitHub->>GitHub: Deploys updated static site to GitHub Pages
```

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
*For administrative instructions on updating the Cloudflare Worker or migrating the bot account, see the [Deployment & Infrastructure Guide](deployment.md).*
