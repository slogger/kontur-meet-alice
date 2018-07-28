import getResults from './api/search/getResults'
import getRecipes from './api/recipes/getRecipes'
import getRecipeById from './api/recipes/getRecipeById'
import Alice from 'yandex-dialogs-sdk'
import { MONGODB_PATH, OAUTH_TOKEN, SKILL_ID } from './config'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const table = {

}

const cache = { 'http://img.delicious.com.au/Bdbc5JHr/h506-w759-cfill/del/2015/10/capsicum-basil-and-mozzarella-bruschetta-12227-1.jpg': '213044/3db0ad6d4fc40db05130',
'https://intense-earth-33481.herokuapp.com/assets/recipe2/brusketta_stage1.jpg': '997614/fdf70394687f7e155272',
'https://intense-earth-33481.herokuapp.com/assets/recipe2/brusketta_stage2.jpg': '213044/c17c94383f6d0898f38d',
'https://intense-earth-33481.herokuapp.com/assets/recipe2/brusketta_stage3.jpg': '1030494/9c9521d54a00a0d09e26',
'https://intense-earth-33481.herokuapp.com/assets/recipe2/brusketta_stage4.jpg': '997614/c65d6b066abba8cf70d4',
'https://intense-earth-33481.herokuapp.com/assets/recipe2/brusketta_stage5.jpg': '937455/a86d401ca95afa1f1663',
'https://intense-earth-33481.herokuapp.com/assets/recipe2/brusketta_main.jpg': '213044/52b6ece85d15baaadf83',
'http://intense-earth-33481.herokuapp.com/assets/recipe12/recipe12_stage1.jpg': '937455/ebe390ae730ccdd25720',
'http://pinlavie.com/system/posts/pictures/6580/BM4Vr-XO4XtAgtLF9yuqiy.jpg': '997614/07b92401686af9fc98c7',
'http://photos.vegrecipesofindia.com/wp-content/uploads/2013/07/spaghetti-olio-e-aglio-recipe.jpg': '937455/cd3d03cca755e13ad637',
'https://intense-earth-33481.herokuapp.com/assets/recipe12/recipe12_stage3.jpg': '213044/609b240afd9bf7b5518f',
'https://intense-earth-33481.herokuapp.com/assets/recipe12/recipe12_stage4.jpg': '1030494/9ea7a483ee83cdd71beb',
'https://intense-earth-33481.herokuapp.com/assets/recipe12/recipe12_stage5.jpg': '997614/a1e72ec1f97387b93aef',
'http://intense-earth-33481.herokuapp.com/assets/recipe11/4cheese.jpg': '1030494/3269e92bb53a6bd8375c',
'http://www.conlemaninpasta.com/wordpress/wp-content/uploads/2014/07/IMG_6813a-682x1024.jpg': '213044/26375f71cf483ab55817',
'http://intense-earth-33481.herokuapp.com/assets/recipe14/recipe14_main.jpg': '997614/0c6f1455cbb4a9b93dd0',
'https://intense-earth-33481.herokuapp.com/assets/recipe3/recipe3_stage2.jpg': '1030494/660c1d04e61470ce3262',
'http://www.taste.com.au/images/recipes/agt/2005/06/vegetable-frittata-2205_l.jpeg': '213044/1ebdb8ca2a481b7f1270',
'https://intense-earth-33481.herokuapp.com/assets/recipe3/recipe3_stage3.jpg': '997614/a9e167305760d3cda878',
'https://intense-earth-33481.herokuapp.com/assets/recipe3/recipe3_stage4.jpg': '1030494/3fef0d0137cd90644f7d',
'https://intense-earth-33481.herokuapp.com/assets/recipe3/recipe3_stage5.jpg': '997614/6efead8f01fea51be3c4',
'http://www.countryhearthbreads.com/wp-content/uploads/2014/02/Bacon-Egg-Swiss-Panini-028.jpg': '213044/4583057aadafcea4a551',
'http://intense-earth-33481.herokuapp.com/assets/recipe16/recipe16_main.jpg': '1030494/c5f7a511cb30f5b902de',
'https://intense-earth-33481.herokuapp.com/assets/recipe17/recipe17_stage2.jpg': '213044/6d5ded340be803409f36',
'https://intense-earth-33481.herokuapp.com/assets/recipe17/recipe17_stage3.jpg': '213044/2917622a660c8126e4de',
'https://66.media.tumblr.com/ed0df04cba51b918c4eceb008fdad827/tumblr_nph6xfyrjX1r9mqsko1_500.jpg': '997614/854e7d7eb86563b9821a',
'http://www.dontfeedaftermidnight.co.uk/wp/wp-content/uploads/2014/10/tomato-pepper-risotto.jpg': '997614/849d492300f973908762',
'http://cdn.jamieoliver.com/recipe-database/oldImages/430_575/469_1_1439307833.jpg': '1030494/de804bc6c7a2eef55f52',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02550.jpg': '997614/9534d6b4a0e1cb8045fa',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02482.jpg': '965417/d54c21702cdcd0ae2a20',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02483.jpg': '213044/a81fb10937f42742e72f',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02484.jpg': '213044/f0f80735e5066c62cfcd',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02486.jpg': '1030494/a676ba1496be9b608fd7',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02501.jpg': '213044/d2ccba18ec7e25ba9f5c',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02491.jpg': '213044/9a9843f925962df0a002',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02495.jpg': '997614/4be9606f6b8b16dea2e7',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02499.jpg': '213044/9419957cde9d115c0c14',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02508.jpg': '937455/e8be99e893e8988bcd5d',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02512.jpg': '1030494/20be5d6c0c0f7a4998b8',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02519.jpg': '213044/e328599b8b372f76f446',
'http://andychef.ru/wp-content/uploads/2015/08/DSC02589.jpg': '937455/f3e47a0eb811ab4fe79f',
'http://andychef.ru/wp-content/uploads/2015/01/DSC05417.jpg': '213044/95002c2fe2243011d1ec',
'http://andychef.ru/wp-content/uploads/2015/01/DSC05402.jpg': '213044/76e697fa3a47224e38df',
'http://andychef.ru/wp-content/uploads/2015/01/DSC05405.jpg': '213044/cc1db6422f46dc5d9d64',
'http://andychef.ru/wp-content/uploads/2015/01/DSC05406.jpg': '1030494/991965528cfff7f7cb9b',
'http://andychef.ru/wp-content/uploads/2015/01/DSC05408.jpg': '997614/0835a65f4b278cc83be4',
'http://andychef.ru/wp-content/uploads/2015/01/DSC05410.jpg': '937455/f016f2862eee7ecf998c',
'http://1.bp.blogspot.com/-wL8BOXqGaRM/TZkbVA714II/AAAAAAAACrs/3ncoHA7FQgY/s800/Cannelloni2.jpg': '937455/e73daf8b04756dc7be4f',
'http://www.vkusnyblog.ru/wp-content/uploads/2012/05/risotto-s-krevetkami.jpg': '213044/c04cfcf39de684a1fa40',
'http://40.media.tumblr.com/b84780ffbde59e65594b7569ff03f74e/tumblr_o10y59x1df1r29uexo1_500.jpg': '997614/55df7f17b7b478aa7bc9',
'https://intense-earth-33481.herokuapp.com/assets/recipe19/recipe19_main.jpg': '213044/b082e770864c647e8aa4',
'https://intense-earth-33481.herokuapp.com/assets/recipe19/recipe19_stage1.jpg': '997614/2083ff185c7d3e3d0993',
'https://intense-earth-33481.herokuapp.com/assets/recipe19/recipe19_stage2.jpg': '937455/007ff320f4991fe69d1d',
'https://intense-earth-33481.herokuapp.com/assets/recipe19/recipe19_stage3.jpg': '1030494/ae29110ecf4329a3f5ec',
'https://intense-earth-33481.herokuapp.com/assets/recipe19/recipe19_stage6.jpg': '997614/22ff37b28843dc7b8d83',
'http://www.ricettedellanonna.net/wp-content/uploads/2014/05/melanzane-alla-parmigiana.jpg': '937455/de8304a37fce99b8e165',
'https://intense-earth-33481.herokuapp.com/assets/recipe10/recipe10_stage1.jpg': '965417/3b1939b7c2fc01c3a502',
'https://intense-earth-33481.herokuapp.com/assets/recipe10/recipe10_stage2.jpg': '997614/9bbf929745ad2dc34f10',
'https://intense-earth-33481.herokuapp.com/assets/recipe10/recipe10_stage3.jpg': '1030494/466ad64ae331280f10be',
'https://intense-earth-33481.herokuapp.com/assets/recipe10/recipe10_stage5.jpg': '997614/818fa02825c0f3f26cae',
'https://intense-earth-33481.herokuapp.com/assets/recipe10/recipe10_stage6.jpg': '1030494/428411ab6efd18dbe9a2',
'http://andychef.ru/wp-content/uploads/2015/01/main5.jpg': '1030494/2eb1d432e30a54e57798',
'http://andychef.ru/wp-content/uploads/2015/01/DSC07233-2.jpg': '997614/58c9c6ba7b8a9d8e598e',
'http://andychef.ru/wp-content/uploads/2015/01/DSC07236-2.jpg': '1030494/67fbf1c1321d1e9a7577',
'http://andychef.ru/wp-content/uploads/2015/01/DSC07316.jpg': '997614/ada01da37adaa75e3f0e',
'http://andychef.ru/wp-content/uploads/2015/01/DSC07317.jpg': '1030494/441f092cff926940381d',
'http://andychef.ru/wp-content/uploads/2015/01/DSC07318.jpg': '997614/878b5175167379229056',
'http://andychef.ru/wp-content/uploads/2014/08/main.jpg': '997614/a8f94aa3dd19c017912f',
'http://andychef.ru/wp-content/uploads/2014/08/002.jpg': '997614/c8329dedcc0fe57fc842',
'http://andychef.ru/wp-content/uploads/2014/08/003.jpg': '997614/5c1f8a6f80f5c01a156d',
'http://andychef.ru/wp-content/uploads/2014/08/004.jpg': '937455/10438cf8b06e3b3c7304',
'http://andychef.ru/wp-content/uploads/2014/08/006.jpg': '213044/8df792d0f3eb56092474',
'http://andychef.ru/wp-content/uploads/2014/08/009.jpg': '997614/1fd6d24b5f04a0234110',
'http://andychef.ru/wp-content/uploads/2014/08/010.jpg': '937455/c0acdf08b6d64615128d',
'http://andychef.ru/wp-content/uploads/2014/08/in3.jpg': '1030494/a6408a7809713837ea8c',
'http://andychef.ru/wp-content/uploads/2014/02/00412.jpg': '213044/5f3db0428d24ca7c411d',
'http://andychef.ru/wp-content/uploads/2014/02/00711.jpg': '1030494/e9a2ac14d91787da53f2',
'http://andychef.ru/wp-content/uploads/2014/02/00211.jpg': '997614/8925c0e04c67e4e48a25',
'http://andychef.ru/wp-content/uploads/2014/02/0157.jpg': '997614/3e65b70762c006047966',
'http://andychef.ru/wp-content/uploads/2014/02/0185.jpg': '1030494/21ba9aa5d63ec8cd585a',
'http://andychef.ru/wp-content/uploads/2014/02/0222.jpg': '1030494/c6dd6f39559696b25200',
'http://andychef.ru/wp-content/uploads/2014/02/0242.jpg': '1030494/a401cd81409bc1b9a36f',
'http://andychef.ru/wp-content/uploads/2014/02/0271.jpg': '213044/7bd7269c90eb19de69d2',
'http://andychef.ru/wp-content/uploads/2014/02/0261.jpg': '997614/a28d90b2229beaf4206b',
}

export const getUrlToBusiness = (url) => cache[url]

// export async function getImagesURLS() {
//     const recipes = await getRecipes()

//     const urls = recipes.reduce((acc, recipe) => {
//         const stageImages = recipe.stages.reduce((acc, stage) => [...acc, stage.image], [])
//         return [...acc, recipe.image, ...stageImages].filter(Boolean)
//     }, [])

//     for (let url of urls) {
//         if (!url.startsWith('http')) {
//             url = 'https://' + url
//         }
//         alice.uploadImage(url).then(result => {
//             const { id, origUrl } = result.image
//             table[origUrl] = id
//         })
//         await delay(10000000)
//         console.log(table)
//     }
//     console.log('result', table)
// }

// getImagesURLS()

