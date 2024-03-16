const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schillerData = new Schema({
        year: Number,
        sandp: Number,
        bond: Number,
        treas: Number
}, { collection: 'schiller_data' });
const schillerModel = mongoose.model("SchillerData", schillerData);
module.exports = schillerModel;
