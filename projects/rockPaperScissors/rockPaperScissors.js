/* PEDAC  best of five: keep track of player's and computer's wins. When either reaches 3 wins, match is over. 
  PROBLEM
    assume that best of five is the only play option (no "play one round" or "best of five" yet)

  ALGORITHM
    function playBestOfFive
      create `scores` variable and init to { player: 0, computer: 0 } 
      
      while a winner has not been found
        play a round and store `winner` in variable
        update `scores` with round winner information

      declare `grandWinner` and init to return value of `getGrandWinner(scores)`
      report grand winner


    helper function winnerFound(scores)
      if player has greater than or equal ROUNDS_TO_WIN points, return true
      if computer has greater than or equal ROUNDS_TO_WIN points, return true
      else, return false

    helper function updateScores(winner, scores)
      declare `scoresCopy` and make a copy of `scores`
      if `winner` is WINNERS.player, increment `scoresCopy.player`
      if `winner` is WINNERS.computer, increment `scoresCopy.computer`
      return `scoresCopy
    
    helper function getGrandWinner(scores)
      if player has greater than or equal ROUNDS_TO_WIN points, return WINNERS.player
      if computer has greater than or equal ROUNDS_TO_WIN points, return WINNERS.computer
      else, return "No grand winner, there was an error"

    helper function reportGrandWinner(winner)
      declare `winningMessage` and init to "Congrats, the player won!"
      declare `losingMessage` and init to "Aww man, computer won."

      if `winner` is WINNERS.player, print `winningMessage`
      if `winner` is WINNERS.computer, print `losingMessage`
      else print "Something went wrong, no winner was found"
*/


const rlsync = require('readline-sync');
const PROMPT = `>>>`;

const ROCK = 'rock';
const PAPER = 'paper';
const SCISSORS = 'scissors';
const SPOCK = 'spock';
const LIZARD = 'lizard';
const PRINT_CHOICES = [ROCK, PAPER, SCISSORS, SPOCK, LIZARD];

const ROUNDS_TO_WIN = 3;
const WINNERS = { player: 'PLAYER', computer: 'COMPUTER' };

runApp();

function runApp() {
  clearConsole();
  welcomeToRPS();
  explainRPS();
  waitForAcknowledgement();

  do     playRPSRound();
  while (playAnotherGame());

  clearConsole();
  farewellFromRPS();
}

// --- user experience functions ---
function welcomeToRPS() {}
function explainRPS() {}
function farewellFromRPS() {}

// -- program logic functions --
// --- support for bestOfFive ---
function playBestOfFive() {}
function grandWinnerFound() {}
function getGrandWinner() {}
function reportGrandWinner() {}
function updateGameScores() {}

// --- support for playRPSRound ---
function playRPSRound() {
  clearConsole();

  const playerMoveMsg = {
    prompt: `Choose one: ${joinOr(PRINT_CHOICES)}: `,
    failed: `That is not a valid choice, try again: `,
  };

  const playerMove = getValidInput(playerMoveMsg, isRPSOption);
  console.log(playerMove);
}


// --- helpers ---
function clearConsole() {
  console.clear();
}

function waitForAcknowledgement() {

}

function getInput(msg) {
  return rlsync.question(`${PROMPT} ${msg}`);
}

function joinOr(arr, delimiter = ', ', word = 'or') {
  switch (arr.length) {
    case 0: return '';
    case 1: return `${arr[0]}`;
    case 2: return arr.join(` ${word} `);
    default:
      return arr.slice(0, arr.length - 1).join(delimiter) +
             ` ${word} ${arr[arr.length - 1]}`;
  }
}

function report(msg) {
  console.log(`${PROMPT} ${msg}`);
}

function getValidInput(messages, validator) {
  let input = getInput(messages.prompt);
  while (!validator(input)) input = getInput(messages.failed);

  return input;
}

function playAnotherGame() {
  const messages = {
    prompt: `Would you like to play again? (yes/no): `,
    failed: `Invalid input, please enter 'yes' or 'no': `,
  };

  const another = getValidInput(messages, validGoAgain);
  return /\b(y|yes)\b/i.test(another);
}

function isRPSOption(userInput) {
  const VALID_CHOICES = ['r', 'p', 'sc', 'sp', 'l'].concat(PRINT_CHOICES);

  userInput = userInput.toLowerCase();
  const isEmpty = userInput.trim() === '';
  const isRPS = VALID_CHOICES.includes(userInput);

  return !isEmpty && isRPS;
}

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}

/*
  helper function winnerFound(scores)
    return scores.player   >= ROUNDS_TO_WIN || 
           scores.computer >= ROUNDS_TO_WIN;
*/