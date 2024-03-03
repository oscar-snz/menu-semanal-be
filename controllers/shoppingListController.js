const ShoppingList = require('../models/shoppingList');
const { findWeeklyMenu }  = require('./menuController'); 

function levenshteinDistance(s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    const arr = [];

    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
    }

    for (let j = 0; j <= s.length; j++) {
        arr[0][j] = j;
    }

    for (let i = 1; i <= t.length; i++) {
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] = t.charAt(i - 1) === s.charAt(j - 1) ?
                arr[i - 1][j - 1] :
                Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + 1);
        }
    }

    return arr[t.length][s.length];
}

function areSimilarEnough(ingredient1, ingredient2, threshold = 0.2) {
    const distance = levenshteinDistance(ingredient1.toLowerCase(), ingredient2.toLowerCase());
    const maxLen = Math.max(ingredient1.length, ingredient2.length);
    const similarity = (maxLen - distance) / maxLen; // Cuanto más cerca de 1, más similares son

    return similarity >= (1 - threshold);
}



exports.createShoppingListForWeek = async (req, res) => {
    const userId = req.user._id; // Asegúrate de que estás utilizando la propiedad correcta (req.user._id).
    const { weekStart } = req.body;

    try {
        const weeklyMenu = await findWeeklyMenu(userId, weekStart);
        if (!weeklyMenu) {
            return res.status(404).send("Menú semanal no encontrado.");
        }
        
        let shoppingListItems = [];

        weeklyMenu.dailyMenus.forEach(day => {
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                if (day.recipes[0][mealType]) {
                    day.recipes[0][mealType].ingredients.forEach(ingredient => {
                        let existingItem = shoppingListItems.find(item => areSimilarEnough(item.food, ingredient.food));

                        if (existingItem) {
                            existingItem.quantity += ingredient.quantity;
                            // Si el texto del ingrediente existente es más corto que el nuevo, actualiza el nombre del ingrediente por el más largo
                            if (existingItem.food.length < ingredient.food.length) {
                                existingItem.food = ingredient.food;
                            }
                        } else {
                            shoppingListItems.push({
                                food: ingredient.food,
                                quantity: ingredient.quantity,
                                measure: ingredient.measure
                            });
                        }
                    });
                }
            });
        });

        const shoppingList = new ShoppingList({
            user: userId,
            weekStart: new Date(weekStart),
            items: shoppingListItems
        });

        await shoppingList.save();

        return res.status(201).json(shoppingList);
    } catch (error) {
        console.error('Error creating shopping list:', error);
        return res.status(500).json({ message: 'Error creating shopping list' });
    }
};
