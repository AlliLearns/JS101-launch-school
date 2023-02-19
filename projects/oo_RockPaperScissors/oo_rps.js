const readline = require('readline-sync');
const PROMPT = `>>>`;

const ROCK = 'rock';
const PAPER = 'paper';
const SCISSORS = 'scissors';
const SPOCK = 'spock';
const LIZARD = 'lizard';
const PRINT_CHOICES = [ROCK, PAPER, SCISSORS, SPOCK, LIZARD];
const SHORT_FORM_CHOICES = ['r', 'p', 'sc', 'sp', 'l'];

const VALID_OUTCOME = {tie: 0, player: 1, computer: 2};

createRPSGame().runApp();

function createRPSGame() {
  const helpers    = createHelpers();
  const validators = createValidators();
  const gameState  = createGameState();

  function displayWelcome() {
    helpers.clearConsole();
  }

  function displayRules() {
    helpers.getInput(`Press 'Enter' to play the game.`);
    helpers.clearConsole();
  }

  function displayFarewell() {}

  function determineGrandWinner() {

  }

  function reportGrandWinner(winner) {

  }

  function playRound() {
    helpers.clearConsole();
    helpers.report(gameState.scoresToString());
    helpers.getInput(`Player won! Press enter to continue.`);
    gameState.incrementScoreFor(VALID_OUTCOME.player);
  }

  function gameComplete() {
    const scores     = gameState.getScores();
    const neededWins = gameState.neededWins;

    for (let player in scores) {
      if (scores[player] >= neededWins) return true;
    }

    return false;
  }

  function playGame() {
    gameState.resetScores();
    gameState.incrementGame();

    do    { playRound() }
    while (!gameComplete());

    reportGrandWinner(determineGrandWinner());
  }

  function playAgain() {
    while (true) {
      var yesOrNo = helpers.getInput(`Would you like to play again: `);
      if (validators.validGoAgain(yesOrNo)) break;
    }

    return /\b(y|yes)\b/i.test(yesOrNo);
  }

  function runApp() {
    displayWelcome();
    displayRules();

    do    { playGame()  }
    while ( playAgain() );

    displayFarewell();
  }

  const newRPSGame = { runApp };
  return newRPSGame;
}

function createGameState() {
  const ROUNDS_TO_WIN = 3;

  const history = {};
  let gameCount = 0;

  const scores = {
    tie: 0,
    usr: 0,
    cpu: 0,
  };

  function getScores() {
    return {
      player: scores.usr,
      computer: scores.cpu,
    };
  }

  function scoresToString() {
    let str = `${ROUNDS_TO_WIN} wins needed to complete the game.`;

    str +=`\n\n===================================`;
    str += `\nCurrent game number: ${gameCount}`;
    str += `\nPlayer wins:    ${scores.usr} wins`;
    str += `\nComputer wins:  ${scores.cpu} wins`;
    str += `\nNumber of Ties: ${scores.tie} ties`;
    str += `\n===================================\n`;

    return str;
  }

  function historyToString() {}

  function addMoveToHistory(userMove, cpuMove) {
    const currGame = history[gameCount];
    currGame.userMoves.push(userMove);
    currGame.cpuMoves.push(cpuMove);
  }

  function incrementScoreFor(winner) {
    switch (winner) {
      case VALID_OUTCOME.player:   scores.usr++; break;
      case VALID_OUTCOME.computer: scores.cpu++;  break;
      case VALID_OUTCOME.tie:      scores.tie++;  break;
      default: break;
    }
  }

  function incrementGame() {
    gameCount++;
    history[gameCount] = {
      userMoves: [],
      cpuMoves:  [],
    };
  }

  function resetScores() {
    scores.tie = 0;
    scores.usr = 0;
    scores.cpu = 0;
  }

  const newGameState = {
    neededWins: ROUNDS_TO_WIN,
    getScores,
    scoresToString,
    historyToString,
    incrementScoreFor,
    incrementGame,
    addMoveToHistory,
    resetScores,
  };

  return newGameState;
}


function createValidators() {
  function validMove(userInput) {

  }

  function validGoAgain(userInput) {
    return /\b(yes|no|y|n)\b/i.test(userInput);
  }

  const newValidators = {
    validMove,
    validGoAgain,
  };

  return newValidators;
}

function createHelpers() {
  function clearConsole() {
    console.clear();
  }

  function getInput(msg) {
    return readline.question(`${PROMPT} ${msg}`);
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

  const newHelpers = {
    clearConsole,
    getInput,
    report,
    joinOr,
  };

  return newHelpers;
}