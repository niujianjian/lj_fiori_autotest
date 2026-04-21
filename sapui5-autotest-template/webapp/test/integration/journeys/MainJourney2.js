sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "demo/autotest/test/integration/arrangements/Startup",
  "demo/autotest/test/integration/pages/Main"
], function (Opa5, opaTest, Startup) {
  "use strict";
  Opa5.extendConfig({
    arrangements: new Startup(),
    autoWait: true
  });

  QUnit.module("Main Journey2");
  opaTest("test2", function (Given, When, Then) {
    QUnit.expect(8);
    Given.iStartMyApp();
    Then.onMainPage.iShouldSeeTitle();
    When.onMainPage.iPressSearch();
    Then.onMainPage.iShouldSeeResultList();
    Then.onMainPage.iShouldSeeFirstResultText();
    Then.onMainPage.iShouldSeeFormattedStatuses();
    Then.onMainPage.iShouldSeeTitle();
    Given.iTeardownMyApp();
  });
});
