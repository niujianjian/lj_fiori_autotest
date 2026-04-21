sap.ui.getCore().attachInit(function () {
  "use strict";

  QUnit.config.autostart = false;

  sap.ui.require([
    "demo/autotest/test/integration/journeys/MainJourney",
    "demo/autotest/test/integration/journeys/MainJourney2"
  ], function () {
    QUnit.start();
  });
});
