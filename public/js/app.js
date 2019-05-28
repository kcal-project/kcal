$(document).ready(function(){
  $('.showButton').click(function(){
    var on = $(this.form).is(':visible');
    $(this.form).slideToggle();
    $(this).html(on ? 'Update Plan' : 'Hide Form');
  });
});


