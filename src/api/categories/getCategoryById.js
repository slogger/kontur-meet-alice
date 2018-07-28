const mongoose = require('mongoose')
const Categories = mongoose.model('categories')

/**
 * Возвращает категорию по запрашиваемому id
 *
 * @param {String} id идентификатор категории
 * @return {Object}
 */
const getCategoryById = id => {
    return new Promise((res, rej) => {
        Categories.findById(id)
            .populate('recipes')
            .exec((err, category) => {
                if (err) return rej(err)
                return res(category)
            })
    })
}

module.exports = getCategoryById
