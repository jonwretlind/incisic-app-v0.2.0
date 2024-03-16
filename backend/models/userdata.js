const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userData = new Schema({
    firstname:      String,
    lastname:       String,
    email:          String,
    age:            Number,
    relationships:  String,
    spousename:     String,
    num_children:   Number,
    child_1:        String,
    child_2:        String,
    child_3:        String,
    employer:       String,
    annual_income:  Number
}, {collection: 'user'});
const userModel = mongoose.model("user", userData);
module.exports = userModel;
