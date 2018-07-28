const mongoose = require('mongoose')
const random = require('mongoose-simple-random')
const Schema = mongoose.Schema

const recipesSchema = mongoose.Schema(
    {
        title: String,
        image: String,
        time: Number,
        energy: Number,
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: 'categories',
            },
        ],
        ingredients: [
            {
                _id: false,
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                },
                amount: Number,
                measure: String,
                isMain: Boolean,
                extra: Boolean,
            },
        ],
        stages: [
            {
                _id: false,
                title: String,
                image: String,
                steps: [
                    {
                        title: String,
                        requiredProduct: String,
                        productsForStep: [String],
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
)

const categoriesSchema = mongoose.Schema(
    {
        title: String,
        recipes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'recipes',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const productsSchema = mongoose.Schema(
    {
        title: String,
        baseMeasure: String,
        image: String,
        alternatives: [
            {
                type: Schema.Types.ObjectId,
                ref: 'products',
            },
        ],
    },
    {
        timestamps: true,
    }
)

recipesSchema.plugin(random)
categoriesSchema.plugin(random)
productsSchema.plugin(random)

mongoose.model('recipes', recipesSchema)
mongoose.model('categories', categoriesSchema)
mongoose.model('products', productsSchema)
