const rlsync = require('readline-sync');
const PROMPT = `>>>`;

runApp();

function runApp() {
  // clearConsole();
  welcomeUserToCalculator();
  explainCalculatorApp();
  waitForAcknowledgement();
  // clearConsole();

  do    { runCalculator() } 
  while (doAnotherCalculation());

  // clearConsole();
  farewellFromCalculator();
}



function welcomeUserToCalculator() {}
function explainCalculatorApp() {}
function waitForAcknowledgement() {}
function farewellFromCalculator() {}

function runCalculator() {
  console.log('ran calculator');
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
} // side-effect (write stdout)

function getInput(msg) {
  return rlsync.question(`${PROMPT} ${msg}`);
} // side-effect (read stdin)

function getValidInput(messages, validator) {
  let input = getInput(messages.prompt);
  while (!validator(input)) input = getInput(messages.failed);

  return input;
}

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}