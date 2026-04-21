/*global QUnit*/
sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "demo/testingtutorial/test/integration/arrangements/Startup",
  "demo/testingtutorial/test/integration/pages/Worklist",
  "demo/testingtutorial/test/integration/pages/Detail"
], function (Opa5, opaTest, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    autoWait: true,
    viewNamespace: "demo.testingtutorial.view."
  });

  QUnit.module("Testing tutorial journey");

  opaTest("Should cover pagination, search, navigation, and note saving", function (Given, When, Then) {
    Given.iStartMyApp();
    Then.onTheWorklistPage.iShouldSeeSummary("Showing 3 of 5 posts");
    Then.onTheWorklistPage.iShouldSeeVisibleItems(3);
    When.onTheWorklistPage.iPressOnMoreData();
    Then.onTheWorklistPage.iShouldSeeVisibleItems(5);
    When.onTheWorklistPage.iSearchFor("Chair");
    Then.onTheWorklistPage.iShouldSeeVisibleItems(1);
    Then.onTheWorklistPage.iShouldSeeFirstPostTitle("Vintage Chair");
    When.onTheWorklistPage.iSearchFor("");
    When.onTheWorklistPage.iSelectRequestTab();
    Then.onTheWorklistPage.iShouldSeeVisibleItems(2);
    When.onTheWorklistPage.iSelectAllTab();
    When.onTheWorklistPage.iOpenTheFirstPost();
    Then.onTheDetailPage.iShouldSeeHeader("Vintage Chair");
    When.onTheDetailPage.iEnterNote("Pick up tonight");
    When.onTheDetailPage.iSaveTheNote();
    Then.onTheDetailPage.iShouldSeeSavedNote("Pick up tonight");
    Then.iTeardownMyApp();
  });
});