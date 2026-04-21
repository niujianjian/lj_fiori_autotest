sap.ui.getCore().attachInit(function () {
  "use strict";

  sap.ui.require([
    "demo/autotest/test/unit/model/formatter.qunit"
  ], function () {
    QUnit.start();
  });
});
