sap.ui.define([
  "demo/testingtutorial/controller/BaseController",
  "demo/testingtutorial/model/formatter",
  "demo/testingtutorial/model/postFilter"
], function (BaseController, formatter, postFilter) {
  "use strict";

  return BaseController.extend("demo.testingtutorial.controller.Worklist", {
    formatter: formatter,

    onInit: function () {
      this.getViewModel().setProperty("/resultSummary", "Showing 0 of 0 posts");
    },

    onUpdateFinished: function (oEvent) {
      var oTable = oEvent.getSource();
      var iVisible = oTable.getItems().length;
      var iTotal = oEvent.getParameter("total");

      this.getViewModel().setProperty(
        "/resultSummary",
        "Showing " + iVisible + " of " + iTotal + " posts"
      );
    },

    onSearch: function (oEvent) {
      this._applyFilters(oEvent.getParameter("query"));
    },

    onLiveSearch: function (oEvent) {
      this._applyFilters(oEvent.getParameter("newValue"));
    },

    onSelectCategory: function (oEvent) {
      var sKey = oEvent.getParameter("selectedKey");
      this.getViewModel().setProperty("/selectedCategory", sKey);
      this._applyFilters(this.getViewModel().getProperty("/searchQuery"));
    },

    onToggleFlag: function (oEvent) {
      var oContext = oEvent.getSource().getBindingContext();
      var sPath = oContext.getPath() + "/Flagged";
      var bCurrent = oContext.getProperty("Flagged");

      oContext.getModel().setProperty(sPath, !bCurrent);
    },

    onSelectPost: function (oEvent) {
      var sPostId = oEvent.getSource().getBindingContext().getProperty("PostID");

      this.getRouter().navTo("detail", {
        postId: encodeURIComponent(sPostId)
      });
    },

    _applyFilters: function (sQuery) {
      var oTable = this.byId("postsTable");
      var oBinding = oTable.getBinding("items");
      var sCategory = this.getViewModel().getProperty("/selectedCategory");

      this.getViewModel().setProperty("/searchQuery", sQuery || "");

      if (oBinding) {
        oBinding.filter(postFilter.createFilters(sQuery, sCategory));
      }
    }
  });
});