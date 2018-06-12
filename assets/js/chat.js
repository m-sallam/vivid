var SimplePeer
var io
$('document').ready(function () {
  const roomId = 'room_' + window.location.pathname.split('/')[2]
  const socket = io('/chat')
  socket.on('connect', function () {
    socket.emit('join', roomId)
  })

  socket.on('firstParty', function () {
    console.log('first party')
    navigator.getUserMedia({ video: { facingMode: { exact: 'environment' } }, audio: true }, gotMedia, function () { })
  })

  socket.on('secondParty', function () {
    console.log('second party')
    socket.emit('rejoin', roomId)
    navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () { })
  })

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
      window.history.back()
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
