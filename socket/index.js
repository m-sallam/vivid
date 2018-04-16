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
  fs.readFile('./public/test.png', (err, data) => {
    if (err) return err
    console.log(data)
    let buffer = Buffer.from(data)
    ctx.socket.emit('frame', { frame: buffer })
    // fs.writeFile('./ooo.png', buffer, (err) => {
    //   if (err) return err
    //   console.log('blah')
    // })
  })

  // let c = 1
  // let rd = fs.createReadStream('./public/test.mp4')
  // rd.on('data', (data) => {
  //   // fs.writeFile(`./${c}.mp4`, data, {}, (err, res) => {
  //   //   if (err) {
  //   //     console.error(err)
  //   //     return
  //   //   }
  //   //   console.log('video saved')
  //   // })
  //   // c++
  //   let l = fs.createWriteStream('./l.mp4')
  //   l.write(data)

  // })
})

module.exports = { androidIO: androidIO, clientIO: clientIO }
