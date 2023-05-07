"use strict";

window.addEventListener("DOMContentLoaded", (event) => {
  checkGamePlaying();
});

const NUM_PLAYERS = 2;
const DICE_CLASSES = {
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
};
const CHANCE_VALUES = {
  0: "1/6",
  1: "1/3",
  2: "1/2",
  3: "5/6",
};

let winningScore = 100;
let currentPlayer = 1;
let scores = [0, 0];
let points = [0, 0];
let turnScore = 0;
let gamePlaying = false;
let diceMesh;
let multiplier = 1;
let diceChance = [1, 6];

function startNewGame(igOrIm) {
  newGame();

  igOrIm === "im" ? toggleMainMenu() : null;
  updateTurnScoreUI();
  seeIfBotIsOn();
}

function newGame() {
  if (scores[0] !== 0 || scores[1] !== 0) {
    document
      .querySelector(`#player${currentPlayer}`)
      .classList.remove("winner");
  }
  document.querySelector(".latest-dice-throw i").className =
    "fa-solid fa-dice-d6";
  scores = [0, 0];
  turnScore = 0;
  currentPlayer = Math.floor(Math.random() * 2) + 1;
  gamePlaying = true;
  highlightCurrentPlayerUI();
  updateDiceMultiplier();
  updateScoresUI();
}

function rollDice(kindaPlayer) {
  if (
    kindaPlayer == "plyr" &&
    document.querySelector("#use-bot-toggle").checked &&
    currentPlayer === 2
  ) {
    return;
  }
  if (gamePlaying) {
    playDiceSound();

    let diceValue = calculateRandomDiceRoll();

    document.querySelector(".latest-dice-throw i").className =
      "fa-solid fa-dice-" + DICE_CLASSES[diceValue];

    turnScore += diceValue * multiplier;

    consequencesOfRoll(diceValue, kindaPlayer);
  }
}

function calculateRandomDiceRoll() {
  return Math.random() < diceChance[0] / diceChance[1]
    ? 1
    : Math.floor(Math.random() * 5) + 2;
}

function consequencesOfRoll(diceValue, kindaPlayer) {
  if (diceValue === 1) {
    failSound();

    turnScore = 0;

    document.querySelector(".latest-dice-throw i").className =
      "fa-solid fa-dice-d6";
    switchPlayers();
    updateScoresUI();
  }
  updateTurnScoreUI();
}

function holdScore(kindaPlayer) {
  if (
    turnScore === 0 ||
    !gamePlaying ||
    (kindaPlayer == "plyr" &&
      document.querySelector("#use-bot-toggle").checked &&
      currentPlayer === 2)
  ) {
    return;
  }

  holdScoreSound();

  scores[currentPlayer - 1] += turnScore;
  turnScore = 0;
  updateScoresUI();
  updateTurnScoreUI();
  if (scores[currentPlayer - 1] >= winningScore) {
    turnScore = 0;
    const winner = document.querySelector(`#player${currentPlayer}`);
    winner.classList.add("winner");
    document.querySelector(".latest-dice-throw i").className =
      "fa-solid fa-crown";

    points[currentPlayer - 1] += 1;
    document.querySelector(
      ".player-points"
    ).textContent = `${points[0]}:${points[1]}`;

    return (gamePlaying = false);
  }

  document.querySelector(".latest-dice-throw i").className =
    "fa-solid fa-dice-d6";
  switchPlayers();
}

function switchPlayers() {
  turnScore = 0;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  highlightCurrentPlayerUI();
  updateTurnScoreUI();
  seeIfBotIsOn();
}

function highlightCurrentPlayerUI() {
  if (currentPlayer === 1) {
    document.querySelector("#player1").classList.remove("currentPlayer");
    return document.querySelector("#player2").classList.add("currentPlayer");
  }
  document.querySelector("#player2").classList.remove("currentPlayer");
  document.querySelector("#player1").classList.add("currentPlayer");
}

function updateScoresUI() {
  scoreUpdater(currentPlayer);
  scoreUpdater(currentPlayer === 1 ? 2 : 1);
}

function scoreUpdater(selectedPlayer) {
  document.querySelector(`#player${selectedPlayer} .player-score`).textContent =
    scores[selectedPlayer - 1];
  document.querySelector(
    `#player${selectedPlayer} .player-current-score`
  ).textContent = turnScore;
}

function updateTurnScoreUI() {
  document.querySelector(
    `#player${currentPlayer} .player-current-score`
  ).textContent = turnScore;
}

function checkGamePlaying() {
  return gamePlaying
    ? document.querySelector("#continue-button").classList.remove("hidden")
    : document.querySelector("#continue-button").classList.add("hidden");
}

function continueGame() {
  toggleMainMenu();
  updateTurnScoreUI();
  updateScoresUI();
}

function toggleSettingsTab() {
  if (!document.querySelector("#credits-tab").classList.contains("hidden")) {
    displayCredits();
  }
  const settingsTab = document.querySelector("#settings-tab");
  settingsTab.classList.toggle("hidden");
}

function updateWinningScore() {
  const value = document.querySelector("#winning-score-input").value;
  winningScore = value;
  const multiplierDOM = document.querySelector("#multiplier-select");
  if (value >= 500) {
    multiplierDOM.options[3].disabled = false;
    return (multiplierDOM.value = "1");
  }
  multiplierDOM.options[3].disabled = true;
  multiplierDOM.value = "1";
}

function updateDiceMultiplier() {
  multiplier = document.querySelector("#multiplier-select").value;
  if (multiplier != 1) {
    document.querySelectorAll(`.multiplier-in-game`).forEach((element) => {
      element.textContent = `x${multiplier}`;
    });
  }
}

function updateOneChance() {
  const multiplierSelected = document.querySelector(
    "#dice-chances-range"
  ).value;
  const zaehler = parseInt(
    CHANCE_VALUES[parseInt(multiplierSelected)].charAt(0)
  );
  const nenner = parseInt(
    CHANCE_VALUES[parseInt(multiplierSelected)].charAt(2)
  );

  document.querySelector(
    "#dice-chances-label"
  ).textContent = `(${zaehler}/${nenner}%)`;
  diceChance[0] = zaehler;
  diceChance[1] = nenner;
}

function displayCredits() {
  if (!document.querySelector("#settings-tab").classList.contains("hidden")) {
    toggleSettingsTab();
  }
  const creditsTab = document.querySelector("#credits-tab");
  return creditsTab ? creditsTab.classList.toggle("hidden") : null;
}

function toggleMainMenu() {
  checkGamePlaying();
  document.querySelector("#main-menu").classList.toggle("hidden");
  if (document.querySelector("#use-bot-toggle").checked) {
    document.querySelector("#player2 .player-name").value = "Bot";
    document.querySelector("#player2 .player-name").disabled = true;
  } else {
    document.querySelector("#player2 .player-name").disabled = false;
    document.querySelector("#player2 .player-name").value = "Player 2";
  }
  if (!document.querySelector("#settings-tab").classList.contains("hidden")) {
    toggleSettingsTab();
  }
  if (!document.querySelector("#info-tab").classList.contains("hidden")) {
    document.querySelector("#info-tab").classList.toggle("hidden");
  }
  if (!document.querySelector("#credits-tab").classList.contains("hidden")) {
    displayCredits();
  }
  return !document.querySelector("#credits-tab").classList.contains("hidden")
    ? displayCredits()
    : null;
}

function displayInfo() {
  const creditsTab = document.querySelector("#info-tab");
  return creditsTab ? creditsTab.classList.toggle("hidden") : null;
}

function seeIfBotIsOn() {
  return currentPlayer === 2 &&
    document.querySelector("#use-bot-toggle").checked
    ? initiateBot()
    : null;
}

function initiateBot() {
  if (currentPlayer !== 2) {
    return;
  }
  let remainingTurns = 4 - scores.indexOf(Math.max(...scores));
  let targetScore =
    remainingTurns === 1
      ? winningScore - scores[0]
      : (winningScore - scores[0]) / remainingTurns;
  turnScore = 0;
  botLogic(targetScore);
}

function botLogic(targetScore) {
  let i = 0;
  const rollInterval = setInterval(() => {
    if (turnScore / multiplier < targetScore && currentPlayer === 2) {
      rollDice("bot");
      i++;
      if (i === 4) {
        clearInterval(rollInterval);
        holdScore("bot");
      }
    } else {
      clearInterval(rollInterval);
      holdScore("bot");
    }
  }, 200);
}
