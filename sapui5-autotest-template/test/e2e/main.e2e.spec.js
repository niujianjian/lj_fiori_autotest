describe("Main page flow", () => {
  async function getPageTitle() {
    return browser.asControl({
      selector: {
        id: "pageTitle",
        viewName: "demo.autotest.view.Main"
      }
    });
  }

  async function getSearchButton() {
    return browser.asControl({
      selector: {
        id: "searchButton",
        viewName: "demo.autotest.view.Main"
      }
    });
  }

  async function getResultList() {
    return browser.asControl({
      selector: {
        id: "resultList",
        viewName: "demo.autotest.view.Main"
      }
    });
  }

  async function tryGetResultList() {
    try {
      return await getResultList();
    } catch (e) {
      return null;
    }
  }

  async function waitForResultListVisible() {
    await browser.waitUntil(async () => {
      const resultList = await tryGetResultList();
      if (!resultList) {
        return false;
      }
      return resultList.getVisible();
    }, {
      timeout: 15000,
      interval: 300,
      timeoutMsg: "Result list was not visible in time"
    });
  }

  async function waitForResultItems(minItems) {
    await browser.waitUntil(async () => {
      const resultList = await getResultList();
      const items = await resultList.getItems();
      return Array.isArray(items) && items.length >= minItems;
    }, {
      timeout: 15000,
      interval: 300,
      timeoutMsg: "Result list items were not loaded in time"
    });
  }

  async function waitForFormattedStatuses() {
    await browser.waitUntil(async () => {
      const resultList = await getResultList();
      const items = await resultList.getItems();
      if (!Array.isArray(items) || items.length < 2) {
        return false;
      }

      const firstDescription = await items[0].getDescription();
      const secondDescription = await items[1].getDescription();
      return firstDescription === "Active" && secondDescription === "Inactive";
    }, {
      timeout: 15000,
      interval: 300,
      timeoutMsg: "Formatted status descriptions were not ready in time"
    });
  }

  it("should verify title and formatted statuses in happy path", async () => {
    await browser.execute(() => {
      window.__forceReadError = false;
    });

    const pageTitle = await getPageTitle();
    const titleText = await pageTitle.getText();
    if (titleText !== "Home") {
      throw new Error("Unexpected page title: " + titleText);
    }

    const searchButton = await getSearchButton();
    await searchButton.press();

    await waitForResultListVisible();
    const resultList = await getResultList();
    const visible = await resultList.getVisible();
    if (!visible) {
      throw new Error("Result list should be visible after search");
    }

    await waitForResultItems(2);
    const items = await resultList.getItems();

    const firstTitle = await items[0].getTitle();
    if (firstTitle !== "Result 1") {
      throw new Error("Unexpected first item title: " + firstTitle);
    }

    const secondTitle = await items[1].getTitle();
    if (secondTitle !== "Result 2") {
      throw new Error("Unexpected second item title: " + secondTitle);
    }

    await waitForFormattedStatuses();

    const firstDescription = await items[0].getDescription();
    if (firstDescription !== "Active") {
      throw new Error("Unexpected first item status description: " + firstDescription);
    }

    const secondDescription = await items[1].getDescription();
    if (secondDescription !== "Inactive") {
      throw new Error("Unexpected second item status description: " + secondDescription);
    }
  });

  it("should execute read error branch and update title", async () => {
    await browser.execute(() => {
      window.__forceReadError = true;
    });

    const pageTitle = await getPageTitle();
    const initialTitle = await pageTitle.getText();
    if (initialTitle !== "Home") {
      throw new Error("Unexpected initial title in error scenario: " + initialTitle);
    }

    const searchButton = await getSearchButton();
    await searchButton.press();

    await browser.waitUntil(async () => {
      const currentTitle = await pageTitle.getText();
      return currentTitle === "Home (Load Failed)";
    }, {
      timeout: 15000,
      interval: 300,
      timeoutMsg: "Error title was not shown in time"
    });

    await browser.execute(() => {
      window.__forceReadError = false;
    });
  });
});
