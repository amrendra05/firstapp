var MongoClient = require("mongodb").MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var querystring = require('querystring');
var app = express();

const {Datastore} = require('@google-cloud/datastore');
const { timeStamp } = require("console");
var gcpkeyFile="/usr/src/app/first-gcp-app-468115-833bb108540b.json";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
/*
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const database = client.db("local");
*/
const datastore = new Datastore({
  projectId: 'first-gcp-app-468115', // replace with your Google Cloud project ID
  keyFilename: gcpkeyFile, // replace with the path to your service account key file
  databaseId: 'first-gcp-db'
});
app.get('/', function (req, res) {
  res.send('Hello World!');
  return res.redirect('/index.html');
});

app.post('/confirmation', function (req, res) {
  // get name and email from the request body

  var name = req.body.name;
  var email = req.body.email;

  // connect to MongoDB and insert the document

  async function run() {
    try {
  //  const entity = datastore.entity('Customer'); // Create a new entity for the Customer kind
      const timeStamp = Date.now(); // Use current timestamp as a unique identifier
      // create a document to insert
      const newDoc = {
        "name": {
          "firstName": name,
          "lastName": "",
          "Source": "Docker",
          "Target": "GCP Datastore"
        },
        "emailAddress": email
      };
      const dockey = datastore.key(['customer', timeStamp.toString().substring(4,16)]); // Use timestamp as the key
      const entity = {
        key: dockey,
        data: newDoc
      };

      const result = await datastore.upsert(entity);
      console.log(`A document was inserted with the _id: ${result[0].upsertedId}`); // the inserted document ID
      console.log(`A document was inserted with the key: ${newDoc}`); // the inserted document key

    }  /*inally {
      await client.close();
    } */catch (err) {
      console.error('Error inserting document:', err);
    }
  }

  run().catch(console.dir);
  //res.send('Thank you for signing up, ' + name + '! A confirmation email has been sent to ' + email + '.');

  // redirect to confirmation page after inserting the document
  const query = querystring.encode({
    "name": name,
    "email": email
  });
  return res.redirect('/confirmation.html?' + query);
});
app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
//Test comment added to check if the file is being tracked by git
