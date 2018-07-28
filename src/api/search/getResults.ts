const mongoose = require('mongoose')
const Recipes = mongoose.model('recipes')
const Categories = mongoose.model('categories')
const Products = mongoose.model('products')

/**
 * Возвращает коллекцию рецептов, категорий и продуктов, которые удовлетворяют
 * поисковому запросу
 *
 * @param {String} query поисковый запрос
 * @return {Array}
 */
const getResults = query => {
    if (query === '') return Promise.resolve([])
    const recipes = new Promise((res, rej) => {
        Recipes.find({ title: new RegExp(query, 'ig') })
            .select('title image energy time')
            .exec((err, recipes) => {
                if (err) return rej(err)
                return res({ recipes: recipes })
            })
    })
    const categories = new Promise((res, rej) => {
        Categories.find({ title: new RegExp('^' + query, 'ig') })
            .select('title')
            .exec((err, categories) => {
                if (err) return rej(err)
                return res({ categories: categories })
            })
    })
    const products = new Promise((res, rej) => {
        Products.find({ title: new RegExp('^' + query, 'ig') })
            .select('title')
            .exec((err, products) => {
                if (err) return rej(err)
                return res({ products: products })
            })
    })
    return Promise.all([recipes, products, categories])
}

module.exports = getResults
