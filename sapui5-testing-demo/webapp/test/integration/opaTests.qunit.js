sap.ui.getCore().attachInit(function () {
  "use strict";

  QUnit.config.autostart = false;

  sap.ui.require([
    "demo/testingtutorial/test/integration/journeys/AppJourney"
  ], function () {
    QUnit.start();
  });
});
