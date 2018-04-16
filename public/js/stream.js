var io

$(document).ready(function () {
  const socket = io('/client')

  socket.on('connect', function () {
    console.log('connected to socket')
  })
  socket.on('hello', function () {
    console.log('hello')
    window.alert('Android conencted to server')
  })
  socket.on('frame', function (data) {
    // console.log(data);
    // window.alert('frame sent')
    // var blob = new Blob([new Uint8Array(data.frame)])
    // console.log(blob)
    // $("#stream-el").attr("src", blob);
    var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

    var video = document.getElementById('stream-el')
    var mediaSource = new MediaSource()

    video.src = URL.createObjectURL(mediaSource)
    mediaSource.addEventListener('sourceopen', sourceOpen)
    function sourceOpen (_) {
      while (this.readyState === 'closed');
      // console.log(this.readyState); // open
      var mediaSource = this
      var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
      sourceBuffer.appendBuffer(data.frame)
    }
    // var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
    // sourceBuffer.appendBuffer(data.frame)
    // video.src = window.URL.createObjectURL(blob)
  })
})
