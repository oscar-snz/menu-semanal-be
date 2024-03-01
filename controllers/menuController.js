// controllers/menuController.js
const WeeklyMenu = require('../models/weeklyMenu');
const axios = require('axios'); // Asumiendo que usas axios para las llamadas HTTP
const app_id = process.env.app_id;
const app_key = process.env.app_key;
const { downloadAndUploadImage } = require('../aws/awsConfiguration');
const moment = require('moment-timezone');


exports.getWeeklyMenu = async (req, res) => {

    try {
        const userId = req.user._id; // Asegúrate de tener una forma de obtener el ID del usuario actual
        const weeklyMenu = await WeeklyMenu.findOne({ usuario: userId });
        res.json(weeklyMenu);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el menú semanal" });
    }
};

exports.createWeeklyMenu = async (req, res) => {
    const user = req.user;
    const { date: dateParam } = req.body;

    // Calculate the start and end of the week for the given date
    let { weekStart, weekEnd } = getWeekStartAndEndDate(new Date(dateParam));

    try {
        // Generate meals only for the specified day
        const mealForTheDay = await generateMealsForDay(user);
        // Try to find the weekly menu document
        let weeklyMenu = await WeeklyMenu.findOne({ user: user._id, weekStart: weekStart, weekEnd: weekEnd });

        if (!weeklyMenu) {
            // If it doesn't exist, create it
            weeklyMenu = new WeeklyMenu({
                user: user._id,
                weekStart: weekStart,
                weekEnd: weekEnd,
                dailyMenus: [{ date: new Date(dateParam), recipes: mealForTheDay }]
            });
        } else {
            // If it exists, update the daily menu for the specific date
            const index = weeklyMenu.dailyMenus.findIndex(menu => menu.date.toISOString() === new Date(dateParam).toISOString());
            if (index >= 0) {
                weeklyMenu.dailyMenus[index].recipes = mealForTheDay;
            } else {
                weeklyMenu.dailyMenus.push({ date: new Date(dateParam), recipes: mealForTheDay });
            }
        }

        await weeklyMenu.save(); // Save the updated or new document

        res.json(weeklyMenu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear o actualizar el menú diario" });
    }
};


async function generateMealsForDay(user) {
    const { diet, health } = user;

    // Obtener las recetas para el rango de fechas
    const breakfastRecipe = await fetchRecipesFromEdamam("breakfast", diet, health);
    const lunchRecipe = await fetchRecipesFromEdamam("lunch", diet, health);
    const dinnerRecipe = await fetchRecipesFromEdamam("dinner", diet, health);

    return {
        breakfast: breakfastRecipe,
        lunch: lunchRecipe,
        dinner: dinnerRecipe
    };

}


async function fetchRecipesFromEdamam(mealType, dietType, health) {
    let healthParams = '';
    if (health.length > 0) {
        healthParams = health.map(h => `&health=${encodeURIComponent(h)}`).join('');
    }
    try {
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${app_id}&app_key=${app_key}&diet=${dietType}&random=true&mealType=${mealType}${healthParams}`);

        if (response.data.hits.length > 0) {
            const { recipe } = response.data.hits[0];
            const imageUrl = await downloadAndUploadImage(recipe.image);
            const transformedRecipe = {
                label: recipe.label,
                image: imageUrl,
                yield: recipe.yield,
                ingredientLines: recipe.ingredientLines,
                ingredients: recipe.ingredients.map(ing => ({
                    text: ing.text,
                    quantity: ing.quantity,
                    measure: ing.measure
                })),
                calories: recipe.calories,
                url: recipe.url
            };
            return transformedRecipe; // Devuelve el primer resultado transformado
        } else {
            // Devuelve un objeto vacío o lanza un error si no hay resultados
            return {};
        }
    } catch (error) {
        throw new Error("Failed to fetch recipes from Edamam");
    }

}

exports.getWeeklyMenuByStartDate = async (req, res) => {
    try {
        let { weekStart } = req.query; // Obtén la fecha de inicio de la semana desde la consulta
        const userId = req.user._id; // Asume que el middleware de autenticación ya ha poblado req.user

        // Convertir weekStart a objeto Date y luego a UTC medianoche
        weekStart = new Date(weekStart);
        weekStart.setUTCHours(12, 0, 0, 0);
        // Busca un menú semanal que comience en la fecha especificada y pertenezca al usuario actual
        const weeklyMenu = await WeeklyMenu.findOne({
            user: userId,
            weekStart: weekStart.toISOString()
        });

        if (!weeklyMenu) {
            return res.status(404).json({ message: "Menú semanal no encontrado" });
        }

        res.json(weeklyMenu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el menú semanal" });
    }
};



function getWeekStartAndEndDate(date) {
    // Asume que 'date' es un objeto Date de JavaScript
    const dayOfWeek = date.getUTCDay(); // Usar getUTCDay para obtener el día de la semana en UTC

    // Calcula cuántos días hay que ajustar para llegar al lunes en UTC
    let daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo (0), ajusta a -6

    // Calcula el inicio de la semana (weekStart) en UTC
    let weekStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + daysToMonday, 12, 0, 0, 0));

    // Calcula el fin de semana (weekEnd) en UTC, sumando 6 días al inicio de la semana
    let weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

    return {
        weekStart: weekStart.toISOString(), // Retorna como string ISO para evitar confusiones de zona horaria
        weekEnd: weekEnd.toISOString()
    };
}


exports.getMenuByDate = async (req, res) => {
    const dateParam = req.query.date; // 'YYYY-MM-DD'
    const userId = req.user._id;

    // Convertir la fecha de entrada a UTC
    const dayStart = new Date(dateParam);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(dateParam);
    dayEnd.setUTCHours(23, 59, 59, 999);

    try {
        const menus = await WeeklyMenu.aggregate([
            {
                $match: {
                    user: userId,
                    dailyMenus: {
                        $elemMatch: {
                            date: {
                                $gte: dayStart,
                                $lte: dayEnd
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$dailyMenus"
            },
            {
                $match: {
                    "dailyMenus.date": {
                        $gte: dayStart,
                        $lte: dayEnd
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$dailyMenus.date",
                    recipes: "$dailyMenus.recipes"
                }
            },
            {
                $unwind: "$recipes"
            },
            {
                $project: {
                    date: 1, // Mantén la fecha en la proyección final
                    breakfast: "$recipes.breakfast",
                    lunch: "$recipes.lunch",
                    dinner: "$recipes.dinner"
                }
            }
        ]);

        if (!menus.length) {
            return res.status(404).send("No se encontró el menú para la fecha solicitada.");
        }

        res.json(menus); // Esto devolverá un arreglo de los menús filtrados, incluyendo la fecha
    } catch (error) {
        console.error("Error al buscar el menú por fecha:", error);
        res.status(500).send("Error interno del servidor.");
    }
};







