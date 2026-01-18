const mongoose = require('mongoose');
const Note = require('./Note');

const recordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',                   
        required: true 
    },
    accountType: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AccountType',                   
        required: true 
    },
    title: {type: String},
    note: {
        type: Note,
    }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
