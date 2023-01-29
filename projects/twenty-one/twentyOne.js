const rlsync = require('readline-sync');
const PROMPT = '>>>';

const VALUE_CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const FACE_CARDS  = ['Jack', 'Queen', 'King'];
const ACE_CARD    = ['Ace'];
const BUST_THRESHOLD = 21;
const DEALER_MINIMUM = 17;

// const testHand = [
//   { suit: 'hearts', value: 3 },
//   { suit: 'hearts', value: 'Ace' },
//   { suit: 'clubs', value: 'Ace' },
//   { suit: 'hearts', value: 'Queen' },
//   { suit: 'hearts', value: 'King' },
//   { suit: 'hearts', value: 'Jack' },
// ];

// console.log(getHandTotal(testHand));

runApp();

function runApp() {
  clearConsole();
  welcomeToTwentyOne();
  explainTwentyOne();
  waitForAcknowledgement();
  
  do     playTwentyOneRound();
  while (playAnotherGame());

  clearConsole();
  farewellFromTwentyOne();
}


// -- user experience functions --
function welcomeToTwentyOne() {}
function explainTwentyOne() {}
function farewellFromTwentyOne() {}

// -- support bestOfFive --
function playBestOfFive() {}


// -- support for playTwentyOneRound -- 
function playTwentyOneRound() {
  const deck = makeNewShuffledDeck();

  const hands = {
    playerHand: drawCardsFrom(deck, 2),
    dealerHand: drawCardsFrom(deck, 2),
  };


  const roundComplete = playerTurn(deck, hands);
  if (!roundComplete)   dealerTurn(deck, dealerHand); 

  // let winner = "";
  // if (bust(playerHand)) winner = 'Dealer';  
  // if (bust(dealerHand)) winner = 'Player';
  // winner = determineRoundOutcome(playerHand, dealerHand);

  // reportRoundOutcome(winner);

  // make deck
  // make hands

  // player turn loop

  // dealer turn loop
  //   show hands and both totals 
  //   if dealer total < 17 => dealer hit, inform dealer hit, wait, continue
  //   if dealer total > 21 => dealer bust, end round with player as winner
  //   else                 => dealer stay, inform dealer stay, wait, break
  
  // determine round winner from scores
  // report round winner 
}

function makeNewShuffledDeck() {
  const suits =  ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'];
  // TODO: use the global constants to generate `values`

  const newDeck = [];

  suits.forEach(suit => {
    values.forEach(value => {
      newDeck.push({suit, value});
    });
  });

  return shuffle(newDeck);
}

function shuffle(arr) {
  const array = [...arr];

  for (let first = array.length - 1; first > 0; first--) {
    let second = Math.floor(Math.random() * (first + 1)); // random index from 0 to i
    [array[first], array[second]] = [array[second], array[first]]; // swap elements
  }

  return array;
}

function drawCardsFrom(deck, numCards = 0, hand = []) {
  for (let i = 0; i < numCards; i++) {
    hand.push(deck.pop());
  }

  return hand;
}


function playerTurn(deck, hands) { 
  letPlayerChoice(deck, hands);

  const playerBust = bustedHand(hands.playerHand);
  const playerWon  = winningHand(hands.playerHand);

  return playerBust || playerWon;
}

function letPlayerChoice(deck, hands) {
  // TODO; remove side-effects to `hands`
  while (true) {
    const playerHand = hands.playerHand;    
    if (bustedHand(playerHand)) break;
    
    reportHands(hands);
    const hit = askHitOrStay();
    if   (!hit) break;
    else drawCardsFrom(deck, 1, playerHand);
  }
}

function askHitOrStay() {
  const hitOrStayMsg = {
    prompt: `Would you like to (h)it or (s)tay: `,
    failed: `Sorry, please enter one of 'hit' or 'stay': `,
  };

  const hit = getValidInput(hitOrStayMsg, validHitOrStay);
  return /\b(h|hit)\b/i.test(hit);
}

function dealerTurn(deck, hand) {}

function reportHands(hands, hidden = true) {
  const dealerHand = hands.dealerHand;
  const playerHand = hands.playerHand;

  const dealerCardOne = renderCard(dealerHand[0]);
  const dealerCardTwo = renderCard(dealerHand[1]);
  const playerCardOne = renderCard(playerHand[0]);
  const playerCardTwo = renderCard(playerHand[1]);

  let dealerHandMsg = "";
  let playerHandMsg = "";

  if (hidden) {
    dealerHandMsg = `Dealer has ${dealerCardOne} and an unknown card.`;
  } else {
    dealerHandMsg = `Dealer has ${dealerCardOne} and ${dealerCardTwo}`;
  }

  const playerTotal = getHandTotal(playerHand);
  playerHandMsg = `Player has ${playerCardOne} and ${playerCardTwo}. (${playerTotal})`

  report(dealerHandMsg);
  report(playerHandMsg);
}

function renderCard(card) {
  return `${card.value} of ${card.suit}`;
}

function bustedHand(hand) {
  return getHandTotal(hand) > BUST_THRESHOLD;
}

function winningHand(hand) {
  return hand === BUST_THRESHOLD;
}

function getHandTotal(hand) {
  const values = hand.map(card => card.value);

  let total = values.reduce((sum, currValue) => {
    if (ACE_CARD.includes(currValue))   return sum + 11;
    if (FACE_CARDS.includes(currValue)) return sum + 10;
    else                                return sum + currValue;
  }, 0);

  const aces = values.filter(value => ACE_CARD.includes(value));
  aces.forEach(_ => { if (total > 21) total -= 10 });

  return total;
}

function determineRoundOutcome(playerHand, dealerHand) {}
function reportRoundOutcome(outcome) {}


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

function getValidInput(messages, validator) {
  let input = getInput(messages.prompt);
  while (!validator(input)) input = getInput(messages.failed);

  return input;
}

function validHitOrStay(userInput) {
  return /\b(hit|stay|h|s)\b/i.test(userInput);
}

function validGoAgain(userInput) {
  return /\b(yes|no|y|n)\b/i.test(userInput);
}