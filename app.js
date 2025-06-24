var MongoClient = require("mongodb").MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var querystring = require('querystring');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const database = client.db("local");

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
      const customer = database.collection("customer");
      // create a document to insert
      const doc = {
        "name": {
          "firstName": name,
          "lastName": "Doe"
        },
        "emailAddress": email
      };
      const result = await customer.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } /*finally {
      await client.close();
    }*/ catch (err) {
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
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
//Test comment added to check if the file is being tracked by git