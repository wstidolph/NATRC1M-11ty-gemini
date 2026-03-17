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

We use a **Query-Parameter Mechanism** that allows a reviewer or administrator to switch designs instantly without rebuilding the code.

### How to Toggle Themes:
- **Switch to National Design**: Append `?theme=national` to any URL.
- **Switch to Default Region 1 Design**: Append `?theme=default` to any URL.

### Persistence:
Once a theme is set via the URL, it is saved in the browser's `localStorage`. This means the chosen look will persist as the user navigates through different pages of the site until they explicitly change it back.

---

## 3. Technical Implementation

The system is designed to be "non-destructive," meaning it does not duplicate code or templates. It uses **CSS Variables** and a **Data Attribute** on the `<html>` tag.

### A. Client-Side Script (`src/_includes/base.njk`)
A micro-script in the `<head>` checks for the `theme` parameter or an existing `localStorage` value. If found, it applies `data-theme="national"` to the root element.

### B. CSS Layering (`src/assets/css/national-theme.css`)
This file contains the "National Skin." It only activates when the `[data-theme="national"]` selector is present. It overrides the following design tokens:
- **Primary Colors**: Replaces Forest Green with **NATRC Orange** (`#F26B21`).
- **Secondary Colors**: Replaces Sage with **Midnight Blue** (`#2B2B64`).
- **Typography**: Swaps the UI font to **Montserrat** (via Google Fonts) for a more structured, authoritative feel.
- **Corners**: Reduces the border-radius from `12px` to `4px` for sharper, more official-looking UI components.
- **Hero Image**: Utilizes a high-action trail photography backdrop (`natrc_backdrop.jpg`) instead of the default gradient.

---

## 4. Maintenance

To update the National design language:
1.  **Colors/Fonts**: Edit the variables in `src/assets/css/national-theme.css`.
2.  **Hero Backdrop**: Replace the image file at `src/assets/images/natrc_backdrop.jpg`.
3.  **Global Logic**: The core switching logic lives in the script tag within `src/_includes/base.njk`.
