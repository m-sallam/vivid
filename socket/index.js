const IO = require('koa-socket-2')
const fs = require('fs')
const androidIO = new IO({ namespace: 'android' })
const clientIO = new IO({ namespace: 'client' })

androidIO.on('connection', async ctx => {
  console.log('Android Connected', '-', Date())
  clientIO.broadcast('hello')
  ctx.socket.emit('question')
})
// androidIO.on('frame', async ctx => {
//   clientIO.broadcast('frame', { frame: ctx.data })
// })

clientIO.on('connection', async ctx => {
  console.log('Client Connected - ', Date())
  // fs.readFile('./public/test.mp4', (err, data) => {
  //   if (err) return err
  //   console.log(data)
  //   let buffer = Buffer.from(data)
  //   ctx.socket.emit('frame', { frame: buffer })
  //   fs.writeFile('./ooo.png', buffer, (err) => {
  //     if (err) return err
  //     console.log('blah')
  //   })
  // })
  // let ch = []
  let rs = fs.createReadStream('./public/test.mp4', { encoding: 'binary' })
  rs.on('data', (data) => {
    console.log('emitting')
    ctx.socket.emit('frame', { frame: data })
  })
})

module.exports = { androidIO: androidIO, clientIO: clientIO }
