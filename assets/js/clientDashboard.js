var io
var Webcam
var TypeIt
$(document).ready(function () {
  var typeitInstance = new TypeIt('.recognized-text', {
    // strings: ['This is my string!'],
    speed: 50
  })

  // socket handling
  const socket = io('/client')

  socket.on('connect', function () {
    console.log('connected to socket')
    socket.emit('initialize', { user: JSON.parse($('#user').val()) })
  })

  socket.on('assistance', function (data) {
    v.say('transfering you to a volunteer')
    window.location = '/chat/' + data.id + '?userType=client'
  })

  socket.on('description', function (data) {
    v.say(data.description)
  })

  socket.on('VQA', function (data) {
    v.say(data.answer)
  })

  // voice commands
  const v = new Artyom()

  v.say('Hi, say hey before your command')

  var command = {
    indexes: ['hey *'],
    smart: true,
    action: function (i, wildcard) {
      if (wildcard.includes('help')) {
        v.say('requesting assistance')
        socket.emit('requestAssistance', { user: JSON.parse($('#user').val()) })
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

  v.redirectRecognizedTextOutput(function (recognized, isFinal) {
    typeitInstance.delete().type(recognized)
  })

  setTimeout(function () {
    v.initialize({
      continuous: true,
      lang: 'en-US',
      listen: true
      // debug: true
    })
  }, 3000)

  // setTimeout(function () {
  //   v.simulateInstruction('hey help')
  // }, 7000)

  var webcamOptions = {
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 100
  }
  // `enumerateDevices` is a method for getting all available media devices
  if (typeof navigator.mediaDevices.enumerateDevices === 'undefined') {
    // if method `enumerateDevices` doesn't support on the device we just run webcam

  } else {
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        // Get all cameras on the device
        var cameras = devices.filter(function (device) {
          return device.kind === 'videoinput'
        })

        var deviceId = null

        cameras.forEach(function (camera) {
          // Search back camera on the device
          if (camera.label.toLowerCase().search('back') > -1) {
            deviceId = camera.deviceId
          }
        })

        // If we don't find the back camera we use last camera in the list
        if (!deviceId && cameras.length) {
          deviceId = cameras[cameras.length - 1].deviceId
        }

        if (deviceId) {
          // If we have `deviceId` of a camera we run webcam with the following params:
          webcamOptions.constraints = {
            deviceId: {
              exact: deviceId
            },
            facingMode: 'environment'
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function () {
        Webcam.set(webcamOptions)
        Webcam.attach('#my_camera')
        $('video').attr('display', 'None')
      })
  }
})
