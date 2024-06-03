const DocumentIntelligenceClient = require("@azure-rest/ai-document-intelligence");
require('dotenv').config()

    // set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
    const endpoint = process.env.fastwayDI_ENDPOINT
    const key = process.env.fastwayDI_KEY

    // sample document
    invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"

    

async function main() {

    const client = DocumentIntelligenceClient(endpoint, {key: key},
     );

    const initialResponse = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-invoice")
    .post({
      contentType: "application/json",
      body: {
        // The Document Intelligence service will access the URL to the invoice image and extract data from it
        urlSource: invoiceUrl,
      },
    });


    const poller = await getLongRunningPoller(client, initialResponse);

    poller.onProgress((state) => console.log("Operation:", state.result, state.status));
    const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    const documents = analyzeResult?.documents;

    const result = documents && documents[0];
    if (result) {
      console.log(result.fields);
    } else {
      throw new Error("Expected at least one invoice in the result.");
    }

console.log(
    "Extracted invoice:",
    document.docType,
    `(confidence: ${document.confidence || "<undefined>"})`,
  );
  console.log("Fields:", document.fields);
}


main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});