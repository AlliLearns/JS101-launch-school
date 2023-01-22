const rlsync = require('readline-sync');
const PROMPT = `>>>`;

const {
  welcome,
  enterToContinue,
  getNumber,
  invalidNumber,
  getOperation,
  invalidOperation,
  noDivByZero,
  giveNotZeroNum,
  doAnother,
  invalidContinuation,
  farewell,
} = require('./calc_messages.json');

runApp();

function runApp() {
  clearConsole();
  welcomeUserToCalculator();
  explainCalculatorApp();
  waitForAcknowledgement();

  do    {runCalculator()}
  while (doAnotherCalculation());

  clearConsole();
  farewellFromCalculator();
}


// --- user experience functions ---
function welcomeUserToCalculator() {
  report(welcome);
}

function explainCalculatorApp() {} // TODO

function waitForAcknowledgement() {
  getInput(enterToContinue);
}

function farewellFromCalculator() {
  report(farewell);
}


// --- program logic functions ---
function runCalculator() {
  clearConsole();

  const numberMsg = {
    prompt: getNumber,
    failed: invalidNumber,
  };

  const operatorMsg = {
    prompt: getOperation,
    failed: invalidOperation,
  };

  const number1  = getValidInput(numberMsg, validNumber);
  const number2  = getValidInput(numberMsg, validNumber);
  const operator = getValidInput(operatorMsg, validOperation);

  const output = performCalculation(operator, number1, number2);
  reportCalculatorOutcome(output);
}

function performCalculation(operation, number1, number2) {
  let num1 = Number(number1);
  let num2 = Number(number2);
  let op   = Number(operation);

  if (op === 4 && num2 === 0) num2 = handleDivByZero();

  switch (op) {
    case 1:  return num1 + num2;
    case 2:  return num1 - num2;
    case 3:  return num1 * num2;
    case 4:  return num1 / num2;
    default: return 'invalid operation';
  }
}

function reportCalculatorOutcome(output) {
  console.log(`\n------ The result is ${output} ------\n`);
}

function doAnotherCalculation() {
  const messages = {
    prompt: doAnother,
    failed: invalidContinuation,
  };

  const another = getValidInput(messages, validGoAgain);
  return /\b(y|yes)\b/i.test(another);
}


// --- helpers ---
function clearConsole() {
  console.clear();
}

function getInput(msg) {
  return rlsync.question(`${PROMPT} ${msg}`);
}

function report(msg) {
  console.log(`${PROMPT} ${msg}`);
}

function getValidInput(messages, validator) {
  let input = getInput(messages.prompt);
  while (!validator(input)) input = getInput(messages.failed);

  return input;
}

function validNumber(userInput) {
  return /^[-.\d]+$/.test(userInput);
}

function validNonZeroNumber(userInput) {
  const isValidNumber = validNumber(userInput);
  const isZero        = Number(userInput) === 0;

  return !isZero && isValidNumber;
}

function validOperation(userInput) {
  const isValidSymbol = /^[1234]$/.test(userInput);
  const isValidString = /^(add|subtract|multiply|divide)$/i
    .test(userInput);

  return isValidSymbol || isValidString;
}

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}

function handleDivByZero() {
  const divByZeroMsg = {
    prompt: noDivByZero,
    failed: giveNotZeroNum,
  };

  return Number(getValidInput(divByZeroMsg, validNonZeroNumber));
}