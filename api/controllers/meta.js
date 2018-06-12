const Router = require('koa-router')
const router = module.exports = new Router()
const { removeRequest, getRequests } = require('../../middleware/cache')
const { volunteerIO, clientIO } = require('../../sockets')

router.get('/', async ctx => {
  if (ctx.isAuthenticated()) {
    if (ctx.req.user.type === 'volunteer') ctx.redirect('/volunteer/dashboard')
    ctx.redirect('/client/dashboard')
  }
  await ctx.render('meta/landing')
})

router.get('/logout', ctx => {
  ctx.logout()
  ctx.redirect('/')
})

router.get('/chat/:id', async ctx => {
  if (!ctx.isAuthenticated()) ctx.redirect('/')
  removeRequest('/client#' + ctx.params.id)
  volunteerIO.broadcast('updateRequests', { requests: getRequests() })
  if (ctx.request.query['userType'] !== 'client') {
    clientIO.to('/client#' + ctx.params.id).emit('assistance', { id: ctx.params.id })
  }
  await ctx.render('meta/chat')
})
