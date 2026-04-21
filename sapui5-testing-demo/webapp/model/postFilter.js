sap.ui.define([
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
  "use strict";

  var mCategoryMap = {
    all: "",
    offer: "Offer",
    request: "Request"
  };

  function normalizeQuery(sQuery) {
    return (sQuery || "").trim().toLowerCase();
  }

  function matchesQuery(oPost, sQuery) {
    var sNeedle = normalizeQuery(sQuery);

    if (!sNeedle) {
      return true;
    }

    return [oPost.Title, oPost.Description, oPost.Category].some(function (sValue) {
      return String(sValue || "").toLowerCase().indexOf(sNeedle) !== -1;
    });
  }

  function matchesCategory(oPost, sCategoryKey) {
    var sCategory = mCategoryMap[sCategoryKey] || "";

    return !sCategory || oPost.Category === sCategory;
  }

  return {
    createFilters: function (sQuery, sCategoryKey) {
      var aFilters = [];
      var sNeedle = (sQuery || "").trim();
      var sCategory = mCategoryMap[sCategoryKey] || "";

      if (sNeedle) {
        aFilters.push(new Filter({
          filters: [
            new Filter("Title", FilterOperator.Contains, sNeedle),
            new Filter("Description", FilterOperator.Contains, sNeedle),
            new Filter("Category", FilterOperator.Contains, sNeedle)
          ],
          and: false
        }));
      }

      if (sCategory) {
        aFilters.push(new Filter("Category", FilterOperator.EQ, sCategory));
      }

      return aFilters;
    },

    getMatchingPosts: function (aPosts, sQuery, sCategoryKey) {
      return (aPosts || []).filter(function (oPost) {
        return matchesQuery(oPost, sQuery) && matchesCategory(oPost, sCategoryKey);
      });
    },

    toCategoryValue: function (sCategoryKey) {
      return mCategoryMap[sCategoryKey] || "";
    }
  };
});