const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outletSchema = new Schema ({
 sapNo: {type: String},
 outletId: {type: Number},
 name: {type: String},
 type: {type: String, enum: ['NDC', 'OnlineStore','Store']},
 isoCountryCode: {type: String}
})

const Outlet = mongoose.model("Outlet", outletSchema);

module.exports = Outlet;