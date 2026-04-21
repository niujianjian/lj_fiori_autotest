const assert = require("assert");

describe("wdi5 artifact smoke", () => {
  it("writes a report for an intentional e2e failure", async () => {
    const title = await browser.getTitle();
    assert.strictEqual(title, "Intentional mismatch for artifact verification");
  });
});