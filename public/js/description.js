var io

$(document).ready(function () {
  const socket = io('/description')

  socket.on('connect', function () {
    console.log('connected to socket')
  })

  socket.on('description', function (data) {
    $('#out').append(data.des + '<br>')
  })

  $('#image').change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader()
      reader.onload = function (e) {
        $('#imageU').attr('src', e.target.result)
      }
      reader.readAsDataURL(this.files[0])
    }
  })

  $('#send').on('click', function () {
    socket.emit('reqDescription', { pic: $('#image')[0].files[0] })
  })
})
