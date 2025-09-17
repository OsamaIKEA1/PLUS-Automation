# SCP Automation Testing Project
## Overview
This project contains automated tests for the SCP application using Playwright. The tests cover various implementation request (IR) flows across different user roles including Purchasing users, Supplier users, and Windchill users. The test suite validates data consistency, user interface interactions, and end-to-end business processes.

## Prerequisites
* Node.js. (To install, visit: nodejs.org). 
    * To verify if Node.js is installed, run ```node -v``` and ```npm -v``` in the terminal.
* Npm
* Git
* Playwright
* Access credentials for:
    * SCP Purchasing environment
    * SCP Supplier environment
    * Windchill environment
    * API access

## Setting Up a Project
* Clone the repository
```git clone https://github.com/Inter-IKEA-Digital/PLUS-ThingWorx.git ```

* Install dependencies
```
npm install
npm install playwright
npx playwright install
npm install oracledb
npm i --save-dev @playwright/test
``` 
* Install the "Playwright Test for VSCode" extension by Microsoft from the VS Code Extensions Marketplace.
* install "Oracle Developer Tools for VS Code" by "Oracle Corporation".

* Set up the credentials file
    * Fill in the required credentials for each environment in ```credentials.json```





## To configure the oracale DB in the SQL Developer tool:

Connection Type: Basic

Database host name: PPCRS581.ikeadt.com

Port number: 1521

Service name: PLUSPPE.IKEADT.COM

Connection string: PPCRS581.ikeadt.com:1521/PLUSPPE.IKEADT.COM

Role: Defult

User name: PLUS_READONLY

Password: PLUS_READONLY123

Connection name: PPE10 (Personal choice)

To configure the oracle DB in JS: 

      connection = await oracledb.getConnection({
        user: 'PLUS_READONLY',       
        password: 'PLUS_READONLY123',  
        connectString: `(DESCRIPTION=
                          (ADDRESS=(PROTOCOL=TCP)(HOST=PPCRS581.ikeadt.com)(PORT=1521))
                          (CONNECT_DATA=(SERVICE_NAME=PLUSPPE.IKEADT.COM))
                        )`
      });


## To get product details from Windchill using API and DB: 

### Needed attributes from DB: 
* BASEPRODUCTOID
* PACKAGINGPARTOID
* REQUESTEDIMPLEMENTATIONDATE (Req.Impl.Date)
* EFFCONTEXTOID

### Needed SQL query 
SELECT  IRNUMBER, REQUESTEDIMPLEMENTATIONDATE, BASEPRODUCTOID,PACKAGINGPARTOID, EFFCONTEXTOID 
FROM PDMLINK.SUPPLIER_TASK_DETAILS_CACHE 
WHERE 
TASKOWNER='plustest41' and TASKNAME='Send Request for Implementation' and TASKVIEW='ITEM' and TASKSTATUS='OPEN' and ISUNDERGOINGCHANGES='0'
 

### 1- Using Api 
GET = (https://testppe10.plus.ikeadt.com/PLUS/servlet/rest/security/csrf) 

we get the CSRF => Exemple: 

"nonce": "kfZbjoFn/FUph2RU+8IP1PMisWxNw1Qko4MX27gShmxc7lYtoL8ZueYlrx9I7yYB/r0U+rNUvWgTtlNnoc9jtrRXzWUQv14k/M4Q6PAplmNOzy8Q54JvuLgvhgZ+/VMB6cYC164zxDwb8VcGppASuaoEwQ=="

### 2- Using Api 
POST =  (https://testppe10.plus.ikeadt.com/PLUS/servlet/odata/v5/ProdMgmt/Parts('OR:wt.part.WTPart:XXXXXXXXXX')/PTC.ProdMgmt.GetPartStructure?$expand=Part,PartUse,Alternates($expand=Alternate),Substitutes($expand=Substitute),Components($expand=Part($select=TypeIcon,ID,Name,Number,ObjectType,Version),Alternates($expand=Alternate($select=TypeIcon,ObjectType,Name,Number)),Substitutes($expand=Substitute($select=TypeIcon,ObjectType,Name,Number)),PartUse;$levels=2;$select=PVTreeId,PVParentTreeId))

,where we replace **('OR:wt.part.WTPart:XXXXXXXXXX')** with either **"BASEPRODUCTOID"** or **"PACKAGINGPARTOID"** from the DB.

We also modify the **(yyyy-mm-dd)** in **"EffectiveDate": "yyyy-mm-ddT00:00:00Z"** based on the **"REQUESTEDIMPLEMENTATIONDATE"** of the IR from the DB, we also modify the **"EffectiveContext": "OR:wt.part.WTPartMaster:XXXXXXXXXX"** based on **EFFCONTEXTOID** of the IR from the DB.

### 3- Get the structure from the response
#### Exemple of a response from the API where the Base product structure is
```
* (STOCKHOLM 2025 pouffe Alhamn beige GB) 

↓

* Bassinet 33x22

↓

* Tube ØD Ød

* Bed Base x

* Brace
```
: 
```
{
    "@odata.context": "https://testppe10.plus.ikeadt.com/PLUS/servlet/odata/v5/ProdMgmt/$metadata#PTC.ProdMgmt.PartStructureItem",
    "PartId": "OR:wt.part.WTPart:3067733798",
    "HasChildren": true,
    "PartUseId": null,
    "PartName": "Bassinet 33x22",
    "PartNumber": "10134981",
    "PathId": null,
    "Resolved": true,
    "HasUnresolvedObjectsByAccessRights": false,
    "PVTreeId": "/",
    "PVParentTreeId": null,
    "@PTC.AppliedContainerContext.LocalTimeZone": "Europe/Brussels",
    "Part": {
        "@odata.type": "#PTC.ProdMgmt.IkeaPart",
        "CreatedOn": "2024-08-19T14:15:09+02:00",
        "ID": "OR:wt.part.WTPart:3067733798",
        "LastModified": "2024-08-19T14:16:48+02:00",
        "AlternateNumber": null,
        "ApprovedBy": "Plus Test productcreator One (plustest14)",
        "ApprovedDate": "2024-08-19T14:16:48+02:00",
        "AssemblyMode": {
            "Value": "separable",
            "Display": "Separable"
        },
        "BOMType": null,
        "CabinetName@PTC.AccessException": "(Secured information)",
        "CabinetName": null,
        "ChangeStatus": null,
        "CheckOutStatus": "",
        "CheckoutState": "Checked in",
        "Comments": null,
        "ConfigurableModule": {
            "Value": "standard",
            "Display": "No"
        },
        "CreatedBy": "Plus Test productcreator One",
        "DefaultTraceCode": {
            "Value": "0",
            "Display": "Untraced"
        },
        "DefaultUnit": {
            "Value": "ea",
            "Display": "each"
        },
        "Description": null,
        "EndItem": false,
        "FolderLocation@PTC.AccessException": "(Secured information)",
        "FolderLocation": null,
        "FolderName@PTC.AccessException": "(Secured information)",
        "FolderName": null,
        "GDMatCoatAlias": null,
        "GatheringPart": false,
        "GeneralStatus": null,
        "Identity": "IKEA Part - 10134981, Bassinet 33x22, 2.1 (Design)",
        "InactivatedBy": null,
        "Inactivationdate": null,
        "Latest": true,
        "LifeCycleTemplateName": "IKEA Parts and Software Lifecycle Template",
        "ModifiedBy": "Plus Test productcreator One",
        "Name": "Bassinet 33x22",
        "Number": "10134981",
        "ObjectType": "IKEA Part",
        "OrganizationReference": null,
        "PhantomManufacturingPart": false,
        "PreAssembled": null,
        "ReplacedBy": null,
        "Replaces": null,
        "Revision": "2",
        "RevisionComment": "ok",
        "ShareStatus": {
            "Path": "https://testppe10.plus.ikeadt.com/PLUS/com/ptc/core/htmlcomp/images/shared_toproject9x9.gif",
            "Tooltip": "Shared to a Project"
        },
        "Source": {
            "Value": "make",
            "Display": "Make"
        },
        "State": {
            "Value": "APPROVED",
            "Display": "Approved"
        },
        "Supersedes": null,
        "TypeIcon": {
            "Path": "https://testppe10.plus.ikeadt.com/PLUS/netmarkets/images/nonlatest/IKEAPART.gif",
            "Tooltip": "IKEA Part"
        },
        "Version": "2.1 (Design)",
        "VersionID": "VR:wt.part.WTPart:3067733755",
        "View": "Design",
        "WorkInProgressState": {
            "Value": "c/i",
            "Display": "Checked in"
        },
        "AssignedChoices": "",
        "AwaitingPromotion": "false",
        "CheckedoutPDMVersion": "2.1 (Design)",
        "CoatingColourInformation": "",
        "Coatingandcolourpaths": null,
        "Component": null,
        "ConsistofProductDescription": null,
        "ItemType": null,
        "MaterialInformation": "",
        "OldCADReference": null,
        "PartClassification": "Part Classification/Product and Part specific/Beds/Beds complete/Bassinet",
        "ProjectShareStatus": "iop_n/a",
        "SparePart": "false"
    },
    "PartUse": null,
    "Components": [
        {
            "PVTreeId": "/0:3067733798-3128315274-1bf956e6-92e5-453e-951c-55c91813736a",
            "PVParentTreeId": "/",
            "Part": {
                "@odata.type": "#PTC.ProdMgmt.IkeaPart",
                "ID": "OR:wt.part.WTPart:3130415211",
                "Name": "Tube   ØD  Ød",
                "Number": "10135021",
                "ObjectType": "IKEA Part",
                "TypeIcon": {
                    "Path": "https://testppe10.plus.ikeadt.com/PLUS/wtcore/images/part.gif",
                    "Tooltip": "IKEA Part"
                },
                "Version": "1.1 (Design)"
            },
            "PartUse": {
                "CreatedOn": "2024-08-19T14:15:16+02:00",
                "ID": "OR:wt.part.WTPartUsageLink:3172115201",
                "LastModified": "2024-08-19T14:15:16+02:00",
                "FindNumber": null,
                "LineNumber": null,
                "ObjectType": "Part Usage",
                "PartOccurrenceAssignedExpression": "",
                "Quantity": 1.0,
                "ReferenceDesignatorRange": null,
                "TraceCode": {
                    "Value": "0",
                    "Display": "Untraced"
                },
                "Unit": {
                    "Value": "ea",
                    "Display": "each"
                }
            },
            "Alternates": [],
            "Substitutes": []
        },
        {
            "PVTreeId": "/0:3067733798-3167915212-86f4af4b-831e-4e06-9030-f96a834451c2",
            "PVParentTreeId": "/",
            "Part": {
                "@odata.type": "#PTC.ProdMgmt.IkeaPart",
                "ID": "OR:wt.part.WTPart:3167915249",
                "Name": "Bed Base  x",
                "Number": "10135053",
                "ObjectType": "IKEA Part",
                "TypeIcon": {
                    "Path": "https://testppe10.plus.ikeadt.com/PLUS/netmarkets/images/nonlatest/IKEAPART.gif",
                    "Tooltip": "IKEA Part"
                },
                "Version": "1.1 (Design)"
            },
            "PartUse": {
                "CreatedOn": "2024-08-19T14:15:58+02:00",
                "ID": "OR:wt.part.WTPartUsageLink:3172115231",
                "LastModified": "2024-08-19T14:15:58+02:00",
                "FindNumber": null,
                "LineNumber": null,
                "ObjectType": "Part Usage",
                "PartOccurrenceAssignedExpression": "",
                "Quantity": 1.0,
                "ReferenceDesignatorRange": null,
                "TraceCode": {
                    "Value": "0",
                    "Display": "Untraced"
                },
                "Unit": {
                    "Value": "ea",
                    "Display": "each"
                }
            },
            "Alternates": [],
            "Substitutes": []
        },
        {
            "PVTreeId": "/0:3067733798-3128315220-20f3ffae-5929-4cb9-8856-5b36e0ea9dca",
            "PVParentTreeId": "/",
            "Part": {
                "@odata.type": "#PTC.ProdMgmt.IkeaPart",
                "ID": "OR:wt.part.WTPart:3128315253",
                "Name": "Brace",
                "Number": "10135001",
                "ObjectType": "IKEA Part",
                "TypeIcon": {
                    "Path": "https://testppe10.plus.ikeadt.com/PLUS/wtcore/images/part.gif",
                    "Tooltip": "IKEA Part"
                },
                "Version": "1.1 (Design)"
            },
            "PartUse": {
                "CreatedOn": "2024-08-19T14:15:16+02:00",
                "ID": "OR:wt.part.WTPartUsageLink:3067733800",
                "LastModified": "2024-08-19T14:15:16+02:00",
                "FindNumber": null,
                "LineNumber": null,
                "ObjectType": "Part Usage",
                "PartOccurrenceAssignedExpression": "",
                "Quantity": 1.0,
                "ReferenceDesignatorRange": null,
                "TraceCode": {
                    "Value": "0",
                    "Display": "Untraced"
                },
                "Unit": {
                    "Value": "ea",
                    "Display": "each"
                }
            },
            "Alternates": [],
            "Substitutes": []
        }
    ],
    "Alternates": [],
    "Substitutes": []
}
```

Where in the response we can find the structure in **"Part" -> "Name": "Bassinet 33x22"** and **"Components" -> ("Part" -> "Name": "Tube   ØD  Ød"),("Part" -> "Name": "Bed Base  x"), ("Part" -> "Name": "Brace")**


***Same applies for packaging solution structure.***

## Project Structure

```
plus-automation-testing/
├── database/
│   └── dbManager.js           # Database interaction for test data
├── helper-functions-and-steps/
│   ├── helper-purchasing.js   # Helper functions for purchasing user tests
│   ├── helper-supplier.js     # Helper functions for supplier user tests
│   ├── helper-windchill.js    # Helper functions for windchill user tests
│   └── shared-helpers.js      # Common helper functions
├── hooks/
│   └── hooks.js               # Test hooks for setup and teardown
├── locators/
│   ├── locators.js            # UI element locators for SCP
│   └── locators-windchill.js  # UI element locators for Windchill
├── tests/
│   ├── ir-cancellation.spec.js      # IR cancellation tests
│   ├── ir-flow-purchasing.spec.js   # IR flow tests for purchasing users
│   ├── ir-flow-supplier.spec.js     # IR flow tests for supplier users
│   └── ir-revision-request.spec.js  # IR revision request tests
├── dynamic-values.js               # Constants and configurable values
├── credentials.json               # Credentials for environments 
├── links.json                     # Environment URLs
├── package.json                   # Project dependencies
└── playwright.config.js           # Project config file
```

## Test Suites
The project includes several test suites:

* IR Validation Tests - Validate that IR details are displayed correctly for both Supplier and Purchasing users, including:

    * Base Product Structure (BPS)
    * Packaging Solution (PS)
    * Connected objects
    * Classification attributes

* IR Flow Tests - Validate the complete lifecycle of Implementation Requests:

    * Accepting IR in Supplier portal
    * Releasing IR in Purchasing portal
    * Implementing IR 
    * Timeline views (All, 4 Weeks left, Overdue)

* IR Revision Request Tests - Validate the revision request workflow:

    * Raising revision requests
    * Forwarding/declining revision requests
    * Status updates across systems

* IR Cancellation Tests - Validate the cancellation process:

    * Cancellation of IR at different states
    * Approval of cancellation requests

## Running Tests
* View available commands:
```npx playwright --help```
* Run tests:
```npx playwright test``` (runs tests in headless mode)
    * To run tests in parallel, use: ```npx playwright test --workers 3```
    * Running Tests with UI, use: ```npx playwright test --headed```
    * To run a specific test file:
```npx playwright test ./tests/exampleTest.spec.js```
    * To run a test by title:
```npx playwright test -g "Test Title"```
    * Start debugging:
```npx playwright test --debug```

(alternatively, use Playwright test explorer extension).

## Configuration
* Tests can be configured through the dynamic-values.js file which contains constants and parameters used across the test suites:
    * Test article number that is related to the test samples of IRs
    * UI element labels and names
    * Columns names mapping in tables
    * Success message text patterns

## Data Management
The project uses two approaches for test data:
* Database Integration - ```dbManager.js``` fetches real data from Oracle database for thorough validation
* Test Environment Constants - ```dynamic-values.js``` contains test article number and other UI content constants

## Hooks
The project uses custom hooks defined in ```hooks.js``` to:
* Set up browser contexts before tests
* Fetch test data from the database
* Establish authenticated API sessions
* Retrieve CSRF tokens for secure API calls
* Clean up resources after tests

## Troubleshooting
Common issues:
* Authentication Failures - Check ```credentials.json``` is properly set up
* Timeouts - Increase timeout values in ```test.describe.configure```
* Element Not Found - Check ```locators.js``` for updated selectors and check the ```dynamic-values.js```
* Database Connection Issues - Verify database connection parameters

## Maintenance (IMPORTANT)
* Update locators when UI changes
* Keep test data in dynamic-values.js updated
* Review and update test scenarios as business requirements evolve

