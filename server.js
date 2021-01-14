var mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
//var emailValidator = require("email-validator")
const app = express();
var port = 3000;
let user = require("./model/user");

const router = express.Router();

const bcrypt = require('bcrypt');

require('dotenv').config()

app.use(bodyParser.json()); // for parsing application/json
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

  router.route('/insert').post(function(req, res){
    //   console.log(req.body)
      
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var confirmPassword = req.body.confirmpassword;
      if(!email){
        return res.json({success:false, message:"Email required"})
    } 
      if(password !== confirmPassword){
           res.status(201).json({
              message:"Password not match!",
           });
      }else{
        bcrypt.hash(password, 10, function(err, hash) {
            // Store hash in your password DB.
            if(err){
                return res.status(201).json({
                    message:"Somthing wrong, Try Letter",
                    error:err
                 });
            }else{
                //console.log(hash);
                user.findOne({email:email}).then(resp => {
                    //console.log(resp)
                    if(resp){
                        return res.json({ 
                            data:[resp],
                            success:false,
                            message:"data is already Exist"
                        })
                    }else{
                        
            createdata = { username:username, email:email, password:hash };
            //console.log(createdata)
            user.create(createdata, function(err, data){
                  //console.log(err,data)
                  if(err){
                      return res.json({ 
                          data:[data],
                          success:false,
                          message:"Email Exist",
                          error:err
                      })
                  }else{
                      return res.json({
                          data:[data],
                          success:true,
                          message:"Register succesfully"
                      })
                  }
                  //return res.json(req.user)
                })
            }
            })
            }
        });
      }
  });

  router.route("/login").get(function(req, res){
         //console.log(req.body)

        var email = req.body.email;
       var password = req.body.password;  
       var logdata = {email:email};
       //console.log(logdata)

        user.findOne(logdata, function(err, user){
            //bcrypt.compare(password, 10, function(err, result) {
                if(user){
                    bcrypt.compare(password, user.password, function(err, result) {
                        console.log(result)
                         if(result == false){
                            res.status(400).send("Invalid password")
                         }else{
                             res.send("Login success")
                         }
                    });
                }else{
                    return res.json({success:false,"message":"Email is not correct"})
                } 
        })
       });

       router.route("/getdata").get(function(req, res) {
        //console.log(req)
        //var user = User.find({}).limit(1).skip(5).toArray();
        user.find().limit(5).skip(19)(function (err, result) {
            
            if (err) {
              res.send(err);
            } else {
              res.json(result);
            }
          }
        );
      });

      router.route("/singledata").post(function(req, res) {
         //console.log(req.body.email);
        var email = req.body.email;
        //console.log(email)
       
        user.findOne({email:email}).exec(function (err, data){
          return res.json(data)
        })
      });
