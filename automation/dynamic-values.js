//dynamic names of elements in SCP Web application
module.exports = {
  testEnvArticleNumber:"20638725", // "20638725", // Test article number for test IRs to use in the test cases
  testEnvPartNumber: "10171986", // Test part number for test IRs to use in the test cases
  testEnvObjectNumber: "2403969", // Test object number for test IRs to use in the test cases

  // Buttons (functionalityButtonNameEnvironment)
  irButtonName: "IR", // IR button name in the "Select type" options
  relatedObjectButtonName: "Related Object", // Related Object button name in the "Select IR type" options
  partButtonName: "Part", // Part button name in the "Select IR type" options
  itemButtonName: "Item", // Item button name in the "Select IR type" options
  releaseButtonName: "Release", // Release Button
  acceptCancellationButtonNameSupplier: "Accept Cancellation ", // Cancellation request Button
  newIrPageButtonName: "New IR", // New IR button
  ongoingPageButtonName: "Ongoing", // Ongoing button
  revisionRequestPageButtonName: "Revision request", // Revision request Button
  implementedPageButtonName: "Implemented", // Implemented page button
  cancellationRequestPageButtonName: "Cancellation request", // Cancellation request page button

  // Labels (functionalityLabelNameEnvironment)
  baseProductStructureLabelName: "Base Product Structure", // Base Product Structure lable name
  packagingSolutionLabelName: "Packaging Solution", // Packaging Solution lable name
  searchBarTextLabelPurchasing: "Search with Impl.request, supplier ID, Object name or object number", // The text inside the search bar
  searchBarTextLabelSupplier: "Search with Impl.request, supplier ID, Part name or part number", // The text inside the search bar
  scpLogoTitle: "SCP", // The title of the SCP logo

  // Messages (typeofmessageMessagePagenameEnvironment)
  releaseOneSuccessMessageListPage: "Implementation request released successfully for 1 objects", // sucess message when releasing one object in the list page from new IR page purchasing
  releaseOneSuccessMessageDetailsPage: "Implementation request successfully released to supplier for 1 object", // sucess message when releasing one object in the details page from new IR page purchasing
  acceptOneSuccessMessage: "Implementation request accepted successfully for 1 object", // sucess message when accepting one object in the details page and list page from new IR page supplier
  acceptTwoSuccessMessage: "Implementation request accepted successfully for 2 objects", // sucess message when accepting two objects in list page from new IR page supplier
  //errorMessageLabelWhenProvidingAgrDatePriorRecDate: "Please enter the date between Received date and Req.Impl.date",
  errorMessage: "Error", // error message when the user tries to do a functionallity with an IR with and fails
  releasedSuccessMessage: "Released successfully",
  irAcceptedSuccessMessage: "Released successfully", // success message when accepting an IR in New IR page supplier
  implementedSuccessMessage: "Released successfully", // success message when implementing an IR in Ongoing page from details page and list page supplier
  cancellationAcceptedSuccessMessage: "Released successfully", // success message when accepting a cancellation request in Cancellation page supplier
  declinedSuccessMessage: "Declined successfully",
  forwardedSuccessMessage: "Forwarded successfully",

  // Numbers
  numberIrTableColumnsNewIRPage: 12, // number of the columns in the IR table for the new IR page
  numberIrTableColumnsOngoingPage: 12, // number of the columns in the IR table for the ongoing page
  numberIrTableColumnsImplementedPage: 12, // number of the columns in the IR table for the implemented page
  numberIrTableColumnsRevisionRequestPage: 12, // number of the columns in the IR table for theRevision Request page
  numberIrTableColumnsCancellationRequestPage: 10, // number of the columns in the IR table for theRevision Request page

  numberConnectedItemsDetailsColumns: 5,
  numberIrToTest: 3, // number of the IR to be tested regarding the test cases

  numberIrTableColumnsNewIRPagePart: 15, // number of the columns in the IR table for the new IR page in Part
  numberIrTableColumnsOngoingPagePart: 16, // number of the columns in the IR table for the ongoing page in Part
  numberIrTableColumnsImplementedPagePart: 15, // number of the columns in the IR table for the implemented page in Part
  numberIrTableColumnsRevisionRequestPagePart: 15, // number of the columns in the IR table for theRevision Request page in Part
  numberIrTableColumnsCancellationRequestPagePart: 13, // number of the columns in the IR table for theRevision Request page in Part

  numberIrTableColumnsNewIrPagePartPurchasing : 14, // number of the columns in the IR table for the new IR page in Part in Purchasing
  numberIrTableColumnsOngoingPagePartPurchasing: 15, // number of the columns in the IR table for the ongoing page in Part
  numberIrTableColumnsImplementedPagePartPurchasing: 15, // number of the columns in the IR table for the implemented page in Part
  numberIrTableColumnsRevisionRequestPagePartPurchasing: 16, // number of the columns in the IR table for theRevision Request page in Part in Purchasing
  numberIrTableColumnsCancellationRequestPagePartPurchasing: 12, // number of the columns in the IR table for theRevision Request page in Part in Purchasing
  
  // Name of the IR table columns in SCP Web application for Item/part/Related Object

  numberIrTableColumnsNewIRPageRelatedObject: 15, // number of the columns in the IR table for the new IR page in Part and Related Object
  numberIrTableColumnsOngoingPageRelatedObject: 16, // number of the columns in the IR table for the ongoing page in Part and Related Object
  numberIrTableColumnsImplementedPageRelatedObject: 15, // number of the columns in the IR table for the implemented page in Part and Related Object
  numberIrTableColumnsRevisionRequestPageRelatedObject: 15, // number of the columns in the IR table for theRevision Request page in Part and Related Object
  numberIrTableColumnsCancellationRequestPageRelatedObject: 13, // number of the columns in the IR table for theRevision Request page in Part and Related Object

  numberIrTableColumnsNewIrPageRelatedObjectPurchasing : 14, // number of the columns in the IR table for the new IR page in Part in Purchasing
  numberIrTableColumnsOngoingPageRelatedObjectPurchasing: 15, // number of the columns in the IR table for the ongoing page in Part
  numberIrTableColumnsImplementedPageRelatedObjectPurchasing: 15, // number of the columns in the IR table for the implemented page in Part
  numberIrTableColumnsRevisionRequestPageRelatedObjectPurchasing: 16, // number of the columns in the IR table for theRevision Request page in Part in Purchasing
  numberIrTableColumnsCancellationRequestPageRelatedObjectPurchasing: 12, // number of the columns in the IR table for theRevision Request page in Part in Purchasing

  // Name of the IR table columns in SCP Web application
  SupplierID: "Supplier ID",
  ImplementationRequest: "Impl. request",
  ItemName: "Item Name",
  ItemNumber: "Item Number",
  ArticleNumber: "Item Number",
  ItemType: "Type",
  ReceivedDate: "Received Date",
  ReqestedImplementationDate: "Req.Impl.Date",
  AgreedImplementationDate: "Agr. Impl. date",
  ActualImplementationDate: "Act. Impl. date",
  Exception: "Exception",
  MessageFromIkea: "Message from IKEA",
  status: "status",
  proposedDate: "Proposed Date",
  comments: "Comments",
  PartName: "Part name",
  PartNumber: "Part number",
  ObjectName: "Object name",
  ObjectNumber: "Object number",
  VersionNumber: "Version Number", 

  // number of the index of the columns in the IR table in windchill advanced search table
  numberInfoColumnInAdvancedSearchTableWindchill: 9, // number of the index of the info column in the IR table for the advanced search page in windchill
  numberStatusColumnAdvancedSearchTableWindchill: 12, // number of the index of the status column in the IR table for the advanced search page in windchill
};
