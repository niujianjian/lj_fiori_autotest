sap.ui.getCore().attachInit(function () {
  "use strict";

  QUnit.module("Artifact smoke");

  QUnit.test("writes a failure report when a test fails", function (assert) {
    assert.strictEqual("actual", "expected", "Intentional failure for artifact verification");
  });

  QUnit.start();
});