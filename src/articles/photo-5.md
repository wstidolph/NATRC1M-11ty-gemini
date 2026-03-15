---
title: "Photo 5"
summary: "using DOM extraction for img tags"
author: "wayne"
email: "wayne@stidolph.com"
date: 2026-03-15
tags: ["articles", "contributions"]
---

I found the issue. The previous method was using a simple text search (regex) to find and convert images, but because browsers and editors sometimes format HTML tags in slightly different ways (like adding "alt" or "width" attributes), the regex was occasionally missing the images entirely before they got stripped out.

### 🛠️ The Fix:
I have refactored the "Save" logic to be much more intelligent:

**DOM Extraction**: Instead of raw text manipulation, the editor now uses the browser's own internal logic to find every&nbsp;&lt;img&gt;&nbsp;tag.**Explicit Conversion**: It manually converts each image into its Markdown equivalent (![alt](/path/...)) BEFORE any other cleaning happens. This ensures your images are "locked in" to the final file.**Real-Time URL Swapping**: I updated the image uploader so that once a photo is successfully synced to GitHub, the editor silently swaps the "temporary" photo for the "permanent" one. This ensures that what you see in the editor is exactly what will be saved to your file.**Please try this one more time**:

**Add a photo**.**Wait for the "Success" alert**.**Click "Save Draft"**.


so, here's an image

![](/assets/images/user-uploads/1773541390128-jim_and_luke.jpg)