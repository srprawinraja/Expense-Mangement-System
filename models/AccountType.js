const mongoose = require('mongoose');

const accountTypeSchema = new mongoose.Schema({
    accountType: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('AccountType', accountTypeSchema);
