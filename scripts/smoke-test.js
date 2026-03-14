const fs = require("fs");
const path = require("path");

const SITE_DIR = path.join(__dirname, "..", "_site");
const CRITICAL_FILES = [
    "index.html",
    "assets/css/style.css",
    "news/index.html",
    "contact/index.html"
];

const TEMPLATE_LEAK_PATTERNS = [/\{\{/, /\{%/, /\[object Object\]/];

function checkPathExists(p) {
    if (!fs.existsSync(p)) {
        console.error(`❌ FAILED: Path does not exist: ${p}`);
        return false;
    }
    console.log(`✅ PASSED: Path exists: ${p}`);
    return true;
}

function checkContent(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    if (content.length < 100) {
        console.error(`❌ FAILED: File too small or empty: ${filePath}`);
        return false;
    }

    for (const pattern of TEMPLATE_LEAK_PATTERNS) {
        if (pattern.test(content)) {
            console.error(`❌ FAILED: Potential template leak detected in ${filePath} with pattern ${pattern}`);
            return false;
        }
    }

    console.log(`✅ PASSED: File content looks valid: ${filePath}`);
    return true;
}

function runSmokeTest() {
    console.log("🚀 Starting Build Smoke Test...\n");

    if (!checkPathExists(SITE_DIR)) {
        process.exit(1);
    }

    let allPassed = true;

    for (const file of CRITICAL_FILES) {
        const fullPath = path.join(SITE_DIR, file);
        if (!checkPathExists(fullPath) || !checkContent(fullPath)) {
            allPassed = false;
        }
    }

    // Check if news collection has at least one post
    const newsDir = path.join(SITE_DIR, "news");
    const newsFiles = fs.readdirSync(newsDir).filter(f => f !== "index.html" && fs.lstatSync(path.join(newsDir, f)).isDirectory());
    if (newsFiles.length === 0) {
        console.error("❌ FAILED: No news articles found in _site/news/");
        allPassed = false;
    } else {
        console.log(`✅ PASSED: Found ${newsFiles.length} news articles.`);
    }

    console.log("\n" + (allPassed ? "✨ ALL SMOKE TESTS PASSED! ✨" : "💀 SMOKE TEST FAILED! 💀"));
    process.exit(allPassed ? 0 : 1);
}

runSmokeTest();
