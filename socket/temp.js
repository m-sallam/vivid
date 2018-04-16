const IO = require('koa-socket-2')
const desIO = new IO({ namespace: 'description' })
// const clientIO = new IO({ namespace: 'client' })
const save = require('save-file')
const path = require('path')
const Horseman = require('node-horseman')

desIO.on('connection', async ctx => {
  console.log('Description client connected - ', Date())
})

desIO.on('reqDescription', async ctx => {
  try {
    await save(ctx.data.pic, 'pic.png')
    const horseman = new Horseman({ loadImages: false })
    horseman
      .open('https://www.captionbot.ai')
      .upload('#idImageUploadField', path.join(__dirname, 'pic.png'))
      .waitFor({
        fn: function waitForSelectorCount (selector) {
          return $(selector).text().length > 30
        },
        args: ['#captionLabel'],
        value: true,
        timeout: 20000
      })
      .text('#captionLabel')
      .then((out) => {
        console.log(out, Date())
        ctx.socket.emit('description', { des: out })
      })
      .close()
  } catch (err) {
    console.log(err)
    ctx.socket.emit('description', { des: 'error eccoured, do something!' })
  }
})
// module.exports = function (io) {
//   // const ioVqaFront = io.of('/vqa-front')
//   // const ioVqaBack = io.of('/vqa-back')
//   const ioDesFront = io.of('/des-front')
//   const save = require('save-file')
//   const path = require('path')
//   const Horseman = require('node-horseman')

//   ioDesFront.on('connection', (socket) => {
//     console.log('front description connected - ', Date())
//     socket.on('req', async (data) => {
//       try {
//         await save(data.pic, 'pic.png')
//         const horseman = new Horseman({ loadImages: false })
//         horseman
//           .open('https://www.captionbot.ai')
//           .upload('#idImageUploadField', path.join(__dirname, 'pic.png'))
//           .waitFor({
//             fn: function waitForSelectorCount (selector) {
//               return $(selector).text().length > 30
//             },
//             args: ['#captionLabel'],
//             value: true,
//             timeout: 20000
//           })
//           .text('#captionLabel')
//           .then((out) => {
//             console.log(out, Date())
//             socket.emit('des', { des: out })
//           })
//           .close()
//       } catch (err) {
//         console.log(err)
//         socket.emit('des', { des: 'error eccoured, do something!' })
//       }
//     })
//   })
// ioVqaFront.on('connection', (socket) => {
//   console.log('vqa front connected - ', Date())
//   socket.on('question', (data) => {
//     ioVqaBack.emit('question', data)
//   })
// })
// ioVqaBack.on('connection', (socket) => {
//   console.log('vqa back connected - ', Date())
//   socket.on('answer', (data) => {
//     ioVqaFront.emit('answer', data)
//   })
// })
// }

module.exports = { desIO: desIO }