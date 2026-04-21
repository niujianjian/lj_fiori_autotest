const { runQUnitPage } = require("./qunitResults");

describe("QUnit unit tests", () => {
  it("passes in headless Chrome", async () => {
    await runQUnitPage("/test/unit/unitTests.qunit.html", 60000);
  });
});