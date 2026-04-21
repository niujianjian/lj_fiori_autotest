sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press"
], function (Opa5, Press) {
  "use strict";

  Opa5.createPageObjects({
    onMainPage: {
      actions: {
        iEnableForceReadError: function () {
          return this.waitFor({
            id: "mainPage",
            viewName: "demo.autotest.view.Main",
            success: function () {
              window.__forceReadError = true;
              Opa5.assert.ok(true, "Forced read error flag enabled");
            },
            errorMessage: "Could not enable forced read error flag"
          });
        },
        iDisableForceReadError: function () {
          return this.waitFor({
            id: "mainPage",
            viewName: "demo.autotest.view.Main",
            success: function () {
              window.__forceReadError = false;
              Opa5.assert.ok(true, "Forced read error flag disabled");
            },
            errorMessage: "Could not disable forced read error flag"
          });
        },
        iPressSearch: function () {
          return this.waitFor({
            id: "searchButton",
            viewName: "demo.autotest.view.Main",
            actions: new Press(),
            errorMessage: "Could not find search button"
          });
        }
      },
      assertions: {
        iShouldSeeTitle: function () {
          return this.waitFor({
            id: "pageTitle",
            viewName: "demo.autotest.view.Main",
            success: function (oTitle) {
              Opa5.assert.strictEqual(oTitle.getText(), "Home", "Title text is Home");
            },
            errorMessage: "Could not find page title"
          });
        },
        iShouldSeeResultList: function () {
          return this.waitFor({
            id: "resultList",
            viewName: "demo.autotest.view.Main",
            check: function (oList) {
              return oList.getVisible() && oList.getItems().length >= 2;
            },
            success: function (oList) {
              Opa5.assert.ok(oList.getVisible(), "Result list is visible");
              Opa5.assert.ok(oList.getItems().length >= 2, "Result list has expected items");
            },
            errorMessage: "Could not find result list"
          });
        },
        iShouldSeeFirstResultText: function () {
          return this.waitFor({
            id: "resultList",
            viewName: "demo.autotest.view.Main",
            success: function (oList) {
              var oFirstItem = oList.getItems()[0];
              var oSecondItem = oList.getItems()[1];
              Opa5.assert.strictEqual(oFirstItem.getTitle(), "Result 1", "First item title is correct");
              Opa5.assert.strictEqual(oSecondItem.getTitle(), "Result 2", "Second item title is correct");
            },
            errorMessage: "Could not verify first result item text"
          });
        },
        iShouldSeeFormattedStatuses: function () {
          return this.waitFor({
            id: "resultList",
            viewName: "demo.autotest.view.Main",
            check: function (oList) {
              return oList.getItems().length >= 2;
            },
            success: function (oList) {
              var oFirstItem = oList.getItems()[0];
              var oSecondItem = oList.getItems()[1];
              Opa5.assert.strictEqual(oFirstItem.getDescription(), "Active", "First item status is formatted as Active");
              Opa5.assert.strictEqual(oSecondItem.getDescription(), "Inactive", "Second item status is formatted as Inactive");
            },
            errorMessage: "Could not verify formatted status text"
          });
        },
        iShouldSeeErrorTitle: function () {
          return this.waitFor({
            id: "pageTitle",
            viewName: "demo.autotest.view.Main",
            success: function (oTitle) {
              Opa5.assert.strictEqual(oTitle.getText(), "Home (Load Failed)", "Error branch updates title");
            },
            errorMessage: "Could not verify error title"
          });
        }
      }
    }
  });
});
