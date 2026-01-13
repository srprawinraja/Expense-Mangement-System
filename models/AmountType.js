const mongoose = require('mongoose');

const amountTypeSchema = new mongoose.Schema({
    amountType: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('AmountType', amountTypeSchema);
