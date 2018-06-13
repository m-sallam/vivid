var SimplePeer
var io

$('document').ready(function () {
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
    setTimeout(function () {
      navigator.getUserMedia({ video: { facingMode: 'environment' }, audio: true }, gotMedia, function () { })
    }, 2000)
  })

  function gotMedia (stream) {
    var peer = new SimplePeer({ initiator: window.location.hash === '#1', stream: stream, trickle: false })

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
})
