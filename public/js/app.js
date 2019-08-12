'use strict';

$(document).ready(function () {
  $('.showButton').click(function () {
    let on = $(this.form).is(':visible');
    $(this.form).slideToggle();
    $(this).html(on ? 'Update Plan' : 'Hide Form');
  });
});

// used in header partial//
function renderMenuIcon() {
  let x = document.getElementById('myLinks');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}

$('button.loginButton').click( function() {
  $('form.save').submit();
});
