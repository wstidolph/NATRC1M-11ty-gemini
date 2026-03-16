/**
 * Admin script to add a new Leadline PDF to the archives.
 * Usage: node scripts/admin_add_leadline.js [path_to_pdf] "[Title]"
 */

const fs = require('fs');
const path = require('path');

// THE CLOUDFLARE WORKER URL
const WORKER_URL = "https://natrc-cms-worker.natrc1.workers.dev";

async function addLeadline() {
  const args = process.argv.slice(2);
  
  let filePath = args[0];
  let title = args[1];

  // Interactive mode if arguments are missing
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => readline.question(query, resolve));

  if (!filePath) {
    filePath = await question('Enter the path to the Leadline PDF file: ');
  }
  if (!title) {
    title = await question('Enter the Title for this issue (e.g., "Leadline, Spring 2025"): ');
  }

  readline.close();

  // Basic validation
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`Error: File not found at "${filePath}"`);
    process.exit(1);
  }

  if (!filePath.toLowerCase().endsWith('.pdf')) {
    console.error('Error: The file must be a PDF.');
    process.exit(1);
  }

  if (!title) {
    console.error('Error: A title is required.');
    process.exit(1);
  }

  const filename = path.basename(filePath);
  const base64Data = fs.readFileSync(filePath, { encoding: 'base64' });

  console.log(`\nUploading "${filename}" as "${title}"...`);

  try {
    const response = await fetch(`${WORKER_URL}/api/leadline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        filename,
        base64Data: `data:application/pdf;base64,${base64Data}`
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('\nSuccess! A proposal has been created.');
      console.log(`A new branch was created and a Pull Request is ready for your review.`);
      console.log(`\nReview and Merge here: ${result.prUrl}`);
    } else {
      console.error('\nUpload failed:', result.error || 'Unknown error');
    }
  } catch (err) {
    console.error('\nAn error occurred during upload:', err.message);
  }
}

addLeadline();
