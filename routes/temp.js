const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const User = require('../models/user')

router.get('/temp/stream', async ctx => {
  await ctx.render('stream')
})

router.get('/temp/vqa', async ctx => {
  await ctx.render('vqa')
})

router.get('/temp/des', async ctx => {
  await ctx.render('description')
})

router.get('/temp/video', async ctx => {
  const path = './public/test.mp4'
  ctx.type = 'mp4'
  ctx.body = fs.createReadStream(path)
})

router.get('/users', async ctx => {
  let users = await User.find({})
  ctx.body = users
})

module.exports = { tempRouter: router }
