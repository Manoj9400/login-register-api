var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
            name:{
                type:String,
                required:true
            },
            email:{
                 type:String,
                 unique: true,
                 required:true
            },
            password:{
                type:String,
                required:true  
            },
            role:{
                type:String,
                required:true  
            },
            status: {
                type: String,
                default: 'active'
            },
            isDeleted: {
                type: Boolean,
                default: false
              }, 
            created_at:{
                type:Date,
                default:Date.now
            },
            updated_at:{
                type:Date,
                default:Date.now
            },
});

module.exports = mongoose.model("user", user);