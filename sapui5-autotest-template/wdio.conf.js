exports.config = {
  runner: "local",
  specs: ["./test/e2e/**/*.spec.js"],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--window-size=1440,900"]
      }
    }
  ],
  logLevel: "info",
  framework: "mocha",
  reporters: ["spec"],
  sync: false,
  services: [
    ["chromedriver", {
      chromedriverCustomPath: "../chromedriver/chromedriver.exe"
    }],
    "ui5"
  ],
  wdi5: {
    url: "http://localhost:8080/index.html",
    waitForUI5Timeout: 15000,
    screenshotPath: "./test/e2e/screenshots"
  },
  mochaOpts: {
    ui: "bdd",
    timeout: 60000
  },
  baseUrl: "http://localhost:8080"
};
