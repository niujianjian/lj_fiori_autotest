sap.ui.define([
  "sap/ui/core/util/MockServer"
], function (MockServer) {
  "use strict";

  var oMockServer;

  return {
    init: function () {
      if (oMockServer) {
        return;
      }

      var sLocalServiceUrl = sap.ui.require.toUrl("demo/testingtutorial/localService");

      oMockServer = new MockServer({
        rootUri: "/sap/opu/odata/sap/ZUI5_TESTING_TUTORIAL_SRV/"
      });

      MockServer.config({
        autoRespond: true,
        autoRespondAfter: 100
      });

      oMockServer.simulate(sLocalServiceUrl + "/metadata.xml", {
        sMockdataBaseUrl: sLocalServiceUrl + "/mockdata",
        bGenerateMissingMockData: true
      });

      oMockServer.start();
    },

    stop: function () {
      if (!oMockServer) {
        return;
      }

      oMockServer.stop();
      oMockServer = null;
    }
  };
});