var io
$(document).ready(function () {
  const socket = io('/volunteer')
  socket.on('connect', function () {
    console.log('connected to socket')
    socket.emit('initialize', { user: JSON.parse($('#user').val()) })
  })
})
