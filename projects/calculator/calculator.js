const rlsync = require('readline-sync');
const PROMPT = `>>>`;

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
  report(`Welcome to CALCULATOR! Let's do some math.`);
  report(`------------------------------------------`);
} 

function explainCalculatorApp() {} // TODO

function waitForAcknowledgement() {
  getInput("Hit 'enter' to continue.");
} 

function farewellFromCalculator() {
  report(`----------------------------------------`);
  report(`Thank you for using CALCULATOR! Goodbye.`);
} 


// --- program logic functions ---
function runCalculator() {
  clearConsole();

  const numberMsg = {
    prompt: "Please input any real number: ",
    failed: "That was not a valid number, try again: ",
  };

  const operatorMsg = {
    prompt: `Please enter a valid operation:  
    ${PROMPT} 1 for addition
    ${PROMPT} 2 for subtraction
    ${PROMPT} 3 for multiplication
    ${PROMPT} 4 for division\n`,
    failed: `That was not a valid operation, try again: `,
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
    prompt: "Would you like to do another calculation? (Y/N): ",
    failed: "Sorry, only accepting (Y)es or (N)o. Try again: ",
  };

  const doAnother = getValidInput(messages, validGoAgain);
  return /\b(y|yes)\b/i.test(doAnother);
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
    prompt: `Oh no! You're trying to divide by zero. Please provide a new number: `,
    failed: `Sorry, we need a number that isn't zero for this division: `,
  };

  return Number(getValidInput(divByZeroMsg, validNonZeroNumber));
} 