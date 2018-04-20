var io
// var ch = []

$(document).ready(function () {
  const socket = io('/client')
  var queue = []
  socket.on('frame', function (data) { queue.push(new Uint8Array(data.frame)) })
  socket.on('connect', function () {
    console.log('connected to socket')
  })
  socket.on('hello', function () {
    console.log('hello')
    window.alert('Android conencted to server')
  })
  // var mediaSource = new MediaSource()
  // document.getElementById('stream-el').src = window.URL.createObjectURL(mediaSource)
  // mediaSource.addEventListener('sourceopen', function (event) {
  //   var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
  //   // connect to socket.io and emit the <command>
  //   // whatever normally would have called appendBuffer(buffer) can
  //   // now just call queue.push(buffer) instead
  //   if (queue.length) {
  //     sourceBuffer.appendBuffer(queue.shift())
  //   }
  // })

  // // var blob = new Blob([new Uint8Array(data.frame)], {
  // //   type: "video/mp4"
  // // });

  // // var blobURL = window.URL.createObjectURL(blob);

  // // console.log(blob);
  // // console.log(blobURL);

  // // // $("#stream-el").attr("src", blob);
  // socket.on('frame', function (data) {
  //   let video = document.getElementById('stream-el')
  //   ch.push(data.frame)
  //   video.setAttribute('src', 'data:video/mp4;base64,' + window.btoa(data.frame))
  // })

  // // video.src = blobURL;

  // // var blob = new Blob([new Uint8Array(data.frame)], {
  // //   type: "image/png"
  // // });
  // // var blobURL = window.URL.createObjectURL(blob);
  // // console.log(blob);
  // // console.log(blobURL);
  // // var image = document.getElementById("image-el");
  // // image.src = blobURL;
})
