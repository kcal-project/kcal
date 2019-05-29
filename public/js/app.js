'use strict';

$(document).ready(function () {
  $('.showButton').click(function () {
    var on = $(this.form).is(':visible');
    $(this.form).slideToggle();
    $(this).html(on ? 'Update Plan' : 'Hide Form');
  });
});

<<<<<<< HEAD
function renderMenuIcon() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
=======

>>>>>>> b10cae2c4e15f6158660251ddce312c0de56663c
