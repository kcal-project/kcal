$(document).ready(
  $('#button2').on('click', getBmr)
);

function getBmr(){
  let height = parseFloat($('#getHeight').val());
  let weight = parseFloat($('#getWeight').val());
  let age = parseFloat($('#getAge').val());
  let sex = $('input[name=\'sex\']:checked').val();
  let activity = parseFloat($('#getActivity').val());
  console.log(activity);
  let bmrWithoutActivity = 0;
  if (sex === 'male'){
    bmrWithoutActivity = (10*(weight/2.205)+ 6.25*(height*2.54) - (5*age) + 5);
  }
  else{
    bmrWithoutActivity = (10*(weight/2.205) + (6.25*(height*2.54)) - (5*age) - 161);
  }
  let completeBmr = bmrWithoutActivity * activity;

  console.log(height, weight, age, sex, activity);


  // evalActivity * ((10 * weight) + (6.25 * height) - (5 * age) - 161);


  let string = 'BMR: ' + bmrWithoutActivity + ' calories per day';
  let string2 = 'completeBMR: ' + completeBmr + ' calories per day';
  alert(string);
  alert(string2);
}
