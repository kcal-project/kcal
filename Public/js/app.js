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

// 1.2: If you are sedentary (little or no exercise) = BMR x 1.2
// 1.375: If you are lightly active (light exercise/sports 1-3 days/week) = BMR x 1.375
// 1.55: If you are moderately active (moderate exercise/sports 3-5 days/week) = BMR x 1.55
// 1.725: If you are very active (hard exercise/sports 6-7 days a week) = BMR x 1.725
// 1.9: If you are extra active (very hard exercise/sports & physical job or 2x training) = BMR x 1.9


// Men	BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
// Women	BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161

	

//kg =lb divided by 2.2046