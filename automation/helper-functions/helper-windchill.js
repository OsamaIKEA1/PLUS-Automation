const credentialsJson = require("../credentials.json");
const { test, expect } = require("@playwright/test");
const dynamicValues = require("../dynamic-values.js");
import { locators } from "../locators/locators-windchill.js";
const links = require("../links.json");

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

//NEW 
  async function navigateToIkeaProductsFolder() {
    await locators.browseButtonHomePage(this.page).click();
    await locators.recentProductsTab(this.page).click();
    await locators.browseListings(this.page, "BEDS").nth(1).click();
    await locators
      .subBrowseListings(this.page, "Folders")
      .nth(2)
      .click();
  }
//NEW
  async function navigateToTestAutomationFolder(){
    


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

/**
 * @description This function clones a locator by creating a new locator with the same selector.
 * @param {*} page
 * @param {*} locator to be cloned
 * @returns
 */
async function cloneLocator(page, locator) {
  const selector = locator._selector;
  return page.locator(selector);
}

/**
 * * @description This function waits for all elements to be loaded on the page.
 * @param {*} page
 * @returns
 * */
export async function basicWaitForAllLoaded(page) {
  await Promise.all([page.waitForLoadState("domcontentloaded"), page.waitForLoadState("networkidle"), page.waitForLoadState("load")]);
}

/**
 * @description This function ensures that a locator is visible on the page, retrying if necessary.
 * @param {*} page
 * @param {*} locator is the locator to be checked for visibility
 * @param {*} previousAction is a function that will be executed after the page is reloaded if needed
 * @param {*} maxRetries is the maximum number of retries to check for visibility
 * @returns
 */
export async function ensureVisible(page, locator, previousAction, maxRetries = 60) {
  await basicWaitForAllLoaded(page);
  let attempt = 0;
  while (attempt < maxRetries) {
    const newLocator = await cloneLocator(page, locator);
    try {
      /*if (attempt === 30 || attempt === 45) {
        await page.reload();
        await basicWaitForAllLoaded(page);
        if (previousAction) {
          await previousAction(); // Execute after reload
        }
      }*/
      await newLocator.waitFor({
        state: "visible",
        timeout: 1000,
      });
      return true;
    } catch (error) {
      attempt++;
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}

/**
 * @description This function wait until button of the page is visible and click it.
 * @param {*} page
 * @param {*} locator SCP page button locator
 */
export async function navigateToPage(page, locator) {
  await locator.waitFor({ state: "visible" });
  await locator.click();
  await page.waitForLoadState("networkidle");
}

/**
 * @description This function fetches the product structure from the API and normalizes the part names and IDs.
 * @param {*} productStructureUrl
 * @param {*} apiRequestContext
 * @param {*} csrfToken
 * @param {*} effectiveDate
 * @param {*} EFFCONTEXTOID
 * @returns {partsIDs, normalizedPartNamefromApi, normalizedcomponentsNameFromApi} - An object containing the part IDs, normalized part name from API, and normalized component names from API.
 */
export async function FetchProductStructureFromApi(productStructureUrl, apiRequestContext, csrfToken, effectiveDate, EFFCONTEXTOID) {
  var normalizedcomponentsNameFromApi = [];

  const structureResponse = await apiRequestContext.post(productStructureUrl, {
    headers: {
      CSRF_NONCE: csrfToken,
      //'Content-Type': 'application/json',
    },
    data: {
      NavigationCriteria: {
        ApplyToTopLevelObject: true,
        UseDefaultForUnresolved: false,
        SharedToAll: false,
        HideUnresolvedDependents: false,
        Centricity: false,
        ApplicableType: "wt.part.WTPart",
        ConfigSpecs: [
          {
            "@odata.type": "#PTC.NavCriteria.WTPartEffectivityDateConfigSpec",
            EffectiveDate: effectiveDate,
            EffectiveContext: `${EFFCONTEXTOID}`,
            View: "Design",
            Variation1: null,
            Variation2: null,
          },
        ],
        Filters: [],
      },
    },
  });

  expect(structureResponse.ok()).toBeTruthy();
  var structureData = await structureResponse.json();

var partsIDs = [];

// Add top-level part
if (structureData.Part && structureData.Part.ID && structureData.Part.ObjectType) {
  partsIDs.push([structureData.Part.ID, structureData.Part.ObjectType]);
}

// Add components
structureData.Components.forEach((component) => {
  if (component.Part != null && component.Part.ID && component.Part.ObjectType) {
    partsIDs.push([component.Part.ID, component.Part.ObjectType]);
  }
});

await partsIDs.reverse();

  var normalizedPartNamefromApi = structureData.Part.Name.replace(/\s+/g, " ").trim(); // normlized part name

  var componentsNamesFromApi = structureData.Components.filter((component) => component.Part && component.Part.Name) // Exclude components with null Part.Name
    .map((component) => component.Part.Name);

  componentsNamesFromApi.forEach((componentName) => {
    // Normalize component name and partsArray values by trimming and reducing multiple spaces
    normalizedcomponentsNameFromApi.push(componentName.replace(/\s+/g, " ").trim());
  });

  return {
    partsIDs: partsIDs,
    normalizedPartNamefromApi: normalizedPartNamefromApi,
    normalizedcomponentsNameFromApi: normalizedcomponentsNameFromApi,
  };
}