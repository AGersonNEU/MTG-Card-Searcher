const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    cost: String,
    set: String,
    commander: String,
    standard: String,
    modern: String,
    duel: String,
    colors: [String],
    releaseDate: String,
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Card', cardSchema);