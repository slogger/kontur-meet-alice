const mongoose = require('mongoose')
const Products = mongoose.model('products')

/**
 * Возвращает продукт по запрашиваемому id
 *
 * @param {String} id идентификатор продукта
 * @return {Object}
 */
const getProductById = id => {
    return new Promise((res, rej) => {
        Products.findById(id).exec((err, product) => {
            if (err) return rej(err)
            return res(product)
        })
    })
}

module.exports = getProductById
