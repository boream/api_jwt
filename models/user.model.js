const mongoose = require('mongoose');

const User = new mongoose.Schema({
    email: { type: String, unique: true, required: false, trim: true },
    password: { type: String, required: false, trim: true },
    salt: { type: String, required: false, trim: true },
    provider: { type: String, required: true, trim: true }
});

// DAO data access object
module.exports = mongoose.model('User', User);