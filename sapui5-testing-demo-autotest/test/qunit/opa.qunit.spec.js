const { runQUnitPage } = require("./qunitResults");

describe("OPA integration tests", () => {
  it("passes in headless Chrome", async () => {
    await runQUnitPage("/test/integration/opaTests.qunit.html", 120000);
  });
});