const mongoose = require('mongoose');

const accountTypeSchema = new mongoose.Schema({
    accountTypeName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AccountType', accountTypeSchema);
