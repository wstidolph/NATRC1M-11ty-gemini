---
title: "Theme Switching & National Branding"
---

# Theme Switching & National Branding Guide

This document explains the purpose and implementation of the theme-switching mechanism used to toggle between the **Region 1 Default** look and the **National NATRC Mimic** design.

## 1. Purpose & Strategy

The Region 1 website is designed with a modern, organic, and "app-like" aesthetic (Forest Green palette) to represent our unique regional community. However, for certain administrative or formal contexts, it is beneficial to have a design that perfectly aligns with the **National NATRC** visual identity.

- **Region 1 Default**: Best for high-engagement community interactions.
- **National Mimic**: Best for institutional authority and seamless brand unity with the parent organization.

---

## 2. The Switching Mechanism

We use a **Query-Parameter Mechanism** that allows a reviewer or administrator to switch designs instantly without rebuilding the code. This mechanism is infinitely extensible—you can define as many themes as your review process requires.

### How to Toggle Themes:
- **Default**: Append `?theme=default` (The green, community-focused site).
- **National**: Append `?theme=national` (The authoritative, orange-and-blue institutional site).
- **Social/Experimental**: Append `?theme=social` (A variant testing structural additions like a utility bar and social links).
- **Legacy**: Append `?theme=legacy` (The classic look and feel of the original `natrcregion1.org` site).

### Persistence:
Once a theme is set via the URL, it is saved in the browser's `localStorage`. This means the chosen look will persist as the user navigates through different pages of the site until they explicitly change it back.

---

## 3. Technical Implementation

The system is designed to be "non-destructive," meaning it does not duplicate code or templates. It uses **CSS Variables** and a **Data Attribute** on the `<html>` tag.

### A. Extended HTML Structure (`src/_includes/base.njk`)
For structural elements like social media links or a top "utility bar," we add them to the main layout but keep them **hidden by default**.

```html
<header class="site-header">
  <div class="header-utility-bar">
    <!-- This bar is display:none by default -->
    <div class="container utility-container">
       <div class="utility-right">
         <a href="...">Facebook</a>
       </div>
    </div>
  </div>
  <!-- Main Header Content -->
</header>
```

### B. Multi-Theme CSS Layering (`src/assets/css/national-theme.css`)
This file controls both visual tokens and structural visibility using the `[data-theme]` selector.

- **Theme "national"**: Shows the blue utility bar, uses orange primary colors, and sets sharp corners.
- **Theme "social"**: Shows a vibrant pink utility bar, uses rounded corners, and highlights social links with distinct backgrounds.
- **Theme "legacy"**: Reintroduces the sky-blue/cloud background, Trebuchet MS typography, and iconic gold/purple accents from the original site's history.

### C. Client-Side Toggle Logic
A micro-script in the `<head>` checks for the `theme` parameter or an existing `localStorage` value. If any value other than 'default' is found, it applies `data-theme="[name]"` to the root element, allowing for per-theme CSS behavior.

---

## 4. Maintenance

To update or add a new theme:
1.  **Define Tokens**: Add a new `:root[data-theme="your-name"]` block in `src/assets/css/national-theme.css`.
2.  **Structural Changes**: Targeted elements (like `.header-utility-bar`) can be shown or hidden based on the theme attribute.
3.  **Global Logic**: The core switching logic lives in the script tag within `src/_includes/base.njk`.
