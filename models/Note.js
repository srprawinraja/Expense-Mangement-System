const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    keys: { type: [], required: true },
}, { timestamps: true });

