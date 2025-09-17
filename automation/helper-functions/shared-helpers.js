const credentialsJson = require("../credentials.json");
const { test, expect } = require("@playwright/test");
const dynamicValues = require("../dynamic-values.js");
import { locators } from "../locators/locators.js";
const links = require("../links.json");
import * as supplierHelper from "./helper-supplier.js";
import * as purchasingHelper from "./helper-purchasing.js";

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
 * @description This function retrieves the names of the columns in the IR table and saves them in a Map.
 * @param {*} page
 * @param {*} numberOfColumns
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableScp(page, numberOfColumns) {
  const columnsNames = new Map();
  var row = await page.locator("#header");
  var box;
  // Loop through the columns starting from index 3 (ignoring the first 3 cells) (checkbox, " ", "Name")
  for (let i = 2; i < numberOfColumns; i++) {
    var column = await row.locator("div.cell").nth(i);
    box = await column.locator("#label");
    var innerText = await box.innerText();

    // Store column name and index in the Map
    columnsNames.set(innerText, i - 1);
  }
  return columnsNames;
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
 * @description This function search for the number in the search bar provided in the page.
 * @param {*} page
 * @param {*} searchBarLocator search bar locator for in Scp environment
 * @param {*} articleNumber
 */
export async function searchForIrWithArticleNumber(page, searchBarLocator, articleNumber) {
  await searchBarLocator.focus();
  await searchBarLocator.fill(articleNumber); // Fill the search term
  await searchBarLocator.press("Enter"); // Press Enter to search
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  await page.waitForTimeout(3000); // Wait for 3 seconds to ensure results are loaded
}

/**
 * @description This function checks if number of IRs in table more than 0 or not.
 * @param {*} page
 * @returns true if IR exists, false if not
 */
export async function isIrExist(page) {
  let numberOfFoundIR = await locators.irRows(page).count();
  if (numberOfFoundIR > 0) {
    return true; // IR exists
  } else {
    return false; // IR does not exist
  }
}

/**
 * @description Function to get the number of items in the table from the number of items label in the purchasing
 * @param {*} page
 * @returns {number} number of items in the table
 */
export async function getNumberOfItems(page) {
  try {
    // Try "Items" first
    //await ensureVisible(page, locators.numberOfItemsLabel(page));
    var itemsText = await locators.numberOfItemsLabel(page).innerText();
    return parseInt(itemsText.match(/^\d+/)[0], 10);
  } catch (error) {
    try {
    } catch (secondError) {
      throw new Error('Could not find either "Items" or "Item" label on the page');
    }
  }
}

/**
 * @description this function compares two arrays of objects and checks if they are equal, regardless of the order of the objects in the arrays.
 * @param {} arr1
 * @param {*} arr2
 * @returns {boolean} true if arrays are equal, false if not
 */
export async function areArraysEqualUnordered(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = arr1.map(JSON.stringify).sort();
  const sortedArr2 = arr2.map(JSON.stringify).sort();
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
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

/**
 * @description This function select the first checkbox in the first row of the IR table.
 * @param {*} page
 * @param {*} locator
 * @returns
 */
export async function selectCheckboxForFirstRow(page) {
  const columnLocator = await locators.irColumnForFirstRow(page);
  const checkboxColumn = await columnLocator.nth(0); // the first child is the checkbox
  await checkboxColumn.locator("#cntr").first().click();
}

/**
 * @description This function selects the checkbox for a specific row in the IR table.
 * @param {*} page
 * @param {*} rowIndex - The index of the row to select the checkbox for (0-based index).
 * @returns
 */
export async function clickCheckboxForRow(page, rowIndex) {
  const columnLocator = await locators.irColumn(page, rowIndex);
  const checkboxColumn = await columnLocator.nth(0); // The first child is the checkbox
  await checkboxColumn.locator("#cntr").first().click();
}
