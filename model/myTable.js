var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var myTable = new Schema({
          userid:{
            type: mongoose.Schema.ObjectId, ref:'user'              
          },
          day:{
              type:String
          },
          time:{
              type:String
          }
});
module.exports = mongoose.model("mytable", myTable)