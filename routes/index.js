const Router = require('koa-router')
const User = require('../models/user')
const router = module.exports = new Router()

router.get('/', async ctx => {
  if (ctx.isAuthenticated()) {
    if (ctx.req.user.type === 'volunteer') ctx.redirect('/dashboard')
    ctx.redirect('/client')
  }
  await ctx.render('index')
})

router.get('/login', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('login')
})

router.post('/login', async ctx => {
  let { user } = await User.authenticate()(ctx.request.body.username, ctx.request.body.password)
  if (!user) {
    if (ctx.request.query['platform'] === 'HTML') {
      ctx.session.flash = { type: 'error', message: 'Invalid username / password' }
      ctx.redirect('/login')
    } else {
      ctx.body = JSON.stringify({ response: 'invalid username/password' })
      ctx.redirect('/login')
    }
  } else {
    await ctx.login(user)
    if (ctx.request.query['platform'] !== 'JSON') {
      ctx.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` }
      ctx.redirect('/')
    } else {
      await ctx.login(user)
      ctx.body = JSON.stringify({ response: 'logged in' })
    }
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
    name: ctx.request.body.name,
    country: ctx.request.body.country,
    languages: ctx.request.body.languages,
    type: ctx.request.body.type
  })
  await User.register(newUser, ctx.request.body.password)
  await ctx.login(newUser)
  if (ctx.request.query['platform'] !== 'JSON') {
    ctx.redirect('/')
  } else {
    ctx.body = JSON.stringify({ response: 'registered' })
  }
})

router.get('/logout', ctx => {
  ctx.logout()
  ctx.redirect('/')
})

router.get('/dashboard', async ctx => {
  await ctx.render('dashboard')
})

router.get('/client', async ctx => {
  await ctx.render('client')
})
