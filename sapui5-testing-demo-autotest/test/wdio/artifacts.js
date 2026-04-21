const fs = require("fs");
const path = require("path");

function slugify(value) {
  return String(value || "unknown-test")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "unknown-test";
}

function stripAnsi(value) {
  return String(value || "").replace(/\u001b\[[0-9;]*m/g, "");
}

function buildFailureScreenshotPath(suiteName, test, error) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const title = slugify(test.title || test.fullTitle);
  const reason = slugify(error && error.name ? error.name : "failure");
  const outputDir = path.join(process.cwd(), "test-results", suiteName, "screenshots");

  fs.mkdirSync(outputDir, { recursive: true });

  return path.join(outputDir, `${timestamp}-${title}-${reason}.png`);
}

function buildTextArtifactPath(suiteName, name, suffix) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const title = slugify(name);
  const outputDir = path.join(process.cwd(), "test-results", suiteName, "reports");

  fs.mkdirSync(outputDir, { recursive: true });

  return path.join(outputDir, `${timestamp}-${title}.${suffix}`);
}

async function waitForFailureScreenshotSurface() {
  try {
    await browser.waitUntil(async () => {
      return browser.execute(() => {
        const body = document.body;

        if (!body) {
          return false;
        }

        const text = (body.innerText || "").trim();

        return document.readyState === "complete" && text.length > 0;
      });
    }, {
      timeout: 5000,
      interval: 100,
      timeoutMsg: "Timed out waiting for visible page content before capturing screenshot"
    });
  } catch {
    // Keep best-effort behavior for failure artifacts.
  }
}

async function injectFailureOverlay(test, error) {
  const testName = test.fullTitle || test.title || "Unknown test";
  const rawError = stripAnsi(error?.message || error?.stack || String(error || "Unknown error"));
  const summary = rawError.split("\n").filter(Boolean).slice(0, 4).join("\n");
  const message = [testName, summary].join("\n\n");

  try {
    await browser.execute((overlayMessage) => {
      const overlayId = "__wdio_failure_overlay";
      const existingOverlay = document.getElementById(overlayId);

      if (existingOverlay) {
        existingOverlay.remove();
      }

      const overlay = document.createElement("pre");
      overlay.id = overlayId;
      overlay.textContent = overlayMessage;
      overlay.setAttribute("data-testid", overlayId);
      overlay.style.position = "fixed";
      overlay.style.top = "16px";
      overlay.style.right = "16px";
      overlay.style.zIndex = "2147483647";
      overlay.style.margin = "0";
      overlay.style.padding = "10px 12px";
      overlay.style.width = "min(420px, calc(100vw - 32px))";
      overlay.style.maxHeight = "28vh";
      overlay.style.overflow = "hidden";
      overlay.style.whiteSpace = "pre-wrap";
      overlay.style.wordBreak = "break-word";
      overlay.style.font = "11px/1.4 Consolas, 'Courier New', monospace";
      overlay.style.color = "#ffffff";
      overlay.style.background = "rgba(160, 32, 32, 0.58)";
      overlay.style.border = "1px solid rgba(255, 255, 255, 0.9)";
      overlay.style.borderRadius = "10px";
      overlay.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.28)";
      overlay.style.pointerEvents = "none";

      document.body.appendChild(overlay);
      window.scrollTo(0, 0);
    }, message);
    await browser.pause(150);
  } catch {
    // Overlay injection is best-effort only.
  }
}

async function captureFailureScreenshot(suiteName, test, error) {
  const filePath = buildFailureScreenshotPath(suiteName, test, error);

  await waitForFailureScreenshotSurface();
  await injectFailureOverlay(test, error);
  await browser.saveScreenshot(filePath);

  return filePath;
}

function writeTextArtifact(suiteName, name, content, suffix = "txt") {
  const filePath = buildTextArtifactPath(suiteName, name, suffix);
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
}

async function readBrowserState() {
  try {
    return await browser.execute(() => ({
      url: window.location.href,
      title: document.title,
      readyState: document.readyState
    }));
  } catch {
    return null;
  }
}

function formatE2EFailureReport(test, error, browserState) {
  const lines = [
    `test: ${test.fullTitle || test.title || "Unknown test"}`,
    `url: ${browserState?.url || "Unavailable"}`,
    `title: ${browserState?.title || "Unavailable"}`,
    `readyState: ${browserState?.readyState || "Unavailable"}`,
    "",
    "error:",
    stripAnsi(error?.stack || error?.message || String(error || "Unknown error"))
  ];

  return lines.join("\n");
}

async function writeE2EFailureArtifact(test, error) {
  const browserState = await readBrowserState();
  return writeTextArtifact("e2e", test.fullTitle || test.title || "unknown-test", formatE2EFailureReport(test, error, browserState));
}

module.exports = {
  captureFailureScreenshot,
  writeE2EFailureArtifact,
  writeTextArtifact
};