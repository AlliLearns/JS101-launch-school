const rlsync = require('readline-sync');
const PROMPT = `>>>`;

const {
  getLoanAmount,
  invalidLoanAmount,
  getAPR,
  invalidAPR,
  getLoanDuration,
  invalidLoanDuration,
  doAnother,
  invalidContinuation,
} = require('./messages.json');

runApp();

function runApp() {
  clearConsole()
  welcomeToLoanCalculator();
  explainLoanCalculator();
  waitForAcknowledgement();

  do    { runLoanCalculator() }
  while (doAnotherCalculation());

  clearConsole();
  farewellFromLoanCalculator();
}


// --- user experience functions ---
function welcomeToLoanCalculator() {}
function explainLoanCalculator() {}
function waitForAcknowledgement() {}
function farewellFromLoanCalculator() {}


// --- program logic functions ---
function runLoanCalculator() {
  clearConsole();

  const loanMessages = {
    prompt: getLoanAmount,
    failed: invalidLoanAmount,
  };

  const aprMessages = {
    prompt: getAPR,
    failed: invalidAPR,
  };

  const durationMessages = {
    prompt: getLoanDuration,
    failed: invalidLoanDuration,
  };

  const loan     = getValidInput(loanMessages, validLoanAmount);
  const apr      = getValidInput(aprMessages, validInterestPercent);
  const duration = getValidInput(durationMessages, validLoanDuration);

  const monthlyPayment = calculateMonthlyPayment(loan, apr, duration);
  report(format(monthlyPayment));
}

function calculateMonthlyPayment(loan, interest, months) {
  const annualInterestRate = interest / 100;
  const monthlyInterestRate = annualInterestRate / 12;
  // const months = duration * 12;
  const denominator = (1 - Math.pow((1 + monthlyInterestRate), (-months)));

  if (interest === 0) return loan / months;
  else                return loan * (monthlyInterestRate / denominator );
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

function validLoanAmount(userInput) {
  const isZero     = /^0$/.test(userInput);
  const isPositive = /^[.\d]+$/.test(userInput);

  return !isZero && isPositive;
}

function validInterestPercent(userInput) {
  const isZero     = /^0$/.test(userInput);
  const isPositive = /^[.\d]+$/.test(userInput);
  const isInRange  = Number(userInput) <= 100;

  return isPositive && !isZero && isInRange;
}

function validLoanDuration(userInput) {
  const isZero     = /^0$/.test(userInput);
  const isPositive = /^[.\d]+$/.test(userInput);

  return !isZero && isPositive;
}

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}

function format(monthlyPayment) {
  monthlyPayment = monthlyPayment.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
  });

  return `You'll owe ${monthlyPayment} per month.`;
}