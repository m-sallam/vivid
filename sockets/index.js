const IO = require('koa-socket-2')
const save = require('save-file')
const path = require('path')
const Horseman = require('node-horseman')
const volunteerIO = new IO({ namespace: 'volunteer' })
const clientIO = new IO({ namespace: 'client' })
const vqaIO = new IO({ namespace: 'vqa-model' })
const chatIO = new IO({ namespace: 'chat' })
const { insertConnectedVolunteer, removeDisconnectedVolunteer, insertConnectedClient, removeDisconnectedClient, insertRequest, removeRequest, getRequests, getClients, getVolunteers } = require('../middleware/cache')

volunteerIO.on('connection', async ctx => {
  console.log('Volunteer connected -', Date())
})

volunteerIO.on('initialize', async ctx => {
  var user = ctx.data.user
  user.socketId = ctx.socket.id
  insertConnectedVolunteer(user)
  volunteerIO.broadcast('updateVolunteers', { volunteers: getVolunteers() })
})

volunteerIO.on('disconnect', async ctx => {
  removeDisconnectedVolunteer(ctx.socket.id)
  console.log('Volunteer disconnected -', Date())
  volunteerIO.broadcast('updateVolunteers', { volunteers: getVolunteers() })
})

// ------------------ client sockets ----------------------------

clientIO.on('connection', async ctx => {
  console.log('Client Connected - ', Date())
})

clientIO.on('initialize', async ctx => {
  var user = ctx.data.user
  user.socketId = ctx.socket.id
  insertConnectedClient(user)
  volunteerIO.broadcast('updateClients', { clients: getClients() })
})

clientIO.on('disconnect', async ctx => {
  removeDisconnectedClient(ctx.socket.id)
  removeRequest(ctx.socket.id)
  console.log('client disconnected - ', Date())
  volunteerIO.broadcast('updateClients', { clients: getClients() })
})

clientIO.on('requestAssistance', async ctx => {
  var user = ctx.data.user
  user.socketId = ctx.socket.id
  insertRequest(user)
  volunteerIO.broadcast('updateRequests', { requests: getRequests() })
})

clientIO.on('requestDescription', async ctx => {
  try {
    await save(ctx.data.pic, 'pic.png')
    const horseman = new Horseman({ loadImages: false })
    horseman
      .open('https://www.captionbot.ai')
      .upload('#idImageUploadField', path.join(__dirname, 'pic.jpg'))
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
        out = out.replace('i think', '')
        ctx.socket.emit('description', { description: out })
      })
      .close()
  } catch (err) {
    console.log(err)
    ctx.socket.emit('description', { description: 'sorry, an error occured, try again' })
  }
})

clientIO.on('requestVQA', async ctx => {
  vqaIO.broadcast('question', { pic: ctx.data.pic, question: ctx.data.question, socketId: ctx.socket.id })
})

// ------------------ vqa model sockets ----------------------------

vqaIO.on('connection', async ctx => {
  console.log('VQA Model connected - ', Date())
})
vqaIO.on('answer', async ctx => {
  clientIO.to(ctx.data.socketId).emit('VQA', { answer: ctx.data.out })
})

// ------------------ chat sockets ----------------------------

chatIO.on('connection', async ctx => {
  console.log('chat party connected')
})

chatIO.on('join', async ctx => {
  ctx.socket.join(ctx.data)
  ctx.socket.broadcast.to(ctx.data).emit('secondParty')
})

chatIO.on('rejoin', async ctx => {
  chatIO.to(ctx.data).emit('startStream')
})

chatIO.on('RTCSignal', async ctx => {
  ctx.socket.broadcast.to(ctx.data.roomId).emit('RTCAnswer', { data: ctx.data.data, roomId: ctx.data.roomId })
})

module.exports = { volunteerIO: volunteerIO, clientIO: clientIO, vqaIO: vqaIO, chatIO: chatIO }
