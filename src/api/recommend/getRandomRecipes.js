const mongoose = require('mongoose')
const Recipes = mongoose.model('recipes')

/**
 * Возвращает коллекцию из 5ти произвольных рецептов
 *
 * @return {Array}
 */
const getRandomRecipes = () => {
  return new Promise((res, rej) => {
    Recipes.findRandom({}, {stages: 0, ingredients: 0, categories: 0}, {limit: 5}, (err, recipes) => {
      if (err) return rej(err)
      return res(recipes)
    })
  })
}

module.exports = getRandomRecipes
