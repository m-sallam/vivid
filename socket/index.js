const IO = require('koa-socket-2')
const androidIO = new IO({ namespace: 'android' })
const clientIO = new IO({ namespace: 'client' })

androidIO.on('connection', async ctx => {
  console.log('Android Connected', '-', Date())
  clientIO.broadcast('hello')
  ctx.socket.emit('question')
})
androidIO.on('frame', async ctx => {
  clientIO.broadcast('frame', { frame: ctx.data })
})

clientIO.on('connection', async ctx => {
  console.log('Client Connected - ', Date())
})

module.exports = { androidIO: androidIO, clientIO: clientIO }
