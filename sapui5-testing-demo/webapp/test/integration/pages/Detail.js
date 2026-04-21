sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/EnterText",
  "sap/ui/test/actions/Press"
], function (Opa5, EnterText, Press) {
  "use strict";

  var sViewName = "Detail";

  Opa5.createPageObjects({
    onTheDetailPage: {
      actions: {
        iEnterNote: function (sNote) {
          return this.waitFor({
            id: "noteInput",
            viewName: sViewName,
            actions: new EnterText({
              text: sNote,
              clearTextFirst: true
            }),
            errorMessage: "Could not enter a note"
          });
        },

        iSaveTheNote: function () {
          return this.waitFor({
            id: "saveNoteButton",
            viewName: sViewName,
            actions: new Press(),
            errorMessage: "Could not save the note"
          });
        }
      },

      assertions: {
        iShouldSeeHeader: function (sTitle) {
          return this.waitFor({
            id: "detailHeader",
            viewName: sViewName,
            success: function (oHeader) {
              Opa5.assert.strictEqual(oHeader.getTitle(), sTitle, "Detail header is correct");
            },
            errorMessage: "Could not validate the detail header"
          });
        },

        iShouldSeeSavedNote: function (sNote) {
          return this.waitFor({
            id: "savedNoteStrip",
            viewName: sViewName,
            check: function (oStrip) {
              return oStrip.getVisible();
            },
            success: function (oStrip) {
              Opa5.assert.strictEqual(oStrip.getText(), sNote, "Saved note is visible");
            },
            errorMessage: "Saved note was not shown"
          });
        }
      }
    }
  });
});