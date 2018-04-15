const Router = require('koa-router')
const router = module.exports = new Router()

router.get('/temp/stream', async ctx => {
  await ctx.render('stream')
})

router.get('/temp/vqa', async ctx => {
  await ctx.render('vqa')
})

router.get('/temp/des', async ctx => {
  await ctx.render('description')
})
