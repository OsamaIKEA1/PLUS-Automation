const { test, expect } = require('@playwright/test');
const { timeout } = require('../playwright.config.js');
const { viewport } = require('../playwright.config.js');
const supplierStartPage = require('../PageObjects/supplierStartPage.js');
const purchasingStartPage = require('../PageObjects/purchasingStartPage.js');
const fetchData = require("../automation/database/fetch-data.js");

test.use({viewport:{width:1920, height: 1080}});

test('data testing', async ({ page }) => {
    const Data = new fetchData();
    // get the data as a map and convert it to an array 
    const dataMap = await Data.irDetailsFetchData();
    const dataArray= await Array.from(dataMap.entries())

    //get the first element of the IR with its values
    const data0 = await dataArray[0][1];
    const IRNumber0= await data0[1];

   // log in to purchasing page and search for the IR number 
    const startPage =  await new purchasingStartPage(page);
    await startPage.gotoSite();
    await startPage.login();
    await startPage.newIRCOption();
    await startPage.searchForIRWithArticleNumber(IRNumber0);
    
    // locate the first row of the table of the IR found
    const table= await page.locator('#root_mashupcontainer-62_flexcontainer-31 ptcs-v-scroller2');        
    var row= await table.locator('ptcs-div[part="row"]').nth(0);

    // iterate over the columns and verify if the values match the expected data
    for (let i = 0; i < 10; i++) {
        var column = await row.locator('ptcs-div.cell').nth(i+1);
        if(i == 6 || i == 8) {
          var box = await column.locator('div[part="cell-html"]');
        }
        else {
          var box = await column.locator('#root #label'); 
        }
        var innerText= await box.innerText();
        if (innerText === "") {
          // If innerText is empty, expect data0[i] to be null or 0
          expect(data0[i] === null || data0[i] === '0').toBe(true);
        }
        else {
          // If innerText is not empty, it should match data0[i] exactly
          expect(innerText).toBe(data0[i]);
        }
      } 
    

});