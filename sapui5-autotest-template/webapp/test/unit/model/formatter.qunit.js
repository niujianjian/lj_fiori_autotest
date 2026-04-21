sap.ui.define([
  "demo/autotest/model/formatter"
], function (formatter) {
  "use strict";

  QUnit.module("formatter.statusText");

  QUnit.test("known statuses", function (assert) {
    assert.strictEqual(formatter.statusText("A"), "Active", "A maps to Active");
    assert.strictEqual(formatter.statusText("I"), "Inactive", "I maps to Inactive");
  });

  QUnit.test("unknown status", function (assert) {
    assert.strictEqual(formatter.statusText("X"), "Unknown", "Fallback for unknown code");
  });
});
