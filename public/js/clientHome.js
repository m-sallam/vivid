var io
var Webcam
$(document).ready(function () {
  // socket handling
  const socket = io('/client')

  socket.on('connect', function () {
    console.log('connected to socket')
    socket.emit('initialize', { user: JSON.parse($('#user').val()) })
  })

  socket.on('assistance', function (data) {
    if (data.response.volunteerAvailable) {
      v.say('transfering you to a volunteer')
    } else {
      v.say('no volunteers available at the momnet, transfering you to our AI')
    }
  })

  socket.on('description', function (data) {
    v.say(data.description)
  })

  socket.on('VQA', function (data) {
    v.say(data.answer)
  })

  // voice commands
  const v = new Artyom()

  v.say('Hi, i am v, use hey v for commands')

  var command = {
    indexes: ['hey V, *'],
    smart: true,
    action: function (i, wildcard) {
      if (wildcard.includes('help')) {
        socket.emit('requestAssistance')
      } else if (wildcard.trim() === 'what is this') {
        Webcam.snap(function (dataUrl) {
          v.say('processing')
          socket.emit('requestDescription', { pic: dataUrl })
        })
      } else {
        Webcam.snap(function (dataUrl) {
          v.say('processing')
          socket.emit('requestVQA', { pic: dataUrl })
        })
      }
    }
  }

  v.addCommands(command)
  v.initialize({
    continuous: true,
    lang: 'en-US',
    listen: true,
    debug: true
  })

  setTimeout(function () {
    v.simulateInstruction('hey V, is there is a man in this picture')
  }, 5000)

  Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
  })
  if (Webcam.cameraIDs.length > 1) {
    Webcam.cameraID = 1
  }
  Webcam.attach('#my_camera')

  var UserDictation = v.newDictation({
    continuous: true, // Enable continuous if HTTPS connection
    onResult: function (text) {
      // Do something with the text
      $('#text').html(text)
    },
    onStart: function () {
      console.log('Dictation started by the user')
    },
    onEnd: function () {
      alert('Dictation stopped by the user')
    }
  })

  UserDictation.start()
})
