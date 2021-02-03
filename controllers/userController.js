var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var user = require('../model/user');
var mytable = require('../model/myTable');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const nodemailer = require("nodemailer");
const Str = require('@supercharge/strings')  
require('dotenv').config()

router.post('/registerUser', function(req, res) {
    //console.log(req.body)
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var role = req.body.role;
    
    if (name == null || name == 'undefined') {
         return res.json({status:404, success:false, message:"Name fields is blank"})
    }
    if(email == null || email == 'undefined'){
      res.json({status:404, success:false, message:"Email feilds is blank"})
    }
    if (role == null || role == 'undefined') {
      return res.json({status:404, success:false, message:"role is blank"})
    }

      if(password !== confirmPassword){
        res.status(201).json({
           message:"Password not match!",
        });
   }else{
       bcrypt.hash(password, 10, function(err, hash) {
         if(err){
             return res.status(201).json({
                 message:"Somthing wrong, Try Letter",
                 error:err
              });
         }else{
        user.findOne({email:email}).then(resp => {
            //console.log(resp)
            if(resp){
                return res.json({data:[resp], success:false, message:"Email is already Exist"
                })
            }else{
  
      obj = {name:name, email:email, password:hash, role:role};
      //console.log(obj)
      user.create(obj, function(err, regiuser){
      //console.log(regiuser)
      if(err){
            return res.json({data:[regiuser], success:false, message:"Email Exist", error:err})
      }else{
            return res.json({data:[regiuser], success:true, message:"Register succesfully"})
        }
      })
    }
      })
    }
      })
     }    
});

router.route('/login').post(function(req, res) {
    //console.log(req.body)
  var email = req.body.email
  user.findOne({ email:email }, function (err, user) {
    //console.log(user)
  if (err) return res.json({error:err});
  if (!user) return res.json('No user.');

       var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
       if (!passwordIsValid) return res.status(401).send({message:"password is not valid", auth: false, token: null });

       var token = jwt.sign({ id: user._id }, config.secret, {
       expiresIn: 86400
   });
      user.access_token = token
      // console.log(user)
      res.status(200).json({message:"User Login", sucess: true, user:user,access_token:token});
   });
});

router.route("/protected").get(ensureToken, function(req, res){
  jwt.verify(req.token, config.secret, function(err, data){
    if(err){
      res.sendStatus(403);
    }else{
      res.json({ text:"this is protected", data:data });
    }
  })
});

function ensureToken(req, res, next){
  const bearerHeader = req.headers["authrization"];
  if(typeof bearerHeader !== "undefiend"){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }else{
    res.sendStatus(403);
  }
}

router.route('/ForgotPassword').get(function(req, res) {
    var email = req.body.email
    //var password = req.body.password
    const random_WithFiftySymbols = Str.random(10)
    bcrypt.hash(random_WithFiftySymbols, 10, function(err, hash) {
      if(err){
        return res.status(201).json({
            message:"Somthing wrong, Try Letter",
            error:err
         });
    }else{
      user.findOne({email:email}).then(resp => {
        //console.log(resp)
        if(!resp){
            return res.json({ success:false, message:"Email does not exist"
            })
        }else{
          var SendObj = {email:email, password:hash};
          user.update(SendObj).exec(function(err, user){
          //console.log(user)
          
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'jcgdeeds@gmail.com',
                pass: 'jcsoftware!234'
              }
            });
            let useEmail= resp.email
            var mailOptions = {
              from: 'manoj645343@gmail.com',
              to: useEmail,
              subject: 'Sending Email using Node.js',
              text: 'User new password is : ' + random_WithFiftySymbols
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error){
                //console.log(error);
      
              } else {
                console.log({error:err}, 'Email sent: ' + info.response); 
              }
            })
            res.json({data:[{email, }], message:"Email sent"})
    })
        }
      })
    }
    })
  });
  
  router.route('/MytableSave').post(function(req, res) {
    console.log(req.body)
    var userid = req.body.userid
    var day = req.body.day
    var time = req.body.time
    if(userid == null || userid == 'undefiend'){
      return res.json({success:false, message:"Userid is blank"})
    }
  
    Obj = {userid:userid, day:day, time:time}

    mytable.create(Obj, function(err, data){
      console.log(data)
     if(err){ 
          return res.json({error:err})
     }else{
          return res.json({data:data})
     }
    })
  });

  router.route('/MytableList').get(function(req, res) {
    mytable.find().then(result => {
      if(result){
        return res.json({result:result, message:"My table list"})
      }
    })   
  });

  router.route('/Mytable').post(function(req, res) {
    var userid = req.param('userid')
     
    if (userid == null || userid == 'undefined') {
      res.status(404);
    }else{

    query = {userid:userid}
    console.log(query)
    mytable.find(query).populate('userid').exec(function(err, mytable){
      console.log(mytable)
          if(err){
            return res.json({error:err})
          }else{
            return res.json({mytable})
          }
    })
  }
   });

  module.exports = router;