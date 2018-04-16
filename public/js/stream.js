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
    var blob = new Blob([new Uint8Array(data.frame)]);
    console.log(blob);
    // $("#stream-el").attr("src", blob);

    var video = document.getElementById("stream-el");
    video.src = window.URL.createObjectURL(vid);
  });
});
