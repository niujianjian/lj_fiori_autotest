sap.ui.define([
  "demo/testingtutorial/controller/BaseController",
  "demo/testingtutorial/model/formatter"
], function (BaseController, formatter) {
  "use strict";

  return BaseController.extend("demo.testingtutorial.controller.Detail", {
    formatter: formatter,

    onInit: function () {
      this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
    },

    onNavBack: function () {
      this.getRouter().navTo("worklist");
    },

    onSaveNote: function () {
      var oViewModel = this.getViewModel();
      var sDraft = (oViewModel.getProperty("/draftNote") || "").trim();
      oViewModel.setProperty("/savedNote", sDraft);
    },

    _onRouteMatched: function (oEvent) {
      var sPostId = decodeURIComponent(oEvent.getParameter("arguments").postId);
      var sPath = "/Posts('" + sPostId + "')";
      var oViewModel = this.getViewModel();

      this.getView().bindElement({
        path: sPath
      });

      oViewModel.setProperty("/draftNote", "");
      oViewModel.setProperty("/savedNote", "");
    }
  });
});