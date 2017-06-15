const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    const app = express();
    const massive = require('massive');

app.use(bodyParser.json())
app.use(cors());

// You need to complete the information below to connect
// to the assessbox database on your postgres server.
massive({
  host: 'localhost',
  port: 5432,
  database: 'assessbox'
  // user: //user,
  // password: //password
})







const port = 3000;
app.listen(port, () => {
  console.log('Magic happens on port', port);
})
