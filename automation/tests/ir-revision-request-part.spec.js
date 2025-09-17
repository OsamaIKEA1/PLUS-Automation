const { test, expect } = require("@playwright/test");
const { setupHooks, sharedData } = require("../hooks/hooks.js");
const dynamicValues = require("../dynamic-values.js");

import * as supplierHelper from "../helper-functions/helper-supplier.js";
import * as purchasingHelper from "../helper-functions/helper-purchasing.js";
import * as windchillHelper from "../helper-functions/helper-windchill.js";
import * as sharedHelper from "../helper-functions/shared-helpers.js";
import { locators } from "../locators/locators.js";
import { locators as windchillLocators } from "../locators/locators-windchill.js";

setupHooks();
let columnsNamesNewIrPageSupplier;
let columnsNamesOngoingPageSupplier;
let columnsNamesRevisionRequestPageSupplier;

let columnsNamesRevisionRequestPagePurchasing;

test.beforeAll(async ({ browser, playwright }) => {
  const browserr = sharedData.page.context().browser();
  const newContext = await browserr.newContext();
  const newPage = await newContext.newPage();

  columnsNamesNewIrPageSupplier = await supplierHelper.saveColumnsNamesNewIrPagePart(newPage);
  columnsNamesOngoingPageSupplier = await supplierHelper.saveColumnsNamesOngoingPagePart(newPage);
  columnsNamesRevisionRequestPageSupplier = await supplierHelper.saveColumnsNamesRevisionRequestPagePart(newPage);

  const browserr2 = sharedData.page.context().browser();
  const newContext2 = await browserr2.newContext();
  const newPage2 = await newContext2.newPage();

  columnsNamesRevisionRequestPagePurchasing = await purchasingHelper.saveColumnsNamesIrTableRevisionRequestPagePart(newPage2);

  await newPage.close();
  await newContext.close();
  await newPage2.close();
  await newContext2.close();
});

// Requires: 4 IRs in total in New IR page in the Supplier portal
test.describe("Raise Revision Request on IR by selecting single or multiple IR's from List Page or Details Page", () => {
  test.describe.configure({ retries: 0, timeout: 600000 });

  // Requires: 1 IR in New IR page
  test("Test Case #1: Testing IR from Details Page from the New IR page with different request implementation dates and send button behavior", async ({ playwright }) => {
    let revisionIR;

    // Expected result: user should be able to search for the IR and click on it to open the details page and then open the revision request popup. User should not be able to send the request if the suggested implementation date is prior to the current date
    await test.step("Select the IR Details from New IR and provide new suggested request impl.date prior to current date", async () => {
      // Selecting the IR details from New IR
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPagePart(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPageSupplier.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      revisionIR = await boxIR.innerText();
    
      var columnPartName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPageSupplier.get(dynamicValues.PartName));
      await sharedHelper.ensureVisible(sharedData.page, columnPartName);
      await columnPartName.locator('ptcs-link').click();

      await sharedData.page.waitForTimeout(5000); // Fixed delay that is needed for the next step to work

      // Provide a new suggested implementation date prior to the current date
      await sharedData.page.evaluate(() => {
        const btn = document.querySelector("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-533-bounding-box");
        if (btn) {
          btn.style.display = "block";
          btn.style.visibility = "visible";
          btn.style.opacity = "1";
        }
      });
      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonDetailsPage(sharedData.page));
      await locators.revisionRequestButtonDetailsPage(sharedData.page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await supplierHelper.provideSuggestedDateDetailsPage(sharedData.page, yesterday);

      // Verify that validation error message exists when past date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).toBeVisible();
      
      const validationExists = await validationMessage.count() > 0;
      expect(validationExists).toBe(true);
    });

    // Expected result: user should not be able to send the request if the suggested implementation date is the current date
    await test.step("Provide new suggested request impl.date as current date", async () => {
      const today = new Date();
      await supplierHelper.provideSuggestedDateDetailsPage(sharedData.page, today);

      // Verify that validation error message does not exist when current date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).not.toBeVisible();

      const validationNotExists = await validationMessage.count() == 0;
      expect(validationNotExists).toBe(true);
    });

    // Expected result: user should be able to provide a new suggested implementation date as a future date, write a comment and click on the send request button
    await test.step("Provide new suggested request impl.date as future date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supplierHelper.provideSuggestedDateDetailsPage(sharedData.page, tomorrow);

      // Write a comment
      await locators.commentFieldRevReqDetailsPageSupplier(sharedData.page).click();
      await locators.commentFieldRevReqDetailsPageSupplier(sharedData.page).type("This is a test comment");

      // Verify that validation error message does not exist when current date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).not.toBeVisible();

      const validationNotExists = await validationMessage.count() == 0;
      expect(validationNotExists).toBe(true);

      // Click on the "Send Request" button
      await locators.sendRequestButtonDetailsPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageNewIrSupplierList(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: user should not be able to find the IR in the New IR tab
    await test.step("Validate that the IR has been removed from the New IR tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPagePart(sharedData.page);

      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(false);
    });

    // Expected result: user should be able to find the IR in the Revision Request tab
    await test.step("Validate that the IR has been moved to the Revision Request tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to confirm the status of the IR in the Revision Request tab as 'Pending'
    await test.step("Validate that the status of the IR is 'Pending' in the Revision Request tab", async () => {
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, revisionIR);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Pending");
    });
  });

  // Requires: 1 IR in New IR page
  test("Test Case #2: Testing a single IR from List Page from the New IR page with different request implementation dates and send button behavior", async ({ playwright }) => {
    let revisionIR;

    // Expected result: user should be able to search for the IR and click on its checkbox and then open the revision request popup. User should not be able to send the request if the suggested implementation date is prior to the current date
    await test.step("Select one IR from the list page and provide new suggested request impl.date prior to current date", async () => {
      // Selecting the IR details from New IR
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPagePart(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPageSupplier.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      revisionIR = await boxIR.innerText();

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      // Provide a new suggested implementation date prior to the current date
      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonListPage(sharedData.page));
      await sharedData.page.waitForTimeout(3000); // Fixed delay ensuring the revision popup is loaded properly
      await locators.revisionRequestButtonListPage(sharedData.page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, yesterday);

      // Verify that validation error message exists when past date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).toBeVisible();
      
      const validationExists = await validationMessage.count() > 0;
      expect(validationExists).toBe(true);
    });

    // Expected result: user should not be able to send the request if the suggested implementation date is the current date
    await test.step("Provide new suggested request impl.date as current date", async () => {
      const today = new Date();
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, today);

      // Verify that validation error message does not exist when current date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).not.toBeVisible();

      const validationNotExists = await validationMessage.count() == 0;
      expect(validationNotExists).toBe(true);
    });

    // Expected result: user should be able to provide a new suggested implementation date as a future date, write a comment and click on the send request button
    await test.step("Provide new suggested request impl.date as future date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, tomorrow);

      // Write a comment
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).click();
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).type("This is a test comment");

      // Verify that validation error message does not exist when current date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).not.toBeVisible();

      const validationNotExists = await validationMessage.count() == 0;
      expect(validationNotExists).toBe(true);

      // Click on the "Send Request" button
      await locators.sendRequestButtonListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageNewIrSupplierList(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: user should not be able to find the IR in the New IR tab
    await test.step("Validate that the IR has been removed from the New IR tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPagePart(sharedData.page);

      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(false);
    });

    // Expected result: user should be able to find the IR in the Revision Request tab
    await test.step("Validate that the IR has been moved to the Revision Request tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to confirm the status of the IR in the Revision Request tab as 'Pending'
    await test.step("Validate that the status of the IR is 'Pending' in the Revision Request tab", async () => {
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, revisionIR);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Pending");
    });
  });

  // Requires: 2 IRs in New IR page
  test("Test Case #3: Testing multiple IRs from List Page from the New IR page with different request implementation dates and send button behavior", async ({ playwright }) => {
    let revisionIRs = [];

    // Expected result: user should be able to search for the IRs and click on their checkbox and then open the revision request popup. User should not be able to send the request if the suggested implementation date is prior to the current date
    await test.step("Select multiple IRs from the list page and provide new suggested request impl.date prior to current date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPagePart(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      // Selecting the first two IRs after the search
      for (let i = 0; i < 2; i++) {
        var columnIR = await locators.irColumn(sharedData.page, i).nth(columnsNamesNewIrPageSupplier.get(dynamicValues.ImplementationRequest));
        var boxIR = await columnIR.locator("#root #label");
        revisionIRs[i] = await boxIR.innerText();

        // Select the checkbox for the first two rows
        await sharedHelper.clickCheckboxForRow(sharedData.page, i);
      }

      // Provide a new suggested implementation date prior to the current date
      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonListPage(sharedData.page));
      await sharedData.page.waitForTimeout(3000); // Fixed delay ensuring the revision popup is loaded properly
      await locators.revisionRequestButtonListPage(sharedData.page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, yesterday);

      // Verify that validation error message exists when past date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).toBeVisible();
      
      const validationExists = await validationMessage.count() > 0;
      expect(validationExists).toBe(true);
    });

    // Expected result: user should not be able to send the request if the suggested implementation date is the current date
    await test.step("Provide new suggested request impl.date as current date", async () => {
      const today = new Date();
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, today);

      // Verify that validation error message does not exist when current date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).not.toBeVisible();

      const validationNotExists = await validationMessage.count() == 0;
      expect(validationNotExists).toBe(true);
    });

    // Expected result: user should be able to provide a new suggested implementation date as a future date, write a comment and click on the send request button
    await test.step("Provide new suggested request impl.date as future date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, tomorrow);

      // Write a comment 
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).click();
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).type("This is a test comment");

      // Verify that validation error message does not exist when current date is provided
      const validationMessage = sharedData.page.locator('ptcs-validation-message[validity="invalid"]');
      await expect(validationMessage).not.toBeVisible();

      const validationNotExists = await validationMessage.count() == 0;
      expect(validationNotExists).toBe(true);

      // Click on the "Send Request" button
      await locators.sendRequestButtonListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageNewIrSupplierList(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: user should not be able to find the IRs in the New IR tab
    await test.step("Validate that the IRs have been removed from the New IR tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPagePart(sharedData.page);

      for (let i = 0; i < revisionIRs.length; i++) {
        let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIRs[i]);
        expect(isIrExist).toBe(false);
      }
    });

    // Expected result: user should be able to find the IRs in the Revision Request tab
    await test.step("Validate that the IRs have been moved to the Revision Request tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      for (let i = 0; i < revisionIRs.length; i++) {
        let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIRs[i]);
        expect(isIrExist).toBe(true);
      }
    });

    // Expected result: user should be able to confirm the status of the IRs in the Revision Request tab as 'Pending'
    await test.step("Validate that the status of the IRs is 'Pending' in the Revision Request tab", async () => {
      for (let i = 0; i < revisionIRs.length; i++) {
        await supplierHelper.searchForIrWithArticleNumber(sharedData.page, revisionIRs[i]);

        var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
        var boxStatus = await columnStatus.locator("#root #label");
        var statusText = await boxStatus.innerText();
        expect(statusText).toBe("Pending");
      }
    });
  });

  /** !!! TEST CASE #5 AND #6 ARE COMMENTED OUT DUE TO REQUIREMENT CHANGES !!!
  -----------------------------------------------------------------------------

  // Requires: 1 IR in Ongoing page
  test("Test Case #4: Testing IR from Details Page from the Ongoing page with different implementation dates and send button behavior", async ({ playwright }) => {
    let revisionIR;
    // Expected result: user should be able to search for the IR and click on it to open the details page and then open the revision request popup. User should not be able to send the request if the suggested implementation date is prior to the current date
    await test.step("Select the IR Details from Ongoing page and provide new suggested request impl.date prior to current date", async () => {
      // Selecting the IR details from Ongoing page
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      revisionIR = await boxIR.innerText();

      var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.ItemName));
      await columnItemName.click();

      // Provide a new suggested implementation date prior to the current date
      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonDetailsPage(sharedData.page));
      await locators.revisionRequestButtonDetailsPage(sharedData.page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await supplierHelper.provideSuggestedDateDetailsPage(sharedData.page, yesterday);

      const isEnabled = await locators.sendRequestButtonDetailsPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(false);
    });

    // Expected result: user should not be able to send the request if the suggested implementation date is the current date
    await test.step("Provide new suggested request impl.date as current date", async () => {
      const today = new Date();
      await supplierHelper.provideSuggestedDateDetailsPage(sharedData.page, today);

      const isEnabled = await locators.sendRequestButtonDetailsPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(false);
    });

    // Expected result: user should be able to provide a new suggested implementation date as a future date, write a comment and click on the send request button
    await test.step("Provide new suggested request impl.date as future date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supplierHelper.provideSuggestedDateDetailsPage(sharedData.page, tomorrow);

      // Write a comment
      await locators.commentFieldRevReqDetailsPageSupplier(sharedData.page).click();
      await locators.commentFieldRevReqDetailsPageSupplier(sharedData.page).type("This is a test comment");

      const isEnabled = await locators.sendRequestButtonDetailsPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(true);

      // Click on the "Send Request" button
      await locators.sendRequestButtonDetailsPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.releaseSuccessMessageOngoingPageDetailsPageSupplier(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: user should not be able to find the IR in the Ongoing tab
    await test.step("Validate that the IR has been removed from the Ongoing tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);

      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(false);
    });

    // Expected result: user should be able to find the IR in the Revision Request tab
    await test.step("Validate that the IR has been moved to the Revision Request tab", async () => {
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to confirm the status of the IR in the Revision Request tab as 'Pending'
    await test.step("Validate that the status of the IR is 'Pending' in the Revision Request tab", async () => {
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, revisionIR);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Pending");
    });
  });

  // Requires: 1 IR in Ongoing page
  test("Test Case #5: Testing a single IR from List Page from the Ongoing page with different implementation dates and send button behavior", async ({ playwright }) => {
    let revisionIR;

    // Expected result: user should be able to search for the IR and click on its checkbox and then open the revision request popup. User should not be able to send the request if the suggested implementation date is prior to the current date
    await test.step("Select one IR from the list page and provide new suggested request impl.date prior to current date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      revisionIR = await boxIR.innerText();

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      // Provide a new suggested implementation date prior to the current date
      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonListPage(sharedData.page));
      await locators.revisionRequestButtonListPage(sharedData.page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, yesterday);

      const isEnabled = await locators.sendRequestButtonListPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(false);
    });

    // Expected result: user should not be able to send the request if the suggested implementation date is the current date
    await test.step("Provide new suggested request impl.date as current date", async () => {
      const today = new Date();
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, today);

      const isEnabled = await locators.sendRequestButtonListPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(false);
    });

    // Expected result: user should be able to provide a new suggested implementation date as a future date, write a comment and click on the send request button
    await test.step("Provide new suggested request impl.date as future date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, tomorrow);

      // Write a comment
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).click();
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).type("This is a test comment");

      const isEnabled = await locators.sendRequestButtonListPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(true);

      // Click on the "Send Request" button
      await locators.sendRequestButtonListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.releaseSuccessMessageOngoingPageListPageSupplier(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: user should not be able to find the IR in the Ongoing tab
    await test.step("Validate that the IR has been removed from the Ongoing tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);

      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(false);
    });

    // Expected result: user should be able to find the IR in the Revision Request tab
    await test.step("Validate that the IR has been moved to the Revision Request tab", async () => {
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIR);
      expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to confirm the status of the IR in the Revision Request tab as 'Pending'
    await test.step("Validate that the status of the IR is 'Pending' in the Revision Request tab", async () => {
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, revisionIR);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Pending");
    });
  });

  // Requires: 2 IRs in Ongoing page
  test("Test Case #6: Testing multiple IRs from List Page from the Ongoing page with different implementation dates and send button behavior", async ({ playwright }) => {
    let revisionIRs = [];

    // Expected result: user should be able to search for the IRs and click on their checkbox and then open the revision request popup. User should not be able to send the request if the suggested implementation date is prior to the current date
    await test.step("Select multiple IRs from the list page and provide new suggested request impl.date prior to current date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      // Selecting the first two IRs after the search
      for (let i = 0; i < 2; i++) {
        var columnIR = await locators.irColumn(sharedData.page, i).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.ImplementationRequest));
        var boxIR = await columnIR.locator("#root #label");
        revisionIRs[i] = await boxIR.innerText();

        // Select the checkbox for the first two rows
        await sharedHelper.clickCheckboxForRow(sharedData.page, i);
      }

      // Provide a new suggested implementation date prior to the current date
      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonListPage(sharedData.page));
      await locators.revisionRequestButtonListPage(sharedData.page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, yesterday);

      const isEnabled = await locators.sendRequestButtonListPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(false);
    });

    // Expected result: user should not be able to send the request if the suggested implementation date is the current date
    await test.step("Provide new suggested request impl.date as current date", async () => {
      const today = new Date();
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, today);

      const isEnabled = await locators.sendRequestButtonListPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(false);
    });

    // Expected result: user should be able to provide a new suggested implementation date as a future date, write a comment and click on the send request button
    await test.step("Provide new suggested request impl.date as future date", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supplierHelper.provideSuggestedDateListPage(sharedData.page, tomorrow);

      // Write a comment
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).click();
      await locators.commentFieldRevReqListPageSupplier(sharedData.page).type("This is a test comment");

      const isEnabled = await locators.sendRequestButtonListPage(sharedData.page).isEnabled();
      expect(isEnabled).toBe(true);

      // Click on the "Send Request" button
      await locators.sendRequestButtonListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.releaseSuccessMessageOngoingPageListPageSupplier(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: user should not be able to find the IRs in the Ongoing tab
    await test.step("Validate that the IRs have been removed from the Ongoing tab", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);

      for (let i = 0; i < revisionIRs.length; i++) {
        let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIRs[i]);
        expect(isIrExist).toBe(false);
      }
    });

    // Expected result: user should be able to find the IRs in the Revision Request tab
    await test.step("Validate that the IRs have been moved to the Revision Request tab", async () => {
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      for (let i = 0; i < revisionIRs.length; i++) {
        let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, revisionIRs[i]);
        expect(isIrExist).toBe(true);
      }
    });

    // Expected result: user should be able to confirm the status of the IRs in the Revision Request tab as 'Pending'
    await test.step("Validate that the status of the IRs is 'Pending' in the Revision Request tab", async () => {
      for (let i = 0; i < revisionIRs.length; i++) {
        await supplierHelper.searchForIrWithArticleNumber(sharedData.page, revisionIRs[i]);

        var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
        var boxStatus = await columnStatus.locator("#root #label");
        var statusText = await boxStatus.innerText();
        expect(statusText).toBe("Pending");
      }
    });
  });
  */
});

// Requires: 1 IR in Revision Request page in both Supplier and Purchasing portals (same IR, not two different IRs)
test.describe("Purchasing user should be able to see the revision request details raised by the supplier user", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  test("Test Case #1: User should be able to see the IR details for which the supplier user has raised revision request with pending status", async ({ playwright }) => {
    let revisionIR;
    let revisionProposedDate;
    let revisionComment;

    // Expected result: user should be able to save the IR details for a revision request
    await test.step("Navigate to the Revision Request in the Supplier Portal and save some details of a chosen IR", async () => {
      // New context for the supplier portal
      const browser = sharedData.page.context().browser();
      const newContext = await browser.newContext();
      const newPage = await newContext.newPage();

      await supplierHelper.performLoginSupplier(newPage);
      await supplierHelper.navigateToRevisionRequestPagePart(newPage);
      await supplierHelper.searchForIrWithArticleNumber(newPage, dynamicValues.testEnvPartNumber);

      // Save the IR details
      var columnIR = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      revisionIR = await boxIR.innerText();

      // Save the Proposed Date details
      var columnProposedDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.proposedDate));
      var boxProposedDate = await columnProposedDate.locator("#root #label");
      revisionProposedDate = await boxProposedDate.innerText();

      // Save the Comment details
      var columnComment = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.comments));
      var boxComment = await columnComment.locator("#root #label");
      revisionComment = await boxComment.innerText();

      // Validate the IR details
      expect(revisionIR).not.toBeNull();
      expect(revisionIR).not.toBe("");

      // Validate the Proposed Date details
      expect(revisionProposedDate).not.toBeNull();
      expect(revisionProposedDate).not.toBe("");

      await newPage.close();
    });

    // Expected result: purchasing user should be able to see the IR details for which the supplier user has raised revision request
    await test.step("Navigate to the Purchasing Portal and validate the IR details", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, revisionIR);

      // Validate the IR details
      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      var purchasingIR = await boxIR.innerText();
      expect(purchasingIR).toBe(revisionIR);
    });

    // Expected result: purchasing user should be able to see the Proposed Date for which the supplier user has raised revision request
    await test.step("Validate the Proposed Date details", async () => {
      var columnProposedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.proposedDate));
      var boxProposedDate = await columnProposedDate.locator("#root #label");
      var purchasingProposedDate = await boxProposedDate.innerText();
      expect(purchasingProposedDate).toBe(revisionProposedDate);
    });

    // Expected result: purchasing user should be able to see the Comment for which the supplier user has raised revision request
    await test.step("Validate the Comment details", async () => {
      var columnComment = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.comments));
      var boxComment = await columnComment.locator("#root #label");
      var purchasingComment = await boxComment.innerText();
      expect(purchasingComment).toBe(revisionComment);
    });
  });
});

// Requires: 4 IRs in Revision Request page in Purchasing portal
test.describe("Decline a revision request by providing comments from list or details page for single or multiple revision requests", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  // Requires: 1 IR in Revision Request page in Purchasing portal
  test("Test Case #1: Decline a revision request from Details Page, then login to Supplier Portal and approve the declined revision request", async ({ playwright }) => {
    let declineIR;
    let agreedImplementationDate;
    let requestedImplementationDate;

    // Expected result: purchasing user should be able to find a revision request and decline it with comments and IR number should be displayed
    await test.step("Open the details page and decline the revision request with a comment", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      // Save the IR details
      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      declineIR = await boxIR.innerText();

      // var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ItemName));
      // await columnItemName.click();
      var columnPartName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.PartName));
      await columnPartName.click();

      await sharedData.page.waitForTimeout(3000); // Fixed delay that is needed for the next step to work

      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonPurchasingEnv(sharedData.page));
      await locators.revisionRequestButtonPurchasingEnv(sharedData.page).click();

      await locators.commentFieldRevReqDetailsPagePurchasing(sharedData.page).click();
      await locators.commentFieldRevReqDetailsPagePurchasing(sharedData.page).type("TEST: Revision request declined - Details Page");

      expect(declineIR).not.toBeNull();
      expect(declineIR).not.toBe("");

      await locators.declineRevReqDetailsPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.declinedSuccessMessageRevisionRequestPagePurchasing(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.declinedSuccessMessage);
    });

    // Expected result: user should not be able to find the IR in the Revision Request tab
    await test.step("Validate that the IR has been removed from the Revision Request tab", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);

      let isIrExist = await purchasingHelper.isIrExistInListPage(sharedData.page, declineIR);
      expect(isIrExist).toBe(false);
    });

    const browser = sharedData.page.context().browser();
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();

    // Expected result: supplier user should be able to find the declined revision request and validate the status as 'Rejected'
    await test.step("Navigate to the Revision Request in the Supplier Portal and validate the status of the declined revision request", async () => {
      await supplierHelper.performLoginSupplier(newPage);
      await supplierHelper.navigateToRevisionRequestPagePart(newPage);
      await supplierHelper.searchForIrWithArticleNumber(newPage, declineIR);

      var columnStatus = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Rejected");

      // Save the agreed implementation date details
      var columnAgreedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.AgreedImplementationDate));
      var boxAgreedImplementationDate = await columnAgreedImplementationDate.locator("#root #label");
      agreedImplementationDate = await boxAgreedImplementationDate.innerText();

      // Save the requested implementation date details
      var columnRequestedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.ReqestedImplementationDate));
      requestedImplementationDate = await columnRequestedImplementationDate.innerText();
    });

    // Expected result: supplier user should be able to accept the declined revision request and see a success message
    await test.step("Accept the declined revision request and validate the success message", async () => {
      let columnLocator = locators.irColumnForFirstRow(newPage);
      var acceptButtonColumn = await columnLocator.nth(14);
      var acceptButton = await acceptButtonColumn.locator("button[type='button']");
      await acceptButton.hover();
      await acceptButton.click();

      await newPage.waitForTimeout(30 * 1000);
      const successMessage = await locators.releaseSuccessMessageRevisionRequestPageSupplier(newPage).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: supplier user should be able to confirm the Agreed Implementation Date in the Ongoing tab
    await test.step("Navigate to Ongoing tab and validate the Agreed Implementation Date", async () => {
      await supplierHelper.performLoginSupplier(newPage);
      await supplierHelper.navigateToOngoingPage(newPage);
      await supplierHelper.searchForIrWithArticleNumber(newPage, declineIR);

      var columnAgreedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.AgreedImplementationDate));
      var agreedImplementationDateOngoing = await columnAgreedImplementationDate.innerText();

      if (agreedImplementationDate === "") {
        agreedImplementationDate = requestedImplementationDate;
      }

      expect(agreedImplementationDateOngoing).toBe(agreedImplementationDate);

      await newPage.close();
    });
  });

  // Requires: 1 IR in Revision Request page in Purchasing portal
  test("Test Case #2: Decline a revision request from List Page, then login to Supplier Portal and approve the declined revision request", async ({ playwright }) => {
    let declineIR;
    let agreedImplementationDate;
    let requestedImplementationDate;

    // Expected result: purchasing user should be able to find a revision request and decline it with comments and IR number should be displayed
    await test.step("Select an IR from list page and decline the revision request with a comment", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      declineIR = await boxIR.innerText();

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      await locators.declineRevReqListPage(sharedData.page).click();
      await sharedHelper.ensureVisible(sharedData.page, locators.commentFieldRevReqListPagePurchasing(sharedData.page));
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).click();
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).type("TEST: Revision request declined - List Page");

      expect(declineIR).not.toBeNull();
      expect(declineIR).not.toBe("");

      await locators.popupDeclineRevReqListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.declinedSuccessMessageRevisionRequestPagePurchasing(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.declinedSuccessMessage);
    });

    // Expected result: user should not be able to find the IR in the Revision Request tab
    await test.step("Validate that the IR has been removed from the Revision Request tab", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);

      let isIrExist = await purchasingHelper.isIrExistInListPage(sharedData.page, declineIR);
      expect(isIrExist).toBe(false);
    });

    const browser = sharedData.page.context().browser();
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();

    // Expected result: supplier user should be able to find the declined revision request and validate the status as 'Rejected'
    await test.step("Navigate to the Revision Request in the Supplier Portal and validate the status of the declined revision request", async () => {
      await supplierHelper.performLoginSupplier(newPage);
      await supplierHelper.navigateToRevisionRequestPagePart(newPage);
      await supplierHelper.searchForIrWithArticleNumber(newPage, declineIR);

      var columnStatus = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Rejected");

      // Save the agreed implementation date details
      var columnAgreedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.AgreedImplementationDate));
      var boxAgreedImplementationDate = await columnAgreedImplementationDate.locator("#root #label");
      agreedImplementationDate = await boxAgreedImplementationDate.innerText();

      // Save the requested implementation date details
      var columnRequestedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.ReqestedImplementationDate));
      requestedImplementationDate = await columnRequestedImplementationDate.innerText();
    });

    // Expected result: supplier user should be able to accept the declined revision request and see a success message
    await test.step("Accept the declined revision request and validate the success message", async () => {
      let columnLocator = locators.irColumnForFirstRow(newPage);
      var acceptButtonColumn = await columnLocator.nth(14);
      var acceptButton = await acceptButtonColumn.locator("button[type='button']");
      await acceptButton.hover();
      await acceptButton.click();

      await newPage.waitForTimeout(30 * 1000);
      const successMessage = await locators.releaseSuccessMessageRevisionRequestPageSupplier(newPage).innerText();
      expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: supplier user should be able to confirm the Agreed Implementation Date in the Ongoing tab
    await test.step("Navigate to Ongoing tab and validate the Agreed Implementation Date", async () => {
      await supplierHelper.performLoginSupplier(newPage);
      await supplierHelper.navigateToOngoingPage(newPage);
      await supplierHelper.searchForIrWithArticleNumber(newPage, declineIR);

      var columnAgreedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.AgreedImplementationDate));
      var agreedImplementationDateOngoing = await columnAgreedImplementationDate.innerText();

      if (agreedImplementationDate === "") {
        agreedImplementationDate = requestedImplementationDate;
      }

      expect(agreedImplementationDateOngoing).toBe(agreedImplementationDate);

      await newPage.close();
    });
  });

  // Requires: 2 IRs in Revision Request page in Purchasing portal
  test("Test Case #3: Decline multiple revision requests from List Page, then login to Supplier Portal and approve the declined revision requests", async ({ playwright }) => {
    let declinedIRs = [];
    let agreedImplementationDate;
    let requestedImplementationDate;

    // Expected result: purchasing user should be able to find multiple revision requests and decline them with comments and the IR numbers should be displayed
    await test.step("Select multiple IRs from list page and decline the revision requests with a comment", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      for (let i = 0; i < 2; i++) {
        var columnIR = await locators.irColumn(sharedData.page, i).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
        var boxIR = await columnIR.locator("#root #label");
        declinedIRs[i] = await boxIR.innerText();

        // Select the checkbox for the first two rows
        await sharedHelper.clickCheckboxForRow(sharedData.page, i);
      }

      await locators.declineRevReqListPage(sharedData.page).click();
      await sharedHelper.ensureVisible(sharedData.page, locators.commentFieldRevReqListPagePurchasing(sharedData.page));
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).click();
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).type("TEST: Revision request declined - List Page");

      expect(declinedIRs[0]).not.toBeNull();
      expect(declinedIRs[0]).not.toBe("");
      expect(declinedIRs[1]).not.toBeNull();
      expect(declinedIRs[1]).not.toBe("");

      await locators.popupDeclineRevReqListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.declinedSuccessMessageRevisionRequestPagePurchasing(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.declinedSuccessMessage);
    });

    // Expected result: user should not be able to find the IRs in the Revision Request tab
    await test.step("Validate that the IRs have been removed from the Revision Request tab", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);

      for (let i = 0; i < declinedIRs.length; i++) {
        let isIrExist = await purchasingHelper.isIrExistInListPage(sharedData.page, declinedIRs[i]);
        expect(isIrExist).toBe(false);
      }
    });

    const browser = sharedData.page.context().browser();
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();

    for (let i = 0; i < declinedIRs.length; i++) {

      // Expected result: supplier user should be able to find the declined revision requests and validate the status as 'Rejected'
      await test.step("Navigate to the Revision Request in the Supplier Portal and validate the status of the declined revision requests", async () => {
        await supplierHelper.performLoginSupplier(newPage);
        await supplierHelper.navigateToRevisionRequestPagePart(newPage);
        await supplierHelper.searchForIrWithArticleNumber(newPage, declinedIRs[i]);

        var columnStatus = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
        var boxStatus = await columnStatus.locator("#root #label");
        var statusText = await boxStatus.innerText();
        expect(statusText).toBe("Rejected");

        // Save the agreed implementation date details
        var columnAgreedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.AgreedImplementationDate));
        var boxAgreedImplementationDate = await columnAgreedImplementationDate.locator("#root #label");
        agreedImplementationDate = await boxAgreedImplementationDate.innerText();

        // Save the requested implementation date details
        var columnRequestedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.ReqestedImplementationDate));
        requestedImplementationDate = await columnRequestedImplementationDate.innerText();
      });

      // Expected result: supplier user should be able to accept the declined revision requests and see a success message
      await test.step("Accept the declined revision requests and validate the success message", async () => {
        let columnLocator = locators.irColumnForFirstRow(newPage);
        var acceptButtonColumn = await columnLocator.nth(14);
        var acceptButton = await acceptButtonColumn.locator("button[type='button']");
        await acceptButton.hover();
        await acceptButton.click();

        await newPage.waitForTimeout(30 * 1000);
        const successMessage = await locators.releaseSuccessMessageRevisionRequestPageSupplier(newPage).innerText();
        expect(successMessage).toMatch(dynamicValues.releasedSuccessMessage);
      });

      // Expected result: supplier user should be able to confirm the Agreed Implementation Date in the Ongoing tab
      await test.step("Navigate to Ongoing tab and validate the Agreed Implementation Date", async () => {
        await supplierHelper.performLoginSupplier(newPage);
        await supplierHelper.navigateToOngoingPage(newPage);
        await supplierHelper.searchForIrWithArticleNumber(newPage, declinedIRs[i]);

        var columnAgreedImplementationDate = await locators.irColumnForFirstRow(newPage).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.AgreedImplementationDate));
        var agreedImplementationDateOngoing = await columnAgreedImplementationDate.innerText();

        if (agreedImplementationDate === "") {
          agreedImplementationDate = requestedImplementationDate;
        }

        expect(agreedImplementationDateOngoing).toBe(agreedImplementationDate);
      });
    }

    await newPage.close();
  });
});

// Requires: 4 IRs in Revision Request page in Purchasing portal
test.describe("Forward a revision request by providing comments from list or details page for single or multiple revision requests", () => {
  test.describe.configure({ retries: 0, timeout: 600000 });

  // Requires: 1 IR in Revision Request page in Purchasing portal
  test("Test Case #1: Forward a revision request from Details Page", async ({ playwright }) => {
    let forwardIR;

    // Expected result: purchasing user should be able to find a revision request and forward it with comments and IR number should be displayed
    await test.step("Open the details page and forward the revision request with a comment", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      // Save the IR details
      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      forwardIR = await boxIR.innerText();

      // var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ItemName));
      // await columnItemName.click();
      var columnPartName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.PartName));
      await columnPartName.click();

      await sharedData.page.waitForTimeout(3000); // Fixed delay that is needed for the next step to work

      await sharedHelper.ensureVisible(sharedData.page, locators.revisionRequestButtonPurchasingEnv(sharedData.page));
      await locators.revisionRequestButtonPurchasingEnv(sharedData.page).click();

      await locators.commentFieldRevReqDetailsPagePurchasing(sharedData.page).click();
      await locators.commentFieldRevReqDetailsPagePurchasing(sharedData.page).type("TEST: Revision request forwarded - Details Page");

      expect(forwardIR).not.toBeNull();
      expect(forwardIR).not.toBe("");

      await locators.forwardRevReqDetailsPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageRevisionRequestListPagePurchasing(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.forwardedSuccessMessage);
    });

    // Expected result: user should be able to confirm the new status of the IR in the Revision Request tab as 'Pending with IR creator'
    await test.step("Validate that the IR status is now 'Pending with IR creator'", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, forwardIR);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Pending with IR creator");
    });
  });

  // Requires: 1 IR in Revision Request page in Purchasing portal
  test("Test Case #2: Forward a revision request from List Page", async ({ playwright }) => {
    let forwardIR;

    // Expected result: purchasing user should be able to find a revision request and forward it with comments and IR number should be displayed
    await test.step("Select an IR from list page and forward the revision request with a comment", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      forwardIR = await boxIR.innerText();

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      await locators.forwardRevReqListPage(sharedData.page).click();
      await sharedHelper.ensureVisible(sharedData.page, locators.commentFieldRevReqListPagePurchasing(sharedData.page));
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).click();
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).type("TEST: Revision request forwarded - List Page");

      expect(forwardIR).not.toBeNull();
      expect(forwardIR).not.toBe("");

      await locators.popupForwardRevReqListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageRevisionRequestListPagePurchasing(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.forwardedSuccessMessage);
    });

    // Expected result: user should be able to confirm the new status of the IR in the Revision Request tab as 'Pending with IR creator'
    await test.step("Validate that the IR status is now 'Pending with IR creator'", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, forwardIR);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Pending with IR creator");
    });
  });

  // Requires: 2 IRs in Revision Request page in Purchasing portal
  test("Test Case #3: Forward multiple revision requests from List Page", async ({ playwright }) => {
    let forwardIRs = [];

    // Expected result: purchasing user should be able to find multiple revision requests and forward them with comments and the IR numbers should be displayed
    await test.step("Select multiple IRs from list page and forward the revision requests with a comment", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvPartNumber);

      let selectedCount = 0;
      let rowIndex = 0;

      while (selectedCount < 2) {
        var columnStatus = await locators.irColumn(sharedData.page, rowIndex).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.status));
        var boxStatus = await columnStatus.locator("#root #label");
        var statusText = await boxStatus.innerText();

        // Check if status is "Pending with Pur"
        if (statusText === "Pending with Pur") {
          var columnIR = await locators.irColumn(sharedData.page, rowIndex).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.ImplementationRequest));
          var boxIR = await columnIR.locator("#root #label");
          forwardIRs.push(await boxIR.innerText());

          // Select the checkbox for the row
          await sharedHelper.clickCheckboxForRow(sharedData.page, rowIndex);
          selectedCount++;
        }

        rowIndex++;
      }

      await locators.forwardRevReqListPage(sharedData.page).click();
      await sharedHelper.ensureVisible(sharedData.page, locators.commentFieldRevReqListPagePurchasing(sharedData.page));
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).click();
      await locators.commentFieldRevReqListPagePurchasing(sharedData.page).type("TEST: Revision request forwarded - List Page");

      expect(forwardIRs[0]).not.toBeNull();
      expect(forwardIRs[0]).not.toBe("");
      expect(forwardIRs[1]).not.toBeNull();
      expect(forwardIRs[1]).not.toBe("");

      await locators.popupForwardRevReqListPage(sharedData.page).click();
    });

    // Expected result: user should see a success message
    await test.step("Validate the success message", async () => {
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageRevisionRequestListPagePurchasing(sharedData.page).innerText();
      expect(successMessage).toMatch(dynamicValues.forwardedSuccessMessage);
    });

    // Expected result: user should be able to confirm the new status of the IRs in the Revision Request tab as 'Pending with IR creator'
    await test.step("Validate that the IR status is now 'Pending with IR creator'", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPagePart(sharedData.page);

      for (let i = 0; i < forwardIRs.length; i++) {
        await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, forwardIRs[i]);

        var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPagePurchasing.get(dynamicValues.status));
        var boxStatus = await columnStatus.locator("#root #label");
        var statusText = await boxStatus.innerText();
        expect(statusText).toBe("Pending with IR creator");
      }
    });
  });
});

// Requires: 1 IR in Windchill under "My Tasks" forwarded from Purchasing portal
test.describe("IOS user should be able to accept revision request", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });
  let irNumber;
  let agreedImplementationDate;

  test("Test Case #1: Login to Windchill, select & approve revision request task, then validate the status of the IR in the Supplier Portal", async ({ browser }) => {
    // Expected result: user should be able to login to Windchill and select the revision request task and the IR number should be displayed
    await test.step("Login to Windchill and navigate to the task", async () => {
      await windchillHelper.performLoginWithSteps(sharedData.page);
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.homepageButton(sharedData.page));
      await windchillLocators.homepageButton(sharedData.page).click();

      // Find and click the first "Review date change request" task
      const taskRow = windchillLocators.taskRowByName(sharedData.page, "Review date change request");
      await sharedHelper.ensureVisible(sharedData.page, taskRow);
      await taskRow.locator("td").nth(3).click();

      let irNumberTemp = await windchillLocators.irNumberMyTasks(sharedData.page);
      irNumber = await irNumberTemp.trim();
      expect(irNumber).not.toBeNull();
      expect(irNumber).not.toBe("");
    });

    // Expected result: user should be able to approve the revision request with another date and a comment
    await test.step("Approve the revision request", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = tomorrow.toISOString().split("T")[0];

      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.dateField(sharedData.page));
      await windchillLocators.dateField(sharedData.page).click();
      await windchillLocators.dateField(sharedData.page).fill(formattedTomorrow);

      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.taskCompletionComment(sharedData.page));
      await windchillLocators.taskCompletionComment(sharedData.page).click();
      await windchillLocators.taskCompletionComment(sharedData.page).type("TEST: Approved revision request");

      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.acceptRoutingOptionButton(sharedData.page));
      await windchillLocators.acceptRoutingOptionButton(sharedData.page).click();

      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.completeTaskButton(sharedData.page));
      expect(windchillLocators.completeTaskButton(sharedData.page)).toBeVisible();
      expect(windchillLocators.completeTaskButton(sharedData.page)).toBeEnabled();
      await windchillLocators.completeTaskButton(sharedData.page).click();

      await sharedData.page.waitForTimeout(120 * 1000);
    });

    // Expected result: supplier user should be able to login to the Supplier Portal and validate the status of the IR as 'Approved'
    await test.step("Login to the Supplier Portal and validate the status of the IR", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToRevisionRequestPagePart(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, irNumber);

      var columnStatus = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.status));
      var boxStatus = await columnStatus.locator("#root #label");
      var statusText = await boxStatus.innerText();
      expect(statusText).toBe("Approved");

      var columnAgreedImplementationDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesRevisionRequestPageSupplier.get(dynamicValues.AgreedImplementationDate));
      var boxAgreedImplementationDate = await columnAgreedImplementationDate.locator("#root #label");
      agreedImplementationDate = await boxAgreedImplementationDate.innerText();
    });

    // Expected result: supplier user should be able to accept the approved revision request and see a success message
    await test.step("Accept the approved revision request and validate the success message", async () => {
      let columnLocator = locators.irColumnForFirstRow(sharedData.page);
      var acceptButtonColumn = await columnLocator.nth(14);
      var acceptButton = await acceptButtonColumn.locator("button[type='button']");
      await acceptButton.hover();
      await acceptButton.click();

      await sharedData.page.waitForTimeout(30 * 1000);
      const message = await locators.releaseSuccessMessageRevisionRequestPageSupplier(sharedData.page).innerText();
      expect(message).toMatch(dynamicValues.releasedSuccessMessage);
    });

    // Expected result: supplier user should be able to confirm the Agreed Implementation Date in the Ongoing tab
    await test.step("Navigate to Ongoing tab and validate the Agreed Impl Date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, irNumber);

      var columnAgreedImplementationDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPageSupplier.get(dynamicValues.AgreedImplementationDate));
      var agreedImplementationDateOngoing = await columnAgreedImplementationDate.innerText();

      expect(agreedImplementationDateOngoing).toBe(agreedImplementationDate);
    });
  });
});
