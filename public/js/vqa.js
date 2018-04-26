var io

$(document).ready(function () {
  const vqaSocket = io('/vqa-browser')

  vqaSocket.on('connect', function () {
    console.log('connected to socket')
  })

  vqaSocket.on('answer', function (data) {
    $('#out').append(data.out + '<br>')
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
    vqaSocket.emit('question', { pic: $('#image')[0].files[0], question: $('#question').val(), extension: $('#image')[0].files[0].name.split('.')[$('#image')[0].files[0].name.split('.').length - 1] })
  })
})
