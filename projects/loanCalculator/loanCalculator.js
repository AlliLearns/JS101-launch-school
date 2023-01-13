const rlsync = require('readline-sync');
const PROMPT = `>>>`;

const {
  doAnother,
  invalidContinuation,
} = require('./messages.json');

runApp();

function runApp() {
  welcomeToLoanCalculator();
  explainLoanCalculator();
  waitForAcknowledgement();

  do    { runLoanCalculator() }
  while (doAnotherCalculation())

  // clearConsole();
  farewellFromLoanCalculator();
}


// --- user experience functions ---
function welcomeToLoanCalculator() {}
function explainLoanCalculator() {}
function waitForAcknowledgement() {}
function farewellFromLoanCalculator() {}


// --- program logic functions ---
function runLoanCalculator() {}

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

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}