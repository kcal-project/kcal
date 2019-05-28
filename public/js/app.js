'use strict';

$(document).ready(function () {
  $('.showButton').click(function () {
    var on = $(this.form).is(':visible');
    $(this.form).slideToggle();
    $(this).html(on ? 'Update Plan' : 'Hide Form');
  });
});

function renderMenuIcon() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
