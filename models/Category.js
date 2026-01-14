const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: { type: String, required: true},
    isIncome: { type: Boolean, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
