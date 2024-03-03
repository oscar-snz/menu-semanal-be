const mongoose = require('mongoose');

const ShoppingListItemSchema = new mongoose.Schema({
    food: { type: String, required: true },
    quantity: { type: Number, required: true },
    measure: { type: String, required: true }
});

const ShoppingListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    items: [ShoppingListItemSchema]
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
