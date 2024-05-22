const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
const DocumentIntelligenceClient = require('@azure-rest/ai-document-intelligence').default //fixed1
const { getLongRunningPoller } = require('@azure-rest/ai-document-intelligence') //fixed2
const {MongoClient,ObjectId} = require('mongodb')
const connectToMongoDB = require('../functions/connectToMongoDB')
const databaseInfo = require('../credentials/db_metadata')
//mongobd client
const mongo_client = new MongoClient(databaseInfo.mongo_uri)
const items_collection = mongo_client.db(databaseInfo.db_name).collection(databaseInfo.items_collection)


//connect to mongodb
connectToMongoDB()
//to handle file uploads
const invoiceProcessor = async (req,res) =>{
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
                req.flash('error',"Expected at least one document in the result.")
                return;
            }else{
                let cusd_bal = parseFloat("5.04")
                let invoice_bal = parseFloat(document.fields.InvoiceTotal.valueCurrency.amount)
                let items_list = []
                //populate items list
                document.fields.Items.valueArray.forEach((item) => {
                    items_list.push({
                        itemName:item.valueObject.Description.content,
                        totalPrice:item.valueObject.Amount.content
                    })
                })
                req.flash('success',"Upload was successful.")
                let newInvoice = await items_collection.insertOne(
                    {
                        invoiceTotal:invoice_bal,
                        currency:"USD",
                        invoiceOwnerEmail:req.user.userEmail,
                        customerName:document.fields.CustomerName ? document.fields.CustomerName.content : 'N/A',
                        vendorName:document.fields.VendorName ? document.fields.VendorName.content : 'N/A',
                        addresses:[
                            {
                                customer_address:document.fields.BillingAddress ? document.fields.BillingAddress.content : ''
                            },
                            {
                                vendor_address:document.fields.VendorAddress ? document.fields.VendorAddress.content : ''
                            }
                        ],
                        items:items_list
                    }
                )
                
                res.render('invoice',{invoiceId:newInvoice.insertedId})
                
                // Clean up the uploaded file
                fs.unlinkSync(filePath);
            }

           
        } else {
            req.flash('error',"No file was uploaded.")
            return;
        }
    } catch (error) {
        req.flash('error',"An unknown error occurred.")
        return;
    }
}

module.exports = invoiceProcessor