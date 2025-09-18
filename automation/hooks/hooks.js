const { test, expect } = require("@playwright/test");
const playwright = require("playwright");
const FetchData = require("../database/dbManager.js");
const credentialsJson = require("../credentials.json");

let sharedData = {}; // Shared object for variables {page, dataArray, csrfToken, apiRequestContext, context}

/**
 * @description Function to set up page and browser context
 * This function creates a new browser context with a specific viewport size and a new page.
 */
async function setupPage() {
  const context = await sharedData.browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();
  sharedData.page = page;
  sharedData.context = context;
}

/**
 * @description Function to set up data for tests
 * This function fetches data from the database and sets up API request context with CSRF token.
 * It also converts maps to arrays for easier access in tests.
 */
async function setupData() {
  // Fetch all data in one go
  const Data = new FetchData();
  const allData = await Data.fetchAllData();

  // Convert maps to arrays
  sharedData.productStructuresDataArrayPurchasingEnv = Array.from(allData.purchasing.productStructures.entries());
  sharedData.productStructuresDataArraySupplierEnv = Array.from(allData.supplier.productStructures.entries());
  sharedData.irDetailsDataArrayPurchasingEnv = Array.from(allData.purchasing.irDetails.entries());
  sharedData.irDetailsDataArraySupplierEnv = Array.from(allData.supplier.irDetails.entries());

  // Load credentials and encode in Base64
  const env = "api";
  const { username, password } = credentialsJson[env];
  const credentials = Buffer.from(`${username}:${password}`).toString("base64");

  // Create API request context
  const apiRequestContext = await playwright.request.newContext({
    ignoreHTTPSErrors: true,
    baseURL: "https://testppe10.plus.ikeadt.com",
    extraHTTPHeaders: {
      Authorization: `Basic ${credentials}`,
    },
  });

  // Fetch CSRF token
  const csrfResponse = await apiRequestContext.get("/PLUS/servlet/rest/security/csrf");
  await expect(csrfResponse.status()).toBe(200);
  const csrfData = await csrfResponse.json();
  sharedData.csrfToken = csrfData.items[0].attributes.nonce;

  sharedData.apiRequestContext = apiRequestContext;
}

exports.setupHooksWithDatabase = () => {
  test.beforeAll(async ({ browser }) => {
    sharedData.browser = browser;
    await setupPage();
    await setupData();
  });

  test.afterAll(async () => {
    await sharedData.page.close();
  });
};
exports.setupHooks = () => {
  test.beforeAll(async ({ browser }) => {
    sharedData.browser = browser;
    await setupPage();
  });

  test.afterAll(async () => {
    await sharedData.page.close();
  });
};
exports.sharedData = sharedData;
