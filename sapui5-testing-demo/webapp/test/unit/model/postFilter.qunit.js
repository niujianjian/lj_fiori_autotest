sap.ui.define([
  "demo/testingtutorial/model/postFilter"
], function (postFilter) {
  "use strict";

  var aPosts = [
    {
      Title: "Vintage Chair",
      Description: "Solid oak chair",
      Category: "Offer"
    },
    {
      Title: "Looking for Bike",
      Description: "Need a city bike",
      Category: "Request"
    }
  ];

  QUnit.module("postFilter");

  QUnit.test("filters by search query", function (assert) {
    var aMatches = postFilter.getMatchingPosts(aPosts, "chair", "all");

    assert.strictEqual(aMatches.length, 1, "One post matches the search");
    assert.strictEqual(aMatches[0].Title, "Vintage Chair", "The matching post is returned");
  });

  QUnit.test("filters by category", function (assert) {
    var aMatches = postFilter.getMatchingPosts(aPosts, "", "request");

    assert.strictEqual(aMatches.length, 1, "One post matches the category");
    assert.strictEqual(aMatches[0].Category, "Request", "The request category is mapped");
    assert.strictEqual(postFilter.toCategoryValue("offer"), "Offer", "Offer key is mapped to the OData value");
  });
});