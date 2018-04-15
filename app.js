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

const indexRouter = require('./routes/index')
const tempRouter = require('./routes/temp')

const User = require('./models/user')

const sockets = require('./socket')
const tempSockets = require('./socket/temp')

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

sockets.androidIO.attach(app)
sockets.clientIO.attach(app)
tempSockets.desIO.attach(app)

app.use(async (ctx, next) => {
  try {
    // flash message
    ctx.state.flash = ctx.session.flash
    ctx.session.flash = null
    await next()
  } catch (err) {
    console.log('error')
    console.log(err)
  }
})

app.use(indexRouter.routes())
app.use(indexRouter.allowedMethods())
app.use(tempRouter.routes())
app.use(tempRouter.allowedMethods())

app.listen(process.env.PORT || 3000)
console.log('listining...')
