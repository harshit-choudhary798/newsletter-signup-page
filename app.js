const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
const https = require("https");

require('dotenv').config()



app.use(express.static("public"));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const firstN = req.body.first;
  const lastN = req.body.last;
  const emailN = req.body.email;

  const data = {
    members: [{
        email_address: emailN,
        status: "subscribed",
        merg_fields: {
          FNAME: firstN,
          LNAME: lastN,
        }
      }

    ]
  };

  const jsonData = JSON.stringify(data);
  var audienceID=process.env.audience_id;
  var apikey=process.env.API_KEY;

  const url = "https://us10.api.mailchimp.com/3.0/lists/"+audienceID;

  const option = {
    method: "POST",
    auth: "apikey :"+apikey,
  }

  const response = https.request(url, option, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  response.write(jsonData);
  response.end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running at port 3000");
});
