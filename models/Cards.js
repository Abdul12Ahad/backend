// models/Cards.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ Add this
    platform: String,
    title: { type: String, required: true },
    url: String,
    notes: String,
    tags: String,
    timestamp: String,
    isEdited: Boolean
});

module.exports = mongoose.model('Card', cardSchema);
