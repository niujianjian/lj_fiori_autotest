const assert = require("assert");
const { writeTextArtifact } = require("../wdio/artifacts");

function inferSuiteName(pagePath) {
  if (pagePath.includes("/integration/")) {
    return "opa";
  }

  return "unit";
}

function formatFailureReport(pagePath, result, error, pageState) {
  const lines = [
    `page: ${pagePath}`,
    `summary: ${result?.summary || "Unavailable"}`,
    `failedCount: ${Number.isFinite(result?.failedCount) ? result.failedCount : "Unavailable"}`,
    `url: ${pageState?.url || "Unavailable"}`,
    `readyState: ${pageState?.readyState || "Unavailable"}`,
    `title: ${pageState?.title || "Unavailable"}`,
    ""
  ];

  if (Array.isArray(result?.failedTests) && result.failedTests.length > 0) {
    lines.push("failedTests:");
    result.failedTests.forEach((testName) => lines.push(`- ${testName}`));
    lines.push("");
  }

  if (Array.isArray(pageState?.messages) && pageState.messages.length > 0) {
    lines.push("pageMessages:");
    pageState.messages.forEach((message) => lines.push(`- ${message}`));
    lines.push("");
  }

  if (error) {
    lines.push("error:");
    lines.push(error.stack || error.message || String(error));
  }

  return lines.join("\n");
}

async function readPageState() {
  try {
    return await browser.execute(() => ({
      url: window.location.href,
      title: document.title,
      readyState: document.readyState,
      messages: Array.from(document.querySelectorAll("#qunit-tests > li.fail"))
        .map((node) => node.textContent.replace(/\s+/g, " ").trim())
        .slice(0, 10)
    }));
  } catch {
    return null;
  }
}

function writeFailureReport(pagePath, result, error, pageState) {
  const suiteName = inferSuiteName(pagePath);
  const reportName = `${suiteName}-${pagePath.split("/").pop() || "qunit"}`;
  return writeTextArtifact(
    suiteName,
    reportName,
    formatFailureReport(pagePath, result, error, pageState)
  );
}

async function runQUnitPage(pagePath, timeout) {
  let result;

  try {
    await browser.url(pagePath);

    await browser.waitUntil(async () => {
      const state = await browser.execute(() => {
        const resultNode = document.querySelector("#qunit-testresult");
        if (!resultNode) {
          return { finished: false };
        }

        const summary = resultNode.textContent.trim();
        const finished = /\bcompleted\b/i.test(summary);

        return { finished, summary };
      });

      return state.finished;
    }, {
      timeout,
      interval: 500,
      timeoutMsg: `QUnit page did not finish in time: ${pagePath}`
    });

    result = await browser.execute(() => {
      const summary = document.querySelector("#qunit-testresult")?.textContent.trim() || "No QUnit summary found";
      const failedCountMatch = summary.match(/(\d+)\s+failed/i);
      const failedCount = failedCountMatch ? Number.parseInt(failedCountMatch[1], 10) : Number.NaN;
      const failedTests = Array.from(document.querySelectorAll("#qunit-tests > li.fail"))
        .map((node) => node.querySelector(".test-name")?.textContent?.trim() || node.textContent.replace(/\s+/g, " ").trim())
        .slice(0, 10);

      return {
        summary,
        failedCount,
        failedTests
      };
    });

    assert.ok(Number.isFinite(result.failedCount), `Unable to parse QUnit result summary for ${pagePath}: ${result.summary}`);
    assert.strictEqual(
      result.failedCount,
      0,
      [result.summary].concat(result.failedTests).join("\n")
    );
  } catch (error) {
    const pageState = await readPageState();
    writeFailureReport(pagePath, result, error, pageState);
    throw error;
  }
}

module.exports = {
  runQUnitPage
};