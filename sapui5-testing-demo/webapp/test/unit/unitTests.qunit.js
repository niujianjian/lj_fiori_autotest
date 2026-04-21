sap.ui.getCore().attachInit(function () {
  "use strict";

  sap.ui.require([
    "demo/testingtutorial/test/unit/model/formatter.qunit",
    "demo/testingtutorial/test/unit/model/postFilter.qunit"
  ], function () {
    QUnit.start();
  });
});
