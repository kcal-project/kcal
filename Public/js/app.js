$(document).ready(
  $('#button1').on('click', getBmr)
);

function getBmr(){
  let height = parseFloat($('#getHeight').val());
  let weight = parseFloat($('#getWeight').val());
  let age = parseFloat($('#getAge').val());
  let sex = $('input[name=\'sex\']:checked').val();
  let activity = parseFloat($('#getActivity').val());
  let goal = parseFloat($('#getGoal').val());
  let loss = $('input[name=\'loss\']:checked').val();
  console.log(activity);
  let bmrWithoutActivity = 0;
  if (sex === 'male'){
    bmrWithoutActivity = (10*(weight/2.205)+ 6.25*(height*2.54) - (5*age) + 5);
  }
  else{
    bmrWithoutActivity = (10*(weight/2.205) + (6.25*(height*2.54)) - (5*age) - 161);
  }

  let completeBmr = Math.floor(bmrWithoutActivity * activity);

  if (loss === 'mild'){
    // return completeBmr -215;
    alert(completeBmr -215);
  }
  if (loss === 'moderate'){
    // return completeBmr -500;
    alert(completeBmr -500);

  }
  if (loss === 'extreme'){
    // return completeBmr -1000;
    alert(completeBmr - 1000);

  }


  console.log(height, weight, age, sex, activity, loss, goal);

}
