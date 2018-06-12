const Router = require('koa-router')
const User = require('../models/user')
const router = module.exports = new Router()

router.get('/client/login', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('client/login')
})

router.post('/client/login', async ctx => {
  let { user } = await User.authenticate()(ctx.request.body.username, ctx.request.body.password)
  if (!user) {
    if (ctx.request.query['response'] !== 'JSON') {
      ctx.session.flash = { type: 'error', message: 'Invalid username / password' }
      ctx.redirect('/client/login')
    } else {
      ctx.body = JSON.stringify({ response: 'invalid username/password' })
    }
  } else {
    await ctx.login(user)
    if (ctx.request.query['response'] !== 'JSON') {
      ctx.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` }
      ctx.redirect('/')
    } else {
      await ctx.login(user)
      ctx.body = JSON.stringify({ response: 'logged in' })
    }
  }
})

router.get('/client/register', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('client/register')
})

router.post('/client/register', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  try {
    let newUser = new User({
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      name: ctx.request.body.name,
      country: ctx.request.body.country,
      languages: ctx.request.body.languages,
      type: 'client'
    })
    await User.register(newUser, ctx.request.body.password)
    await ctx.login(newUser)
    if (ctx.request.query['response'] !== 'JSON') {
      ctx.redirect('/')
    } else {
      ctx.body = JSON.stringify({ response: 'registered' })
    }
  } catch (err) {
    console.log(err)
    ctx.redirect('/client/register')
  }
})

router.get('/client/dashboard', async ctx => {
  if (!ctx.isAuthenticated()) ctx.redirect('/')
  if (ctx.req.user.type === 'volunteer') ctx.redirect('/volunteer/dashboard')
  await ctx.render('client/dashboard')
})
