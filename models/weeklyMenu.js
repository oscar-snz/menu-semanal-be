const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  text: String,
  quantity: Number,
  measure: String
});

const RecipeSchema = new mongoose.Schema({
  label: String,
  image: String,
  yield: Number,
  ingredientLines: [String],
  ingredients: [IngredientSchema],
  calories: Number,
  url: String
});

const MealSchema = new mongoose.Schema({
  breakfast: RecipeSchema,
  lunch: RecipeSchema,
  dinner: RecipeSchema
});

const DailyMenuSchema = new mongoose.Schema({
  date: Date,
  recipes: [MealSchema]
});

const WeeklyMenuSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStart: Date,
  weekEnd: Date, 
  dailyMenus: [DailyMenuSchema]
});

const WeeklyMenu = mongoose.model('WeeklyMenu', WeeklyMenuSchema);

module.exports = WeeklyMenu;