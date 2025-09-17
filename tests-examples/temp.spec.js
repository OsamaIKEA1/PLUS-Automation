const { test, expect } = require("@playwright/test");
const supplierStartPage = require("../PageObjects/supplierStartPage.js");
const purchasingStartPage = require("../PageObjects/purchasingStartPage.js");
const fetchData = require("../dataBase/fetchData.js");

test.use({ viewport: { width: 1920, height: 1080 } });

test("data testing with HTTPS error handling", async ({ browser }) => {
  // Launch browser with a context that ignores HTTPS errors
  const context = await browser.newContext({
    ignoreHTTPSErrors: true, // Ignore SSL certificate errors
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Start your automation script
  const startPage = new purchasingStartPage(page);
  await startPage.gotoSite();
  await startPage.login();
  await startPage.newIRCOption();
  await startPage.searchForIRWithArticleNumber("IR0005163443");

  const table = await page.locator(
    "#root_mashupcontainer-62_flexcontainer-31 ptcs-v-scroller2"
  );
  const row1 = await table.locator('ptcs-div[part="row"]').first();
  const column = await row1.locator("ptcs-div.cell").nth(3);
  const box1 = await column.locator("#root #label");
  await box1.click();
  await page.waitForTimeout(5000);

  const menu = await page.locator(
    "#root_mashupcontainer-62_mashupcontainer-35_ptcsgrid-6 ptcs-v-scroller2"
  );
  const rownumbers = await menu.locator('ptcs-div[part="row"]').count();
  const partsArray = [];
  for (let i = 0; i < rownumbers - 1; i++) {
    // Exclude the first row in the menu
    const row = await menu.locator('ptcs-div[part="row"]').nth(i);
    const c = await row.locator('ptcs-div[part="body-cell"]').nth(0);
    const box = await c.locator("span");
    partsArray[i] = await box.innerText();
  }

  // Save the connected parts in documentsArray
  for (let i = 0; i < partsArray.length; i++) {
    await page.getByText(partsArray[i]).click();

    // Save the connected items in an array
    const subMenu = await page.locator(
      "#root_mashupcontainer-62_mashupcontainer-35_mashupcontainer-20_ptcsgrid-3 ptcs-core-grid#grid ptcs-v-scroller2#chunker"
    );
    const subMenuRowNumbers = await subMenu
      .locator('ptcs-div[part="row"]')
      .count();
    const documentsArray = [];
    for (let j = 0; j < subMenuRowNumbers - 1; j++) {
      let item = [];
      for (let k = 1; k < 5; k++) {
        // Exclude the first row in the submenu
        var row = await subMenu.locator('ptcs-div[part="row"]').nth(j);
        var c = await row.locator('ptcs-div[part="body-cell"]').nth(k);
        var box = await c.locator("#root #label");
        item.push(await box.innerText()); // Add the value directly to the array
      }
      documentsArray[j] = await item;
    }
  }

  await page.waitForTimeout(5000);

  // Close the browser context to clean up
  await context.close();
});
