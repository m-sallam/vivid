$(document).ready(function () {

  $(".text-input").focusout(function () {
    if ($(this).val()) {
      $(this).addClass("notEmpty")
    } else {
      $(this).removeClass("notEmpty")
    }
  })

  $('#languages-select').selectize({
    // placeholder: "Languages"
    onFocus: function () {
      // console.log(this)
      var wrapper = this.$wrapper;
      wrapper.addClass("focused");
      wrapper.siblings(".text-input-label").addClass("focused");
    },
    onDropdownClose: function () {
      var wrapper = this.$wrapper;
      wrapper.removeClass("focused");
      wrapper.siblings(".text-input-label").removeClass("focused");
      if (this.items.length !== 0) {
        wrapper.addClass("focused");
        wrapper.siblings(".text-input-label").addClass("focused");
      } else {
        wrapper.removeClass("focused");
        wrapper.siblings(".text-input-label").removeClass("focused");
      }
    }
  });
})