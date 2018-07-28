import 'dotenv'
import Alice, { loggerMiddleware } from 'yandex-dialogs-sdk'
import reply from 'yandex-dialogs-sdk/dist/reply'
import button from 'yandex-dialogs-sdk/dist/button'

import mongo from 'mongodb'
import mongoose from 'mongoose'

import './models/models'
import getResults from './api/search/getResults'
import getRecipes from './api/recipes/getRecipes'
import getRecipeById from './api/recipes/getRecipeById'
import getProductById from './api/products/getProductById'

import { MONGODB_PATH, OAUTH_TOKEN, SKILL_ID } from './config'
import { getUrlToBusiness } from './images'

const App = require('yandex-dialogs-sdk')
const { Scene } = App

const ACTIONS = {
    'Готовить': 'готовить',
    'Ингридиенты': 'Ингредиенты',
    'Рецепт': 'рецепт',
}

mongoose.connect(MONGODB_PATH)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to DB')
})

const alice = new Alice({
    oAuthToken: OAUTH_TOKEN,
    skillId: SKILL_ID,
    devServerUrl: 'https://a678505d.ngrok.io',
    responseTimeout: 900,
})

alice.use(
    loggerMiddleware({
        level: 1,
    })
)

alice.command(
    ctx => {
        if (ctx.req.request.type === 'ButtonPressed') {
            return false
        }
        if (ctx.message === '') {
            return true
        }
        return false
    },
    async ctx => ctx.reply('Привет! Я умею помогать готовить вкусную еду')
)

const findSomeRecipes = async ctx => {
    const { something } = ctx.body
    const [recipes, products, categories] = await getResults(something)
    if (!recipes.recipes.length) {
        ctx.reply(`Сорян, бро, я не знаю такое блюдо 😔`)
    }
    const response = {
        header: {
            title: 'Смотри что я нашёл',
        },
        items: recipes.recipes.map(recipe => ({
            type: 'BigImage',
            image_id: getUrlToBusiness(recipe.image),
            title: recipe.title,
        })),
    }

    // ctx.replyWithImage('1030494/2fd39ea9641cd2b07258')
    ctx.reply(msg)
}

alice.command('Как приготовить', findSomeRecipes)
alice.command('Хочу', findSomeRecipes)
alice.command(ctx => {
    return false
}, findSomeRecipes)
// alice.command('Что приготовить на', ctx => {
//     const { something } = ctx.body
//     ctx.reply(`${something}`)
// })

alice.command(['Покажи книгу рецептов', 'Покажи список рецептов', 'покажи рецепты'], async ctx => {
    const recipes = await getRecipes()
    const response = reply({
        text: 'В моей книге рецептов много вкусных блюд, выбирай',
        buttons: recipes.map(recipe =>
            button({
                title: recipe.title,
                payload: JSON.stringify({
                    command: ACTIONS.Рецепт,
                    id: recipe._id,
                }),
            })
        ),
    })
    ctx.reply(response)
})

// const foodSteps = new Scene('foodSteps')
// // foodSteps.enter('', ctx => ctx.reply('тест'))
// console.log(foodSteps)
// foodSteps.any(ctx => ctx.reply('123'))

const getRecipeDescription = (currentRecipe) => {
    return 'Будущее описание'
}

const getRecipeCard = (currentRecipe) => {
    return reply({
        text: currentRecipe.title,
        card: {
            type: 'ItemsList',
            header: {
                title: currentRecipe.title,
            },
            items: [
                {
                    type: 'BigImage',
                    image_id: getUrlToBusiness(currentRecipe.image),
                    description: getRecipeDescription(currentRecipe),
                },
            ],
        },
        buttons: [button({
            title: ACTIONS.Ингридиенты,
            payload: JSON.stringify({
                command: ACTIONS.Ингридиенты,
                id: currentRecipe._id,
            }),
        }), button({
            title: ACTIONS.Готовить,
            payload: JSON.stringify({
                command: ACTIONS.Готовить,
                id: currentRecipe._id,
            }),
        })]
    })
}

const getButtonPayload = async (ctx) => {
    if (ctx.req.request.type === 'ButtonPressed') {
        if (ctx.payload) {
            const data = JSON.parse(ctx.payload)
            const {currentRecipe} = ctx.state
            if (!currentRecipe || currentRecipe._id !== data.id) {
                const recipe = await getRecipeById(data.id)
                if (recipe) {
                    ctx.state.currentRecipe = recipe
                    return data
                }
            }
            return data
        }
        return false
    }
    return false
}

const makeBigDealWithRecipeCard = async ctx => {
    const { currentRecipe } = ctx.state
    const response = getRecipeCard(currentRecipe)
    ctx.reply(response)
}

alice.command(
    async ctx => {
        const payload = await getButtonPayload(ctx)
        return payload && payload.command === ACTIONS.Рецепт
    },
    makeBigDealWithRecipeCard
)

const formatIngredient = async (ingredient) => {
    const {title: productTitle} = await getProductById(ingredient.product)
    return `${productTitle}: ${ingredient.amount ? ingredient.amount : ''} ${ingredient.measure}`
}

alice.command(async ctx => {
    const payload = await getButtonPayload(ctx)
    if (ctx.message && ctx.message.toLowerCase().indexOf(ACTIONS.Ингридиенты.toLowerCase()) > -1 && payload.id) {
        return true
    }
    return payload && payload.command === ACTIONS.Ингридиенты
}, async (ctx) => {
    const { currentRecipe } = ctx.state
    const formattedIngridients = await Promise.all(currentRecipe.ingredients.map(formatIngredient))
    const result = formattedIngridients.join('\n') + '\n\nСкажите «Начать готовить»'
    ctx.reply(reply({
        text: result,
        tts: result,
        card: {
            type: 'BigImage',
            image_id: getUrlToBusiness(currentRecipe.image),
            title: ACTIONS.Ингридиенты,
            description: result,
        },
    }))
})

// Food steps
alice.command(async ctx => {
    if (!ctx.state.currentRecipe) {
        return false
    }
    if (ctx.message.toLowerCase().indexOf('дальше') > -1) {
        ctx.state.currentStep += 1
        return true
    }

    if (ctx.message.toLowerCase().indexOf('обратно') > -1) {
        ctx.state.currentStep -= 1
        return true
    }

    if (ctx.message.toLowerCase().indexOf('готовить') > -1) {
        ctx.state.currentStep = 0
        return true
    }

    if (ctx.message.toLowerCase().indexOf('повтори') > -1) {
        ctx.state.currentStep = 0
        return true
    }

    const payload = await getButtonPayload(ctx)

    if (payload) {
        if (payload.command.indexOf(ACTIONS.Готовить) > -1) {
            ctx.state.currentStep = 0
            return true
        }
    }
    return false
}, ctx => {
    const { currentRecipe, currentStep } = ctx.state

    if (!currentRecipe) {
        ctx.reply('Выберите блюдо, которое вы хотите готовитьб')
        return
    }
    if (currentStep > currentRecipe.stages) {
        ctx.reply('Приятного аппетита')
        return
    }

    const stage = currentRecipe.stages[currentStep]
    const stageTitle = stage.title
    const stepsFormatted = stage.steps.reduce((acc, step) => `${acc} ● ${step.title} \n`, '')
    const tts = stepsFormatted
        .replace(/гр\./, 'грамм')
        .replace(/см\./, 'сантиметра')

    const response = reply({
        text: currentRecipe.title,
        tts: tts,
        card: {
            type: 'BigImage',
            image_id: getUrlToBusiness(stage.image) || getUrlToBusiness(currentRecipe.image),
            title: stageTitle,
            description: stepsFormatted,
        },
    })

    console.log(response)
    ctx.reply(response)
})

alice.command(
    async ctx => {
        const { message } = ctx
        const [recipes, products, categories] = await getResults(message)
        if (recipes.recipes.length) {
            const currentRecipe = await getRecipeById(recipes.recipes[0]._id)
            const { _id, title } = currentRecipe
            ctx.state.currentRecipe = currentRecipe
            return true
            // ctx.reply(`Начинаем готовить ${title}`)
            // ctx.reply(`Сорян, бро, я не знаю такое блюдо 😔`)
        }
        return false
    },
    makeBigDealWithRecipeCard
)

// alice.any(async ctx => ctx.reply('О чём это вы?'))
alice.any(async ctx => {
    ctx.reply('Не поняла')
})

alice.listen('/', 3000).then(() => console.log('listening'))
