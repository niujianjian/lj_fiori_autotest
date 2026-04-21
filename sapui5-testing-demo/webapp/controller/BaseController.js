sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("demo.testingtutorial.controller.BaseController", {
    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },

    getViewModel: function () {
      return this.getOwnerComponent().getModel("view");
    }
  });
});