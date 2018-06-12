const Koa = require('koa')
const views = require('koa-views')
const serve = require('koa-static')
const koaBody = require('koa-body')
const session = require('koa-session')
const passport = require('koa-passport')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const app = new Koa()

const routers = require('./api/controllers')

const sockets = require('./sockets')

const routesMiddleware = require('./middleware/routes')

dotenv.config()

app.use(koaBody({ multipart: true }))
app.use(serve('./assets'))
app.use(views(path.join(__dirname, '/views'), {
  options: { settings: { views: path.join(__dirname, 'views') } },
  map: { 'vash': 'vash' },
  extension: 'vash'
}))

app.keys = [process.env.APPSECRET]
app.use(session(app))
app.use(passport.initialize())
app.use(passport.session())

sockets.volunteerIO.attach(app)
sockets.clientIO.attach(app)
sockets.vqaIO.attach(app)
sockets.chatIO.attach(app)

app.use(routesMiddleware.addCurrentUser)

app.use(routers.metaRouter.routes())
app.use(routers.metaRouter.allowedMethods())
app.use(routers.clientRouter.routes())
app.use(routers.clientRouter.allowedMethods())
app.use(routers.volunteerRouter.routes())
app.use(routers.volunteerRouter.allowedMethods())

var start = async () => {
  try {
    await mongoose.connect(process.env.DBURL)
    console.log('connect to database')
    await app.listen(process.env.PORT || 3000)
    console.log('listining...')
  } catch (err) {
    console.log(err)
    process.abort()
  }
}

start()
