sap.ui.define([
  "demo/testingtutorial/model/formatter"
], function (formatter) {
  "use strict";

  QUnit.module("formatter");

  QUnit.test("maps known statuses", function (assert) {
    assert.strictEqual(formatter.statusText("Open"), "Available", "Open is mapped");
    assert.strictEqual(formatter.statusText("Review"), "Needs Review", "Review is mapped");
    assert.strictEqual(formatter.statusState("Sold"), "Error", "Sold maps to error state");
  });

  QUnit.test("formats monetary and date values", function (assert) {
    assert.strictEqual(formatter.priceText(24.9), "EUR 24.90", "Price is formatted with 2 decimals");
    assert.strictEqual(formatter.shortDate("2026-03-24"), "Mar 24", "Short date is formatted");
  });

  QUnit.test("maps flag button labels", function (assert) {
    assert.strictEqual(formatter.flagButtonText(true), "Unflag", "Flagged items can be unflagged");
    assert.strictEqual(formatter.flagButtonText(false), "Flag", "Unflagged items can be flagged");
  });
});
