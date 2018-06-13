var SimplePeer
var io

$('document').ready(function () {
  var options = null
  const roomId = 'room_' + window.location.pathname.split('/')[2]
  const socket = io('/chat')
  socket.on('connect', function () {
    socket.emit('join', roomId)
  })

  socket.on('secondParty', function () {
    console.log('second party')
    socket.emit('rejoin', roomId)
  })

  socket.on('startStream', function () {
    setMedia()
  })

  function setMedia () {
    navigator.getUserMedia({ video: { facingMode: 'environment' }, audio: true }, gotMedia, function () { })
    // navigator.mediaDevices.enumerateDevices()
    //   .then(function (devices) {
    //     // Get all cameras on the device
    //     var cameras = devices.filter(function (device) {
    //       return device.kind === 'videoinput'
    //     })

    //     cameras.forEach(function (camera) {
    //       // Search back camera on the device
    //       if (camera.label.toLowerCase().search('back') > -1) {
    //         options = { video: { facingMode: { exact: 'environment' } }, audio: true }
    //       }
    //     })

    //     // If we don't find the back camera we use last camera in the list
    //     if (!options && cameras.length) {
    //       options = { video: true, audio: true }
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    //   .finally(function () {
    //     navigator.getUserMedia(options, gotMedia, function () { })
    //   })
  }

  function gotMedia (stream) {
    var peer = new SimplePeer({ initiator: window.location.hash === '#1', stream: stream })

    peer.on('error', function (err) { console.log('error', err) })

    peer.on('signal', function (data) {
      socket.emit('RTCSignal', { data: data, roomId: roomId })
    })

    socket.on('RTCAnswer', function (data) {
      console.log('answer')
      peer.signal(data.data)
    })

    peer.on('stream', function (stream) {
      // got remote video stream, now let's show it in a video tag
      var video = document.querySelector('video')
      video.src = window.URL.createObjectURL(stream)
      video.play()
    })

    peer.on('close', function () {
      window.location = '/client/dashboard'
    })
  }

  // peer.on('signal', function (data) {
  //   console.log('SIGNAL', JSON.stringify(data))
  //   document.querySelector('#outgoing').textContent = JSON.stringify(data)
  // })

  // document.querySelector('form').addEventListener('submit', function (ev) {
  //   ev.preventDefault()
  //   peer.signal(JSON.parse(document.querySelector('#incoming').value))
  // })

  // peer.on('connect', function () {
  //   console.log('CONNECT')
  //   peer.send('whatever' + Math.random())
  // })

  // peer.on('data', function (data) {
  //   console.log('data: ' + data)
  // })
})
