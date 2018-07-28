const mongoose = require('mongoose')
const Products = mongoose.model('products')

/**
 * Возвращает коллекцию всех продуктов
 *
 * @return {Array}
 */
const getProducts = () => {
    return new Promise((res, rej) => {
        Products.find().exec((err, products) => {
            if (err) return rej(err)
            return res(products)
        })
    })
}

module.exports = getProducts
