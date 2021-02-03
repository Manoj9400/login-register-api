var mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var port = 3000;
var userController = require('./controllers/userController');
app.use('/api/u', userController);
const router = express.Router();

require('dotenv').config()

app.use(bodyParser.json());
//console.log(bodyParser)
app.use("/api", router);
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var uri = process.env.MONGOURI;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, });

const connection = mongoose.connection;

connection.once("open", function() {
  //console.log("MongoDB database connection established successfully");
});
app.listen(port, function() {
    //console.log("Server is running on Port: " + port);
  });  
