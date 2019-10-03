const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
 name: {type: String},
 password: {type: String},
 role: {type: String, default: "registered" , enum: ['registered', 'authorized', 'administrator']},
 search: {type: Array}
})

const User = mongoose.model("User", userSchema);

module.exports = User;