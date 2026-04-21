sap.ui.define([
  "sap/ui/core/UIComponent",
  "demo/testingtutorial/model/models"
], function (UIComponent, models) {
  "use strict";

  return UIComponent.extend("demo.testingtutorial.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);
      this.setModel(models.createViewModel(), "view");
      this.getRouter().initialize();
    }
  });
});
