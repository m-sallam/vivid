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
    console.log(data);
    // window.alert('frame sent')
    console.log(new Blob([new Uint8Array(data.frame)]));
    // $(".stream-el");
  });
});
