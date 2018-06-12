// window.onload = function () {
//   // Intro Animation
//   var header = $('.header')
//   var navLinks = $('.header .nav-item')
//   var userListing = $('.user-listing')
//   var userCards = $('.user-listing .user')
// }

$(document).ready(function () {
  $('.nav-item')
    .hover(function () {
      $(this).addClass('hovered')
    }, function () {
      $(this).removeClass('hovered')
    })

  $('.users-scroller').niceScroll({
    cursorcolor: '#888A8B'
  })

  $('.user-rating').rateYo({
    starWidth: '25px',
    normalFill: '#d3d3d3',
    ratedFill: '#ffd42a',
    numStars: 5,
    readOnly: true
  })

  $('.navbar-toggler').click(function (e) {
    e.stopImmediatePropagation()
    $(this).toggleClass('open')
    $(this)
      .siblings('.navbar-collapse')
      .slideToggle(750)
  })
})
