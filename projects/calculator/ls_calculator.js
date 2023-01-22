const readline = require('readline-sync');
const MESSAGES = require('./ls_messages.json');

function prompt(message) {
  console.log(`=> ${message}`);
}

function invalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

prompt(MESSAGES['welcome']);

while (true) {
  prompt(MESSAGES['firstNumber']);
  let number1 = readline.question();
  
  while (invalidNumber(number1)) {
    prompt(MESSAGES['invalidNumber']);
    number1 = readline.question();
  }
  
  prompt(MESSAGES['secondNumber']);
  let number2 = readline.question();
  
  while (invalidNumber(number2)) {
    prompt(MESSAGES['invalidNumber']);
    number2 = readline.question();
  }
  
  prompt(MESSAGES['whatOperation']);
  let operation = readline.question();
  
  while (!['1', '2', '3', '4'].includes(operation)) {
    prompt(MESSAGES['invalidOperation']);
    operation = readline.question();
  }
  
  let output;
  switch (operation) {
    case '1':
      output = Number(number1) + Number(number2);
      break;
    case '2':
      output = Number(number1) - Number(number2);
      break;
    case '3':
      output = Number(number1) * Number(number2);
      break;
    case '4':
      output = Number(number1) / Number(number2);
      break;
  }
  
  prompt(`The result is: ${output}`);

  prompt(MESSAGES['anotherCalculation']);
  let answer = readline.question();

  if (answer[0].toLowerCase() !== 'y') break;
}


// ----------------------------------------------------------------
// function invalidYesOrNo(answer) {
//   return !['yes', 'y', 'no', 'n'].includes(answer.toLowerCase());
// }

// prompt('Welcome to Calculator!');


// while (true) {

//   prompt("Would you like do to another calculation?");
//   let doAnother = readline.question();

//   while (invalidYesOrNo(doAnother)) {
//     prompt("Sorry, please enter 'yes' or 'no'");
//     doAnother = readline.question();
//   }

//   doAnother = doAnother.toLowerCase();
//   if (doAnother[0] === 'n') {
//     break;
//   }
// }