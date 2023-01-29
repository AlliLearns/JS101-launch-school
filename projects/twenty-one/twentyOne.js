const rlsync = require('readline-sync');
const PROMPT = '>>>';

const VALUE_CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const FACE_CARDS  = ['Jack', 'Queen', 'King'];
const ACE_CARD    = ['Ace'];
const BUST_THRESHOLD = 21;
const DEALER_MINIMUM = 17;

const VALID_OUTCOME = {tie: 0, player: 1, dealer: 2};


// const testHand = [
//   { suit: 'hearts', value: 3 },
//   { suit: 'hearts', value: 'Ace' },
//   { suit: 'clubs', value: 'Ace' },
//   { suit: 'hearts', value: 'Queen' },
//   { suit: 'hearts', value: 'King' },
//   { suit: 'hearts', value: 'Jack' },
// ];

// const testWinningHand = [
//   { suit: 'clubs', value: 'Ace' },
//   { suit: 'clubs', value: 'Queen' },
// ];

// const testThresholdHand = [
//   { suit: 'clubs', value: 3 },
//   { suit: 'clubs', value: 7 },
// ];

// const testHands = {
//   playerHand: [],
//   dealerHand: testThresholdHand,
// };

// console.log(renderHandFor("dealer", testThresholdHand));
// console.log(getHandTotal(testWinningHand));
// console.log(dealerTurnLoop(makeNewShuffledDeck(), testHands));


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
  if (!roundComplete)   dealerTurn(deck, hands); 
  finishRound(hands);

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
  report(`Player's turn!`);
  addLineBreak();

  playerTurnLoop(deck, hands);

  const playerBust = bustedHand(hands.playerHand);
  const playerWon  = winningHand(hands.playerHand);

  return playerBust || playerWon;
}

function playerTurnLoop(deck, hands) {
  // TODO; remove side-effects to `hands`
  while (true) {
    const playerHand = hands.playerHand;    
    if (bustedHand(playerHand)) return;
    
    reportHands(hands);
    const hit = askHitOrStay();
    if   (!hit) return;
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

function dealerTurn(deck, hands) {
  report(`Dealer's turn!`);
  addLineBreak();

  dealerTurnLoop(deck, hands);
}

function dealerTurnLoop(deck, hands) {
  const dealerHand = hands.dealerHand;
  const isHidden   = false;
  reportHands(hands, isHidden);

  while (dealerKeepDrawing(dealerHand)) {
    drawCardsFrom(deck, 1, dealerHand);
    reportDealerDraw();
    waitForAcknowledgement();
    reportHands(hands, isHidden);
  }
}

function dealerKeepDrawing(dealerHand) {
  return getHandTotal(dealerHand) < DEALER_MINIMUM;
}

function reportDealerDraw() {
  report(`Dealer drew a card!`);
}

function reportHands(hands, isHidden = true) {
  const dealerHand = hands.dealerHand;
  const playerHand = hands.playerHand;

  console.log(renderHandFor("Dealer", dealerHand, isHidden));
  console.log(renderHandFor("Player", playerHand));
}

function renderHandFor(participant, hand, hidden = false) {
  const total = hidden ? null : getHandTotal(hand);
  let message = `${PROMPT} ${participant} has: (${total ?? "Unknown total"})`;

  hand.forEach((card, idx) => {
    if (idx === hand.length - 1 && hidden) {
      message += `\n${PROMPT}   Unknown card`;
    } else {
      message += `\n${PROMPT}   ${renderCard(card)}`;
    }
  });

  return message;
}

function renderCard(card) {
  if (card) {
    return `${card.value} of ${card.suit}`;
  } else return "(no card to render)";
}

function bustedHand(hand) {
  return getHandTotal(hand) > BUST_THRESHOLD;
}

function winningHand(hand) {
  return getHandTotal(hand) === BUST_THRESHOLD;
}

function finishRound(hands) {
  const playerHand = hands.playerHand;
  const dealerHand = hands.dealerHand;

  let winner = "";
  if (bustedHand(playerHand)) winner = VALID_OUTCOME.dealer;  
  if (bustedHand(dealerHand)) winner = VALID_OUTCOME.player;
  else winner = determineRoundOutcome(playerHand, dealerHand);

  reportRoundOutcome(winner);
}

function determineRoundOutcome(playerHand, dealerHand) {
  const playerTotal = getHandTotal(playerHand);
  const dealerTotal = getHandTotal(dealerHand);

  if (playerTotal > dealerTotal)   return VALID_OUTCOME.player;
  if (playerTotal < dealerTotal)   return VALID_OUTCOME.dealer;
  if (playerTotal === dealerTotal) return VALID_OUTCOME.tie;
  else return "invalid outcome";
}

function reportRoundOutcome(outcome) {
  report(renderRoundOutcome(outcome));
}

function renderRoundOutcome(outcome) {
  switch (outcome) {
    case VALID_OUTCOME.player: return `Player won this round!`;
    case VALID_OUTCOME.dealer: return `Dealer won this round!`;
    case VALID_OUTCOME.tie:    return `This round was a tie!`;
    default:                   return `Invalid round outcome`;
  }
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

function addLineBreak() {
  console.log();
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