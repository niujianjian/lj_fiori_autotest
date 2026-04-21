const { runQUnitPage } = require("./qunitResults");

describe("QUnit artifact smoke", () => {
  it("writes a report for an intentional failure", async () => {
    await runQUnitPage("/test/unit/reportFailure.qunit.html", 10000);
  });
});