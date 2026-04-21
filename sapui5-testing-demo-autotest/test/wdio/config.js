const { captureFailureScreenshot, writeE2EFailureArtifact } = require("./artifacts");

const serverUrl = process.env.WDI5_SERVER_URL || "http://localhost:8082";
const isCi = process.env.CI === "true";

function createChromeArgs() {
  const chromeArgs = [
    "--window-size=1440,900",
    //"--headless=new",
    "--disable-gpu"
  ];

  if (isCi) {
    chromeArgs.push("--no-sandbox", "--disable-dev-shm-usage");
  }

  return chromeArgs;
}

function createChromedriverService() {
  return ["chromedriver", {
    port: 9515,
    path: "/",
    args: ["--disable-build-check"]
  }];
}

function createAfterTestHook(suiteName) {
  return async function afterTest(test, context, result) {
    if (result.passed) {
      return;
    }

    await captureFailureScreenshot(suiteName, test, result.error);

    if (suiteName === "e2e") {
      await writeE2EFailureArtifact(test, result.error);
    }
  };
}

function createBaseConfig({
  specs,
  suites,
  services,
  baseUrl,
  suiteName,
  mochaTimeout,
  maxInstances,
  extraConfig
}) {
  return {
    runner: "local",
    hostname: "localhost",
    port: 9515,
    path: "/",
    specs,
    ...(suites ? { suites } : {}),
    capabilities: [
      {
        maxInstances,
        browserName: "chrome",
        acceptInsecureCerts: true,
        "goog:chromeOptions": {
          args: createChromeArgs()
        }
      }
    ],
    logLevel: "info",
    framework: "mocha",
    reporters: ["spec"],
    sync: false,
    services,
    mochaOpts: {
      ui: "bdd",
      timeout: mochaTimeout
    },
    afterTest: createAfterTestHook(suiteName),
    baseUrl,
    ...extraConfig
  };
}

module.exports = {
  createBaseConfig,
  createChromedriverService,
  isCi,
  serverUrl
};