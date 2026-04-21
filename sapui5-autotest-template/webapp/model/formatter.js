sap.ui.define([], function () {
  "use strict";

  return {
    statusText: function (code) {
      if (code === "A") {
        return "Active";
      }
      if (code === "I") {
        return "Inactive";
      }
      return "Unknown";
    }
  };
});
