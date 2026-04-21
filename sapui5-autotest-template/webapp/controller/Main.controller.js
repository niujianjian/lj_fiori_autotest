sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "demo/autotest/model/formatter"
], function (Controller, formatter) {
  "use strict";

  return Controller.extend("demo.autotest.controller.Main", {
    statusText: formatter.statusText,

    _applyStatusDescriptions: function (oList) {
      var aItems = oList.getItems();
      aItems.forEach(function (oItem) {
        var oContext = oItem.getBindingContext();
        var sStatus = oContext ? oContext.getProperty("Status") : undefined;
        oItem.setDescription(this.statusText(sStatus));
      }.bind(this));
    },

    _hasForceReadErrorFlag: function () {
      var oComponent = this.getOwnerComponent();
      var oComponentData = oComponent && oComponent.getComponentData ? oComponent.getComponentData() : null;
      if (oComponentData && oComponentData.forceReadError === true) {
        return true;
      }

      if (typeof window === "undefined" || !window.location) {
        return false;
      }

      if (window.__forceReadError === true) {
        return true;
      }

      var sSearch = window.location.search || "";
      if (sSearch.indexOf("forceReadError=true") !== -1) {
        return true;
      }

      var sHash = window.location.hash || "";
      return sHash.indexOf("forceReadError=true") !== -1;
    },

    onPressSearch: function () {
      var oList = this.byId("resultList");
      var oTitle = this.byId("pageTitle");
      var oModel = this.getView().getModel();
      var sReadPath = this._hasForceReadErrorFlag() ? "/Results_FORCE_ERROR" : "/Results";

      oList.setVisible(true);

      if (!oModel || typeof oModel.read !== "function") {
        return;
      }

      oModel.read(sReadPath, {
        success: function () {
          oTitle.setText("Home");
          oList.attachEventOnce("updateFinished", function () {
            this._applyStatusDescriptions(oList);
          }.bind(this));
          var oBindingAfterRead = oList.getBinding("items");
          if (oBindingAfterRead) {
            oBindingAfterRead.refresh(true);
          }
        }.bind(this),
        error: function () {
          oTitle.setText("Home (Load Failed)");
        }.bind(this)
      });
    }
  });
});
