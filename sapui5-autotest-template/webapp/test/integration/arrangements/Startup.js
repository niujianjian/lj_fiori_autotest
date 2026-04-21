sap.ui.define([
  "sap/ui/test/Opa5"
], function (Opa5) {
  "use strict";

  return Opa5.extend("demo.autotest.test.integration.arrangements.Startup", {
    iStartMyApp: function () {
      return this.iStartMyUIComponent({
        componentConfig: {
          name: "demo.autotest",
          async: true,
          componentData: {
            forceReadError: false
          }
        }
      });
    },

    iStartMyAppWithReadError: function () {
      return this.iStartMyUIComponent({
        componentConfig: {
          name: "demo.autotest",
          async: true,
          componentData: {
            forceReadError: true
          }
        }
      });
    },

    iTeardownMyApp: function () {
      this.iTeardownMyUIComponent();
    }
  });
});
