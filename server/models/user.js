const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    isActivated: { type: Boolean, default: false },
    activationToken: String,
    activationTokenExpiry: Date
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);