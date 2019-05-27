$(document).ready(function(){
  $('.showButton').click(function(){
    var on = $(this.form).is(':visible');
    $(this.form).slideToggle();
    $(this).html(on ? 'Update Plan' : 'Hide Form');
  });
});

// goes back into my dashboard page
// <!-- <% ingredient.forEach(ingr => { %>
//   <div>
  
//   <li class="title right">Ingredient<%= ingr.name %></li>
//   <li class="author right">Amount: <%= ingr.amount %></li>
  
//   </div>
// <% }); %> -->