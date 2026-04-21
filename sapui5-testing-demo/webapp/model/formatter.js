sap.ui.define([], function () {
  "use strict";

  var mStatusText = {
    Open: "Available",
    Review: "Needs Review",
    Sold: "Closed"
  };

  var mMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  return {
    statusText: function (code) {
      return mStatusText[code] || "Unknown";
    },

    statusState: function (code) {
      if (code === "Open") {
        return "Success";
      }
      if (code === "Review") {
        return "Information";
      }
      if (code === "Sold") {
        return "Error";
      }
      return "None";
    },

    priceText: function (amount) {
      var fAmount = Number(amount || 0);

      return "EUR " + fAmount.toFixed(2);
    },

    shortDate: function (sDate) {
      if (!sDate) {
        return "";
      }

      var aParts = sDate.split("-");
      var iMonth = Number(aParts[1]) - 1;

      return mMonthNames[iMonth] + " " + Number(aParts[2]);
    },

    flagButtonText: function (bFlagged) {
      return bFlagged ? "Unflag" : "Flag";
    }
  };
});
