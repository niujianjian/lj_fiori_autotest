const {
  createBaseConfig,
  createChromedriverService,
  isCi,
  serverUrl
} = require("./test/wdio/config");

const baseUrl = process.env.WDI5_BASE_URL || `${serverUrl}/index.html`;

exports.config = createBaseConfig({
  specs: ["./test/e2e/app.e2e.spec.js"],
  services: [createChromedriverService(), "ui5"],
  baseUrl,
  suiteName: "e2e",
  mochaTimeout: 60000,
  maxInstances: isCi ? 1 : 2,
  extraConfig: {
    wdi5: {
      waitForUI5Timeout: 15000,
      screenshotPath: "./test/e2e/screenshots"
    }
  }
});