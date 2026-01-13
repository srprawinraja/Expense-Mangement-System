const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    imgs: { type: [], required: true },
}, { timestamps: true });

