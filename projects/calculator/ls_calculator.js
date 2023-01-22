const readline = require('readline-sync');
const MESSAGES = require('./ls_messages.json');
const LANGUAGE = 'es';

function prompt(key) {
  let message = messages(key, LANGUAGE);
  console.log(`=> ${message}`);
}

function messages(messageKey, lang='en') {
  return MESSAGES[lang][messageKey];
}

function invalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

function printResult(result) {
  let output = messages('resultIs', LANGUAGE);
  console.log(`=> ${output} ${result}`);
}

prompt('welcome');

while (true) {
  prompt('firstNumber');
  let number1 = readline.question();
  
  while (invalidNumber(number1)) {
    prompt('invalidNumber');
    number1 = readline.question();
  }
  
  prompt('secondNumber');
  let number2 = readline.question();
  
  while (invalidNumber(number2)) {
    prompt('invalidNumber');
    number2 = readline.question();
  }
  
  prompt('whatOperation');
  let operation = readline.question();
  
  while (!['1', '2', '3', '4'].includes(operation)) {
    prompt('invalidOperation');
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
  
  printResult(output);

  prompt('anotherCalculation');
  let answer = readline.question();

  if (answer[0].toLowerCase() !== 'y') break;
}


// ----------------------------------------------------------------
// Personal thoughts on the 'go-again' bonus feature....

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