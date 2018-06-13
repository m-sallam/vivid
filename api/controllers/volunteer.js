const Router = require('koa-router')
const User = require('../models/user')
const router = module.exports = new Router()
const { getRequests, getClients, getVolunteers } = require('../../middleware/cache')

router.get('/volunteer/login', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('volunteer/login')
})

router.post('/volunteer/login', async ctx => {
  let { user } = await User.authenticate()(ctx.request.body.username, ctx.request.body.password)
  if (!user) {
    if (ctx.request.query['response'] !== 'JSON') {
      ctx.session.flash = { type: 'error', message: 'Invalid username / password' }
      ctx.redirect('/volunteer/login')
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

router.get('/volunteer/register', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  await ctx.render('volunteer/register')
})

router.post('/volunteer/register', async ctx => {
  if (ctx.isAuthenticated()) ctx.redirect('/')
  try {
    let newUser = new User({
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      name: ctx.request.body.name,
      country: ctx.request.body.country,
      languages: ctx.request.body.languages,
      type: 'volunteer'
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
    ctx.redirect('/volunteer/register')
  }
})

router.get('/volunteer/dashboard', async ctx => {
  if (!ctx.isAuthenticated()) ctx.redirect('/')
  if (ctx.req.user.type === 'client') ctx.redirect('/client/dashboard')
  await ctx.render('volunteer/dashboard', { requests: getRequests(), clients: getClients(), volunteers: getVolunteers() })
})
