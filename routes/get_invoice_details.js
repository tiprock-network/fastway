const express = require('express')
const router  = express.Router()
const dotenv = require('dotenv')
dotenv.config()
const multer = require('multer')
const fs = require('fs')
const DocumentIntelligenceClient = require('@azure-rest/ai-document-intelligence').default //fix1
const { getLongRunningPoller } = require('@azure-rest/ai-document-intelligence') //fix2
//to handle file uploads
const upload = multer({dest:'./uploads'})

router.post('/invoice', upload.single('invoice_form'),async (req,res) =>{
    const invoice_form = req.file
    const client = DocumentIntelligenceClient(process.env.fastwayDI_ENDPOINT,{key:process.env.fastwayDI_KEY},)
    try {
        if (invoice_form) {
            const filePath = invoice_form.path;
            //console.log(`Uploaded file path: ${filePath}`);
            
            const fileBuffer = fs.readFileSync(filePath);
            

            const initial_res = await client.path("/documentModels/prebuilt-invoice:analyze").post({
                contentType: "application/octet-stream",
                body: fileBuffer
            });

            const poller = await getLongRunningPoller(client, initial_res);
            const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

            const documents = analyzeResult?.documents;
            const document = documents && documents[0];

            if (!document) {
                res.status(400).json({ bad_request: "Expected at least one document in the result." });
                return;
            }

            res.status(200).json({
                document: document.docType,
                score: document.confidence || 'undefined',
                document_fields: document.fields
            });

            // Clean up the uploaded file
            fs.unlinkSync(filePath);
        } else {
            res.status(400).json({ bad_request: "No file uploaded." });
        }
    } catch (error) {
        console.error('Error processing the invoice:', error);
        res.status(500).json({ response_error: error.message });
    }
})

module.exports = router