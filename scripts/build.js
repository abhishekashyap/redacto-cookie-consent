#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const CDN_URL =
  "https://cdn.jsdelivr.net/gh/abhishekashyap/redacto-cookie-consent@main/dist/redacto.min.css";
const LOCAL_PATH = "scss/index.css";

// Paths
const ROOT_DIR = path.join(__dirname, "..");
const JS_SOURCE = path.join(ROOT_DIR, "js", "index.js");
const SCSS_SOURCE = path.join(ROOT_DIR, "scss", "index.scss");
const CSS_SOURCE = path.join(ROOT_DIR, "scss", "index.css");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const JS_DIST = path.join(DIST_DIR, "redacto.min.js");
const CSS_DIST = path.join(DIST_DIR, "redacto.min.css");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bright}${step}${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

// Main build function
async function build(useCDN = true) {
  try {
    logStep("🚀", "Starting Redacto build process...");

    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      logInfo("Creating dist directory...");
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Step 1: Compile SCSS to CSS
    logStep("🎨", "Compiling SCSS to CSS...");
    try {
      execSync(`sass "${SCSS_SOURCE}" "${CSS_SOURCE}" --no-source-map`, {
        stdio: "pipe",
      });
      const compiledSize = fs.statSync(CSS_SOURCE).size;
      logSuccess(
        `SCSS compiled to CSS (${(compiledSize / 1024).toFixed(1)}KB)`
      );
    } catch (error) {
      throw new Error(`SCSS compilation failed: ${error.message}`);
    }

    // Step 2: Minify JavaScript
    logStep("📦", "Minifying JavaScript...");
    try {
      execSync(`npx terser "${JS_SOURCE}" -o "${JS_DIST}" -c -m`, {
        stdio: "pipe",
      });
      const jsSize = fs.statSync(JS_DIST).size;
      logSuccess(`JavaScript minified (${(jsSize / 1024).toFixed(1)}KB)`);
    } catch (error) {
      throw new Error(`JavaScript minification failed: ${error.message}`);
    }

    // Step 3: Minify CSS
    logStep("🎨", "Minifying CSS...");
    try {
      execSync(`npx cleancss "${CSS_SOURCE}" -o "${CSS_DIST}"`, {
        stdio: "pipe",
      });
      const cssSize = fs.statSync(CSS_DIST).size;
      logSuccess(`CSS minified (${(cssSize / 1024).toFixed(1)}KB)`);
    } catch (error) {
      throw new Error(`CSS minification failed: ${error.message}`);
    }

    // Step 4: Replace CSS path with CDN (if requested)
    if (useCDN) {
      logStep("🌐", "Replacing CSS path with CDN URL...");
      try {
        let content = fs.readFileSync(JS_DIST, "utf8");
        const originalContent = content;

        content = content.replace(
          new RegExp(LOCAL_PATH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          CDN_URL
        );

        if (content === originalContent) {
          logWarning(
            "No CSS path replacement was made. The pattern might not match."
          );
          logInfo(`Looking for: "${LOCAL_PATH}"`);
        } else {
          fs.writeFileSync(JS_DIST, content, "utf8");
          logSuccess("CSS path replaced with CDN URL");
        }
      } catch (error) {
        throw new Error(`CDN replacement failed: ${error.message}`);
      }
    }

    // Step 5: Clean up intermediate CSS file
    logStep("🧹", "Cleaning up intermediate files...");
    try {
      if (fs.existsSync(CSS_SOURCE)) {
        fs.unlinkSync(CSS_SOURCE);
        logSuccess("Intermediate CSS file removed");
      }
    } catch (error) {
      logWarning(`Failed to remove intermediate CSS file: ${error.message}`);
    }

    // Step 6: Generate build info
    logStep("📊", "Generating build information...");
    const jsSize = fs.statSync(JS_DIST).size;
    const cssSize = fs.statSync(CSS_DIST).size;
    const totalSize = jsSize + cssSize;

    logSuccess(`Build completed successfully!`);
    logInfo(`📁 Output directory: ${DIST_DIR}`);
    logInfo(`📄 JavaScript: ${(jsSize / 1024).toFixed(1)}KB`);
    logInfo(`🎨 CSS: ${(cssSize / 1024).toFixed(1)}KB`);
    logInfo(`📦 Total: ${(totalSize / 1024).toFixed(1)}KB`);

    if (useCDN) {
      logInfo(`🔗 CDN URL: ${CDN_URL}`);
    } else {
      logInfo(`📂 Local CSS path: ${LOCAL_PATH}`);
    }

    logStep("✨", "Build process completed!");
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const useCDN = args.includes("--cdn") || args.includes("-c");

// Run build
build(useCDN);
