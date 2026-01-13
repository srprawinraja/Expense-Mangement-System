const mongoose = require('mongoose');
const Note = require('./Note');

const recordSchema = new mongoose.Schema({
    dateAndTime: { type: Date, required: true },
    amountType:  { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AmountType',                   
        required: true 
    },
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
    note: {
        type: Note,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
