const {
  createBaseConfig,
  createChromedriverService,
  serverUrl
} = require("./test/wdio/config");

exports.config = createBaseConfig({
  specs: ["./test/qunit/**/*.spec.js"],
  suites: {
    unit: ["./test/qunit/unit.qunit.spec.js"],
    opa: ["./test/qunit/opa.qunit.spec.js"]
  },
  services: [createChromedriverService()],
  baseUrl: serverUrl,
  suiteName: "qunit",
  mochaTimeout: 120000,
  maxInstances: 1
});