const IO = require('koa-socket-2')
const fs = require('fs')
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
  let rd = fs.createReadStream('./public/test.mp4')
  rd.on('data', (data) => {
    ctx.socket.emit('frame', { frame: data })
  })
})

module.exports = { androidIO: androidIO, clientIO: clientIO }
