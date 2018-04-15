const Router = require('koa-router')
const User = require('../models/user')
const router = module.exports = new Router()

router.get('/', async ctx => {
  await ctx.render('index')
})

router.get('/login', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('login')
})

router.post('/login', async ctx => {
  let { user } = await User.authenticate()(ctx.request.body.username, ctx.request.body.password)
  if (!user) {
    ctx.session.flash = { type: 'error', message: 'Invalid username / password' }
    ctx.redirect('/login')
  } else {
    await ctx.login(user)
    ctx.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` }
    ctx.redirect('/')
  }
})

router.get('/register', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('register')
})

router.post('/register', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  let newUser = new User({
    username: ctx.request.body.username,
    email: ctx.request.body.email,
    name: ctx.request.body.name
  })
  await User.register(newUser, ctx.request.body.password)
  await ctx.login(newUser)
  ctx.redirect('/')
})

router.get('/logout', ctx => {
  ctx.logout()
  ctx.redirect('/')
})
