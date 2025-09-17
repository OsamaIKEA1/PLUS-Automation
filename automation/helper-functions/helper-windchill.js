const credentialsJson = require("../credentials.json");
const { test, expect } = require("@playwright/test");
const dynamicValues = require("../dynamic-values.js");
import { locators } from "../locators/locators-windchill.js";
const links = require("../links.json");
import * as sharedHelper from "./shared-helpers.js";

export async function performLoginWithSteps(page) {
  // Navigate to the Purchasing login page
  await navigateToWindchillLoginPage(page);

  // Fill the login form if necessary
  //await fillLoginFormIfNeeded(page);
}

async function navigateToWindchillLoginPage(page) {
  const env = "windchillPPE10Enviroment";
  const { username, password } = credentialsJson[env];

  // Set basic authentication before navigation
  await page.context().setHTTPCredentials({
    username: username,
    password: password,
  });

  await page.goto(links.windchillPPE10EnviromentLink);
  await page.waitForLoadState("networkidle");
}

async function fillLoginFormIfNeeded(page) {
  // Check if the login form is visible (i.e., if the user is not logged in)
  const isLoginFormVisible = await page.isVisible("#username");

  if (isLoginFormVisible) {
    // Load credentials
    const env = "windchillPPE10Enviroment";
    const { username, password } = credentialsJson[env];

    // Fill and submit the login form
    await page.fill("#username", username);
    await page.fill("#password", password);
    await page.click("#signOnButtonSpan");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3 * 1000); // Wait for the page to process the login
  } else {
    console.log("User is already logged in. Skipping login step.");
  }
}

export async function searchForIrWithArticleNumber(page, articleNumber) {
  await locators.sideSearchButton(page).click();
  await locators.advancedSearchButton(page).click();
  //Wait for 30 seconds
  await page.waitForTimeout(2 * 1000);
  //await page.locator('#ext-gen130').locator("input[type='checkbox']").click();
  //await locators.allTypeCheckBox(page).hover();
  await locators.allTypeCheckBox(page).click();
  await page.waitForTimeout(0.2 * 1000);

  await locators.implementationRequestCheckBox(page).click();
  await page.waitForTimeout(0.2 * 1000);
  await locators.nameEqualBox(page).click();
  await page.waitForTimeout(0.2 * 1000);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(0.2 * 1000);

  // Press the Enter key
  await page.keyboard.press("Enter");
  await page.waitForTimeout(0.2 * 1000);

  await locators.nameField(page).fill("1");
  await page.waitForTimeout(0.2 * 1000);
  await locators.numberEqualBox(page).click();
  await page.waitForTimeout(0.2 * 1000);

  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(0.2 * 1000);

  // Press the Enter key
  await page.keyboard.press("Enter");
  await page.waitForTimeout(0.2 * 1000);
  await locators.numberField(page).fill("1");
  await page.waitForTimeout(0.2 * 1000);

  await locators.addAttributesButton(page).click();
  await page.waitForTimeout(2 * 1000);

  /* const row = await page.locator('.x-grid3-row').filter({
    has: page.locator('.x-grid3-col-qbAttrList_attrName', { hasText: 'Connected Item' })
  }).first();

  // Click the checkbox in the first column of the located row
  const d = await row.locator('.x-grid3-col-checker .x-grid3-row-checker');
  await d.click(); */

  const iframeElement = await page.frameLocator("#lbContentIframe");

  // Locate the row containing the "Connected Item" attribute inside the iframe
  const row = await iframeElement
    .locator(".x-grid3-row")
    .filter({
      has: iframeElement.locator(".x-grid3-col-qbAttrList_attrName", { hasText: "Connected Item" }),
    })
    .first();

  // Scroll to the row to ensure it is visible
  await row.scrollIntoViewIfNeeded();

  // Click the checkbox in the first column of the located row
  const checkbox = await row.locator(".x-grid3-col-checker .x-grid3-row-checker");
  await checkbox.click();

  await page.waitForTimeout(2 * 1000);

  const okButton = await iframeElement.locator("#PJL_wizard_ok button.x-btn-text").first();
  await okButton.click();

  await locators.connectedItemField(page).fill(articleNumber);
  await page.waitForTimeout(2 * 1000);
  await locators.searchButtonInAdvancedSearch(page).click();
  await page.waitForTimeout(3 * 1000);
}
