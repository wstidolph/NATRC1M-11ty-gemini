---
title: "Leadline Upload Guide"
---
# Administrator Guide: Adding a New Leadline

This guide explains how to add a newly published Leadline PDF to the website archives. For broader site maintenance instructions, please see the [Maintenance & Operations Guide](../admin_guide/).

## Prerequisites

1.  **Node.js**: You must have Node.js installed on your computer. 
    -   Download it from [nodejs.org](https://nodejs.org/).
2.  **The PDF File**: Have the Leadline PDF ready on your computer.

## Step-by-Step Instructions

1.  **Open your Terminal or Command Prompt**:
    -   **Windows**: Press the Windows key, type `cmd` or `PowerShell`, and press Enter.
    -   **Mac**: Press `Cmd + Space`, type `Terminal`, and press Enter.

2.  **Navigate to the project folder**:
    Use the `cd` command to enter the folder where the website code is located.
    ```bash
    cd [path-to-your-project-folder]
    ```

3.  **Run the Upload Script**:
    Type the following command and press Enter:
    ```bash
    node scripts/admin_add_leadline.js
    ```

4.  **Follow the Prompts**:
    -   The script will ask you for the **path to the PDF file**. You can often just drag and drop the file directly into the terminal window to paste its path.
    -   The script will ask for the **Title** (e.g., "Leadline, Spring 2025").

5.  **Review on GitHub**:
    Once the script finishes successfully, it will provide a **link to a Pull Request on GitHub**.
    -   Click the link.
    -   Review that the file looks correct.
    -   Click **"Merge pull request"** and then **"Confirm merge"**.

The website will automatically rebuild and show the new Leadline within a few minutes!

---

### Troubleshooting

-   **"node is not recognized"**: Ensure Node.js is installed.
-   **"File not found"**: Ensure the path to your PDF is correct. If there are spaces in the path, make sure it is wrapped in quotes.
-   **Upload fails**: Check your internet connection or contact the technical administrator to ensure the Cloudflare Worker is active.
