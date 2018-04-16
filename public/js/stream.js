var io;

$(document).ready(function() {
  const socket = io("/client");

  socket.on("connect", function() {
    console.log("connected to socket");
  });
  socket.on("hello", function() {
    console.log("hello");
    window.alert("Android conencted to server");
  });
  socket.on("frame", function(data) {
    // console.log(data);
    // window.alert('frame sent')
    // var blob = new Blob([new Uint8Array(data.frame)]);

    // var blob = new Blob([new Uint8Array(data.frame)], {
    //   type: "video/mp4"
    // });

    // var blobURL = window.URL.createObjectURL(blob);

    // console.log(blob);
    // console.log(blobURL);

    // // $("#stream-el").attr("src", blob);

    // var video = document.getElementById("stream-el");
    // video.src = blobURL;

    var blob = new Blob([new Uint8Array(data.frame)], {
      type: "image/png"
    });
    var blobURL = window.URL.createObjectURL(blob);
    console.log(blob);
    console.log(blobURL);
    var image = document.getElementById("image-el");
    image.src = blobURL;
  });
});
