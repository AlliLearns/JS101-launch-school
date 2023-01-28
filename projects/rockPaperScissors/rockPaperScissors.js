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
const SHORT_FORM_CHOICES = ['r', 'p', 'sc', 'sp', 'l'];

const VALID_OUTCOME = {tie: 0, player: 1, computer: 2};
const ROUNDS_TO_WIN = 3;

runApp();

function runApp() {
  clearConsole();
  welcomeToRPS();
  explainRPS();
  waitForAcknowledgement();

  do     playBestOfFive();
  while (playAnotherGame());

  clearConsole();
  farewellFromRPS();
}

// --- user experience functions ---
function welcomeToRPS() {}
function explainRPS() {}
function farewellFromRPS() {}

// --- support for bestOfFive ---
function playBestOfFive() {
  let scores = {
    player: 0,
    computer: 0,
  };

  // TODO: get rid of the `scores` object. 
  // const incrementPlayerScore   = makeScoreIncrementor();
  // const incrementComputerScore = makeScoreIncrementor();

  // let playerScore = 0;
  // let computerScore = 0;

  while (!grandWinnerFound(scores)) {
    const winner = playRPSRound();
    scores = updateGameScores(winner, scores);

    reportCurrentScores(scores);
    waitForAcknowledgement();
  }

  const grandWinner = getGrandWinner(scores);
  reportGrandWinner(grandWinner);
}

function makeScoreIncrementor() {
  let score = 0;
  return function increment() {
    score++;
    return score;
  }
}

function grandWinnerFound(scores) {
  return scores.player >= ROUNDS_TO_WIN || scores.computer >= ROUNDS_TO_WIN;
}

function getGrandWinner(scores) {
  if (scores.player >= ROUNDS_TO_WIN)   return VALID_OUTCOME.player;
  if (scores.computer >= ROUNDS_TO_WIN) return VALID_OUTCOME.computer;
  
  return "Invalid grand winner";
}

function reportGrandWinner(grandWinner) {
  report(`Grand winner is: ${grandWinner}`);
}

function updateGameScores(winner, scores) {
  const scoresCopy = { ...scores };

  if (winner === VALID_OUTCOME.player)   scoresCopy.player += 1;
  if (winner === VALID_OUTCOME.computer) scoresCopy.computer += 1;

  return scoresCopy;
}

function reportCurrentScores(scores) {
  report(`Player has won ${scores.player} games`);
  report(`Computer has won ${scores.computer} games`);
}

// --- support for playRPSRound ---
function playRPSRound() {
  clearConsole();

  const playerMoveMsg = {
    prompt: `Choose one: ${joinOr(PRINT_CHOICES)}: `,
    failed: `That is not a valid choice, try again: `,
  };

  const userInput  = getValidInput(playerMoveMsg, isRPSOption);
  const playerMove = getFullMoveName(userInput);
  const compChoice = getComputerMove();

  const roundOutcome = determineOutcome(playerMove, compChoice);
  const winningMessage = formatRoundWinner(roundOutcome);

  reportMoveChoices(playerMove, compChoice);
  reportRoundWinner(winningMessage);

  return roundOutcome;
}

function getComputerMove() {
  const randomIndex = Math.trunc(Math.random() * PRINT_CHOICES.length);
  return PRINT_CHOICES[randomIndex];
}

function determineOutcome(player, computer) {
  if (player === computer) return VALID_OUTCOME.tie;

  const WINNING_COMBOS = {
    [ROCK]:     [SCISSORS, LIZARD],
    [PAPER]:    [ROCK, SPOCK],
    [SCISSORS]: [PAPER, LIZARD],
    [SPOCK]:    [SCISSORS, ROCK],
    [LIZARD]:   [PAPER, SPOCK],
  };

  const playerWins = WINNING_COMBOS[player].includes(computer);
  switch (playerWins) {
    case true:  return VALID_OUTCOME.player;
    case false: return VALID_OUTCOME.computer;
    default: return -1;
  }
}

function formatRoundWinner(winner) {
  switch (winner) {
    case VALID_OUTCOME.tie:      return `It's a tie!`;
    case VALID_OUTCOME.player:   return `Congratulations, you win!`;
    case VALID_OUTCOME.computer: return `Computer wins!`;
    default: return `Invalid outcome: ${winner}`;
  }
}

function reportMoveChoices(playerMove, computerMove) {
  report(`Player move was ${playerMove}`);
  report(`Computer move was ${computerMove}`);
}

function reportRoundWinner(winningMessage) {
  report(winningMessage);
}

// --- support for play again ---
function playAnotherGame() {
  const messages = {
    prompt: `Would you like to play again? (yes/no): `,
    failed: `Invalid input, please enter 'yes' or 'no': `,
  };

  const another = getValidInput(messages, validGoAgain);
  return /\b(y|yes)\b/i.test(another);
}

// --- helpers ---
function clearConsole() {
  console.clear();
}

function waitForAcknowledgement() {
  rlsync.question(`Press 'enter' to continue`);
}

function getInput(msg) {
  return rlsync.question(`${PROMPT} ${msg}`);
}

function report(msg) {
  console.log(`${PROMPT} ${msg}`);
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

function getValidInput(messages, validator) {
  let input = getInput(messages.prompt);
  while (!validator(input)) input = getInput(messages.failed);

  return input;
}

function isRPSOption(userInput) {
  const VALID_CHOICES = SHORT_FORM_CHOICES.concat(PRINT_CHOICES);

  userInput = userInput.toLowerCase();
  const isEmpty = userInput.trim() === '';
  const isRPS = VALID_CHOICES.includes(userInput);

  return !isEmpty && isRPS;
}

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}

function getFullMoveName(userInput) {
  const CODE_MAP = {
    //TODO use SHORT_FORM_CHOICES array instead
    [ROCK]: ['r'],
    [PAPER]: ['p'],
    [SCISSORS]: ['sc'],
    [SPOCK]: ['sp'],
    [LIZARD]: ['l'],
  };
  
  for (let choice in CODE_MAP) {
    if (CODE_MAP[choice].includes(userInput)) return choice;
  }

  return userInput.toLowerCase();
}