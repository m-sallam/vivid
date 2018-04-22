const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const IO = require('koa-socket-2')
const videoIO = new IO({ namespace: 'video' })
const ss = require('socket.io-stream')
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

ss(videoIO).on('frame', (stream, data) => {
  console.log('s')
  stream.pip(fs.createWriteStream('./q.mp4'))
})

videoIO.on('connection', async ctx => {
  console.log('Android Connected', '-', Date())
})
module.exports = { tempRouter: router, videoIO: videoIO }
