var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.post('/confirmation', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
 // res.send('Thank you for signing up, ' + name + '! A confirmation email has been sent to ' + email + '.');
  return res.redirect('/confirmation.html');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
//Test comment added to check if the file is being tracked by git