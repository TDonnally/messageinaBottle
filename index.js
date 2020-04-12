const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv/config');
const app = express();
const fs = require('fs');

const port = process.env.PORT || 3000;

app.use(express.urlencoded());
app.use(express.static('public'));
app.use(express.json());


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//Routes
app.get('/', (req, res) => {
  fs.readFile('./views/home.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
});

app.post('/', (req, res) => {
  MongoClient.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    const dbo = db.db("heroku_d235p11f");
    const messageTable = dbo.collection("messages");
    let myobj = 
    [{ 
      name: req.body.sender,
      message: req.body.message
    }];
    console.log(myobj)
    messageTable.insertMany(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        messageTable.aggregate(
          [{ $sample: { size: 1 } }]
        ).toArray((err, data) => {
          err
            ? reject(err)
            : resolve(data[0]);
        });
      });
    }
    //Step 2: async promise handler
    var callMyPromise = async () => {
      var result = await (myPromise());
      //anything here is executed after result is resolved
      return result;
    };

    //Step 3: make the call
    callMyPromise().then(function (result) {
      db.close();
      res.json(result)
      });
      
    });
    
  });  //end mongo client
  