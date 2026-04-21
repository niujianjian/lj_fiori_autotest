sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/EnterText",
  "sap/ui/test/actions/Press",
  "sap/ui/test/matchers/AggregationLengthEquals",
  "sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, EnterText, Press, AggregationLengthEquals, PropertyStrictEquals) {
  "use strict";

  var sViewName = "Worklist";

  Opa5.createPageObjects({
    onTheWorklistPage: {
      actions: {
        iPressOnMoreData: function () {
          return this.waitFor({
            id: "postsTable",
            viewName: sViewName,
            actions: new Press(),
            errorMessage: "Could not press the growing trigger on the table"
          });
        },

        iSearchFor: function (sQuery) {
          return this.waitFor({
            id: "searchField",
            viewName: sViewName,
            actions: new EnterText({
              text: sQuery,
              clearTextFirst: true
            }),
            errorMessage: "Could not interact with the search field"
          });
        },

        iSelectRequestTab: function () {
          return this.waitFor({
            id: "requestTab",
            viewName: sViewName,
            actions: new Press(),
            errorMessage: "Could not select the request tab"
          });
        },

        iSelectAllTab: function () {
          return this.waitFor({
            id: "allTab",
            viewName: sViewName,
            actions: new Press(),
            errorMessage: "Could not select the all tab"
          });
        },

        iOpenTheFirstPost: function () {
          return this.waitFor({
            id: "postsTable",
            viewName: sViewName,
            success: function (oTable) {
              oTable.getItems()[0].firePress();
            },
            errorMessage: "Could not open the first post"
          });
        }
      },

      assertions: {
        iShouldSeeSummary: function (sText) {
          return this.waitFor({
            id: "summaryTitle",
            viewName: sViewName,
            matchers: new PropertyStrictEquals({
              name: "text",
              value: sText
            }),
            success: function () {
              Opa5.assert.ok(true, "Summary text is correct");
            },
            errorMessage: "Summary text did not match"
          });
        },

        iShouldSeeVisibleItems: function (iCount) {
          return this.waitFor({
            id: "postsTable",
            viewName: sViewName,
            matchers: new AggregationLengthEquals({
              name: "items",
              length: iCount
            }),
            success: function () {
              Opa5.assert.ok(true, "Table shows " + iCount + " items");
            },
            errorMessage: "Table item count mismatch"
          });
        },

        iShouldSeeFirstPostTitle: function (sTitle) {
          return this.waitFor({
            id: "postsTable",
            viewName: sViewName,
            success: function (oTable) {
              var oIdentifier = oTable.getItems()[0].getCells()[0];
              Opa5.assert.strictEqual(oIdentifier.getTitle(), sTitle, "First post title is correct");
            },
            errorMessage: "Could not validate the first post title"
          });
        }
      }
    }
  });
});