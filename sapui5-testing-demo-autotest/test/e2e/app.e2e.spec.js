const assert = require("assert");

describe("SAPUI5 testing demo", () => {
  it("supports search, navigation, and note saving", async () => {
    const searchField = await browser.asControl({
      selector: {
        id: "searchField",
        viewName: "demo.testingtutorial.view.Worklist"
      }
    });

    await searchField.enterText("Chair");

    const summaryTitle = await browser.asControl({
      selector: {
        id: "summaryTitle",
        viewName: "demo.testingtutorial.view.Worklist"
      }
    });
    assert.ok((await summaryTitle.getText()).startsWith("Showing 1 of "), "search should narrow the visible rows");

    await browser.waitUntil(async () => {
      const row = await browser.$('//tr[contains(@class,"sapMListTblRow") and contains(.,"Vintage Chair")]');
      return await row.isExisting();
    }, {
      timeout: 10000,
      timeoutMsg: "Expected row with Vintage Chair after search"
    });

    const targetRow = await browser.$('//tr[contains(@class,"sapMListTblRow") and contains(.,"Vintage Chair")]');
    await targetRow.click();

    const detailHeader = await browser.asControl({
      selector: {
        id: "detailHeader",
        viewName: "demo.testingtutorial.view.Detail"
      }
    });

    assert.strictEqual(await detailHeader.getTitle(), "Vintage Chair1", "navigation should open the matching post");

    const noteInput = await browser.asControl({
      selector: {
        id: "noteInput",
        viewName: "demo.testingtutorial.view.Detail"
      }
    });
    await noteInput.enterText("Pick up tonight");

    const saveButton = await browser.asControl({
      selector: {
        id: "saveNoteButton",
        viewName: "demo.testingtutorial.view.Detail"
      }
    });
    await saveButton.firePress();

    const savedNoteStrip = await browser.asControl({
      selector: {
        id: "savedNoteStrip",
        viewName: "demo.testingtutorial.view.Detail"
      }
    });

    assert.strictEqual(await savedNoteStrip.getText(), "Pick up tonight", "saved note should be rendered");
  });
});