var io

$(document).ready(function () {
  const socket = io('/front')

  socket.on('connect', function () {
    console.log('connected to socket')
  })
  socket.on('hello', function () {
    console.log('hello')
    document.alert('Android conencted to server')
  })
  socket.on('frame', function (data) {
    console.log(data)
    document.alert('frame sent')
  })
})
