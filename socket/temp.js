const IO = require('koa-socket-2')
const desIO = new IO({ namespace: 'description' })
const vqaMIO = new IO({ namespace: 'vqa-model' })
const vqaBIO = new IO({ namespace: 'vqa-browser' })
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

vqaMIO.on('connection', async ctx => {
  console.log('VQA Model connected - ', Date())
})
vqaMIO.on('answer', async ctx => {
  vqaBIO.broadcast('answer', ctx.data)
})

vqaBIO.on('connection', async ctx => {
  console.log('VQA browser connected - ', Date())
})
vqaBIO.on('question', async ctx => {
  vqaMIO.broadcast('question', ctx.data)
})

module.exports = { desIO: desIO, vqaBIO: vqaBIO, vqaMIO: vqaMIO }
