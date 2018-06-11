const Koa = require('koa')
const logger = require('koa-logger')
const views = require('koa-views')
const serve = require('koa-static')
const koaBody = require('koa-body')
const session = require('koa-session')
const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const app = new Koa()

const router = require('./routes')

const User = require('./models/user')

const sockets = require('./socket')

dotenv.config()

mongoose.connect(process.env.DBURL, (err) => {
  if (err) return err
  console.log('connect to database - ', Date())
})

app.use(logger())

app.use(koaBody({ multipart: true }))
app.use(serve('./public'))
app.use(views(path.join(__dirname, '/views'), {
  options: { settings: { views: path.join(__dirname, 'views') } },
  map: { 'vash': 'vash' },
  extension: 'vash'
}))

app.keys = ['some secret hurr']
app.use(session(app))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

sockets.volunteerIO.attach(app)
sockets.clientIO.attach(app)
sockets.vqaIO.attach(app)

app.use(async (ctx, next) => {
  try {
    if (ctx.isAuthenticated()) {
      let user = {
        username: ctx.req.user.username,
        email: ctx.req.user.email,
        name: ctx.req.user.name,
        country: ctx.req.user.country,
        languages: ctx.req.user.languages,
        type: ctx.req.user.type
      }
      ctx.state.currentUser = user
    }

    // flash message
    ctx.state.flash = ctx.session.flash
    ctx.session.flash = null
    await next()
  } catch (err) {
    console.log('error')
    console.log(err)
    ctx.body = err.message
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
console.log('listining...')
