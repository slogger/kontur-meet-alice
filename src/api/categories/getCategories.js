const mongoose = require('mongoose')
const Categories = mongoose.model('categories')

/**
 * Возвращает коллекцию категорий
 *
 * @return {Array}
 */
const getCategories = () => {
    return new Promise((res, rej) => {
        Categories.find()
            .populate('recipes')
            .exec((err, categories) => {
                if (err) return rej(err)
                return res(categories)
            })
    })
}

module.exports = getCategories
