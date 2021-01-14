var mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema({
    username:{
        type: String,
        required: true 
    },
    email:{
        type: String,
        required: true,
        index:{
             unique: true
        },
        //match:/^[a-zA-Z0-9!@#$%^&*]{6,16}$/
    },
    password:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("user", user)