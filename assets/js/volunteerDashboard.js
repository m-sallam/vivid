var io
$(document).ready(function () {
  const socket = io('/volunteer')
  socket.on('connect', function () {
    console.log('connected to socket')
    socket.emit('initialize', { user: JSON.parse($('#user').val()) })
  })
  socket.on('updateRequests', function (data) {
    let html = ``
    if (data.requests && data.requests.length > 0) {
      for (let user of data.requests) {
        html += `<div class="user">
        <div class="user-img">
          <img draggable="false" src="/img/generic-user.png" alt="Generic User Icon">
        </div>
        <div class="user-info">
          <h3 class="user-name">${user.name}
            <span class="user-country">${user.country}</span>
          </h3>
          <h6 class="user-lang">
            <i class="fas fa-globe"></i> ${user.languages}</h6>
          <h6 class="user-date">
            <i class="fas fa-clock"></i> 01/01/2019 - 4:30PM GMT+2d</h6>
        </div>
        <div class="hover-board">
          <a href="/chat/${user.socketId.split('#')[1]}#1" class="connect-btn"><i class="fas fa-plus-circle"></i> Connect</a>
        </div>
      </div>`
      }
    } else {
      html = '<label class="empty-label">No clients requesting help at the moment</label>'
    }
    $('#online-clients').html(html)
  })
})
