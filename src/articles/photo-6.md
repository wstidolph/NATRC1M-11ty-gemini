---
title: "Photo 6"
summary: ""
author: "wayne"
email: "wayne@stidolph.com"
date: 2026-03-15
tags: ["articles", "contributions"]
---

I have implemented the final fix for the image pathing issue.&nbsp;




The 404 error was occurring because the site is hosted in a GitHub subdirectory (`/NATRC1M-11ty-gemini/`), but the image links were being saved as absolute paths from the domain root.




### 🛠️ The Solution:

I have integrated the **11ty `url` filter** directly into the Markdown generation logic:




1.&nbsp;**Smart Saving**: When you save a draft, the system now writes your images using 11ty's native Nunjucks format: `![Image]({{ '/assets/images/user-uploads/filename.jpg' | url }})`.

2.&nbsp;**Environment Agnostic**: During the site build, 11ty will automatically detect that you're on GitHub Pages and prepend the `/NATRC1M-11ty-gemini/` folder name for you. If you ever move the site to a custom domain at the root, 11ty will automatically adjust.

3.&nbsp;**Editor Compatibility**: I updated the draft loader to "decode" these Nunjucks tags back into a previewable format, so you can still see your images while editing.




**To fix your current article**:

1.&nbsp;Open the "Add Article" page.

2.&nbsp;**Load your draft** from the dropdown.

3.&nbsp;Click **"Save Draft"** one more time (this will update the Markdown file with the new safe URL format).

4.&nbsp;Once the site rebuilds, the images will appear perfectly on the article page!




So, here's the image

![](/assets/images/user-uploads/1773541947586-dscn0763.JPG)