sap.ui.define([
  "sap/ui/model/json/JSONModel"
], function (JSONModel) {
  "use strict";

  return {
    createViewModel: function () {
      return new JSONModel({
        selectedCategory: "all",
        searchQuery: "",
        resultSummary: "Showing 0 of 0 posts",
        draftNote: "",
        savedNote: ""
      });
    }
  };
});