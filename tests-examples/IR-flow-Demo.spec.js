const { test, expect } = require('@playwright/test');
const { timeout } = require('../playwright.config.js');
const { viewport } = require('../playwright.config.js');
const supplierStartPage = require('../PageObjects/supplierStartPage.js');
const purchasingStartPage = require('../PageObjects/purchasingStartPage.js');
const fetchData = require('../dataBase/fetchData.js');

test.describe('Introducing Landing Page without notification in purchasing and supplier view', ()=> {
/*
// Test that landinga asdasd
    test('Ensure in the supplier portal landing page with image and descrption about the application ', async ({ page }) => {

        const startPage = new supplierStartPage(page);
        await startPage.gotoSite();
        await startPage.login();

        // Click the title locator and check for text
        await expect(page.locator('#root_mashupcontainer-62_flexcontainer-23')).toHaveText(/.+/); // Replace with actual expected text

        // Check for the actual <img> tag inside
        const imgElement = await page.locator('img').first();
        await expect(imgElement).toBeTruthy(); // Asserts that the <img> element exists
        await expect(imgElement).toBeVisible(); // Asserts that the image is visible, if it exists

        // Click the third locator and check for text
        await expect(page.locator('#root_mashupcontainer-62_flexcontainer-39')).toHaveText(/.+/); // Replace with actual expected text
    
    });

    test('Ensure in the purchasing portal landing page with image and descrption about the application ', async ({ page }) => {

        const startPage = new purchasingStartPage(page);
        await startPage.gotoSite();
        await startPage.login();

        // Click the title locator and check for text
        await expect(page.locator('#root_mashupcontainer-62_flexcontainer-23')).toHaveText(/.+/); // Replace with actual expected text

        // Check for the actual <img> 
        const imgElement = await page.locator('img').first();
        await expect(imgElement).toBeTruthy(); // Asserts that the <img> element exists
        await expect(imgElement).toBeVisible(); // Asserts that the image is visible, if it exists

        // Click the third locator and check for text
        await expect(page.locator('#root_mashupcontainer-62_flexcontainer-39')).toHaveText(/.+/); // Replace with actual expected text
    
    });
    */
    /*
    test('check the supplier id in the first row in IR ', async ({ page }) => {

        const startPage = new purchasingStartPage(page);
        await startPage.gotoSite();
        await startPage.login();
        await startPage.newIRC();
        
      
        const table= await page.locator('#root_mashupcontainer-62_flexcontainer-31 ptcs-v-scroller2');
        const numberOfRows = await table.locator('ptcs-div[part="row"]').count();  
        
        const row= await table.locator('ptcs-div[part="row"]').nth(0);
        const column = await row.locator('ptcs-div.cell').nth(1);
        const box = await column.locator('#label'); 
        expect(await box.innerText()).toContain('15408');
        

    });
    */
})

let page; 
let startPage;

    test.describe('Actual date validations', ()=> {

        /**
         * Test case to verify that an error occure if the actual date is less than the recived date.
         * Steps:Navigate to actual date picker in landing page and details page and select the date as less than received date date as an agreed date
         * expectation: Error message should be shown "Please enter the actual implementation date between Received date and current date"
         */
    
    test.beforeAll(async ({ browser }) => {
        const context =  await browser.newContext({ viewport: { width: 1920, height: 1080 } });
        page = await context.newPage();
        startPage = new supplierStartPage(page);
        await startPage.gotoSite();
        await startPage.login();
        
    });
        
    test('select the actual date less than received date', async () => {
        await startPage.newIRCOption();
        await startPage.onGoingPage();
        await page.waitForTimeout(3*1000);
        await startPage.searchForIRWithArticleNumber('10605278');
        
      
        const table= await page.locator('#root_mashupcontainer-62_flexcontainer-31 ptcs-v-scroller2');        
        const row= await table.locator('ptcs-div[part="row"]').nth(0);
        const column = await row.locator('ptcs-div.cell').nth(6);
        const box = await column.locator('#label'); 
        const recivedDate= await box.innerText();
        
        const dateParts = recivedDate.split('-');
        // Assume receivedDate is in 'yyyy-mm-dd' format
        const [year, month, day] = dateParts;
    
        // Create a new string with the year decreased by one
        const newYear = parseInt(year) - 1;
        /*

        const modifiedDate = `${newYear}-${month}-${day}`;
        const column1 = await row.locator('ptcs-div.cell').nth(1);
        const column1box = await column1.locator('#label'); 
        const column1BoxInnertext= await column1box.innerText();

        const column2 = await row.locator('ptcs-div.cell').nth(2);
        const column2box = await column2.locator('#label'); 
        const column2BoxInnertext= await column2box.innerText();

        const column3 = await row.locator('ptcs-div.cell').nth(3);
        const column3OuterLabel = await column3.locator('ptcs-label'); 
        const column3box = await column3OuterLabel.locator('#label'); 
        const column3BoxInnertext= await column3box.innerText();
        */



        const calendarButton = await row.locator('ptcs-icon');
        const calendarButtonImg= await calendarButton.locator('img').click();

       // await page.locator('ptcs-div').filter({ hasText: `${column1BoxInnertext}-${column2BoxInnertext}-KULGLASS` }).getByRole('img').click();
        //await page.locator('ptcs-div').filter({ hasText: `${column1}-${column2}-${column3}`}).locator('ptcs-icon').click();
        await page.locator('#calendarbutton').click();
        await page.locator('#curryear').getByLabel('Select...').click();
        await page.locator('#curryear').getByLabel('Select...').fill(`${newYear}`);
        await page.getByText('4', { exact: true }).click();
        await page.getByLabel('Select', { exact: true }).click();

        const errorBox= await page.locator('#root_mashupcontainer-62_navigationfunction-204-popup_ptcslabel-5');
        await page.waitForTimeout(1000); // Wait until the error box is visible
        const errorLabel = await errorBox.locator('#root #label'); 
        const errorText = await errorLabel.innerText();
        expect(errorText).toContain("Please enter the actual implementation date between Received date and current date");
        //await expect(errorText).toMatch("Please enter the actual implementation date between Received date and current date");

        //await page.getByText('Please enter the actual').click();
        //await page.locator('#root_mashupcontainer-62_navigationfunction-204-popup_flexcontainer-21').click();


    });

    
    /**
         * Test case to verify that an error occure if the actual date more than the current date.
         * Steps:Navigate to actual date picker in landing page and details page and select the date as more than current date date as an actual date
         * expectation: Error message should be shown "Please enter the actual implementation date between Received date and current date"
         */
    test('select the actual date as an more than current date', async () => {
        await startPage.gotoSite();
        await startPage.newIRCOption();
        await startPage.onGoingPage();
        await page.waitForTimeout(3*1000);
        await startPage.searchForIRWithArticleNumber('10605278');
        
      
        const table= await page.locator('#root_mashupcontainer-62_flexcontainer-31 ptcs-v-scroller2');
        const row= await table.locator('ptcs-div[part="row"]').nth(0);

        
        /*
        const column = await row.locator('ptcs-div.cell').nth(6);
        const box = await column.locator('#label'); 
        const recivedDate= await box.innerText();
        
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(today.getDate()).padStart(2, '0');

        const currentDate = `${year}-${month}-${day}`;
        const dateNextYear = `${year+1}-${month}-${day}`;
        
        

        const column1 = await row.locator('ptcs-div.cell').nth(1);
        const column1box = await column1.locator('#label'); 
        const column1BoxInnertext= await column1box.innerText();

        const column2 = await row.locator('ptcs-div.cell').nth(2);
        const column2box = await column2.locator('#label'); 
        const column2BoxInnertext= await column2box.innerText();

        const column3 = await row.locator('ptcs-div.cell').nth(3);
        const column3OuterLabel = await column3.locator('ptcs-label'); 
        const column3box = await column3OuterLabel.locator('#label'); 
        const column3BoxInnertext= await column3box.innerText();
        */

        const today = new Date();
        const year = today.getFullYear();

        const calendarButton = await row.locator('ptcs-icon');
        const calendarButtonImg= await calendarButton.locator('img').click();

       // await page.locator('ptcs-div').filter({ hasText: `${column1BoxInnertext}-${column2BoxInnertext}-KULGLASS` }).getByRole('img').click();
        //await page.locator('ptcs-div').filter({ hasText: `${column1}-${column2}-${column3}`}).locator('ptcs-icon').click();
        await page.locator('#calendarbutton').click();
        await page.locator('#curryear').getByLabel('Select...').click();
        await page.locator('#curryear').getByLabel('Select...').fill(`${year+1}`);
        await page.getByText('4', { exact: true }).click();
        await page.getByLabel('Select', { exact: true }).click();

        const errorBox= await page.locator('#root_mashupcontainer-62_navigationfunction-204-popup_ptcslabel-5');
        await page.waitForTimeout(1000); // Wait until the error box is visible
        const errorLabel = await errorBox.locator('#root #label'); 
        const errorText = await errorLabel.innerText();
        expect(errorText).toContain("Please enter the actual implementation date between Received date and current date");
        //await expect(errorText).toMatch("Please enter the actual implementation date between Received date and current date");

        //await page.getByText('Please enter the actual').click();
        //await page.locator('#root_mashupcontainer-62_navigationfunction-204-popup_flexcontainer-21').click();

    });

})