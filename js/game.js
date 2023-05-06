"use strict";

const NUM_PLAYERS = 2;
const ROLL_ANIMATION_FRAMES = 20;
const ROLL_ANIMATION_DURATION_MS = 1000;

let WINNING_SCORE = 100;
let currentPlayer = 1;
let scores = [0, 0];
let roundScore = 0;
let gamePlaying = false;
let diceMesh;
let multiplier = 1;
let diceChance = [1, 6];

const diceClasses = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
};

function newGame() {
  if (scores[0] !== 0 || scores[1] !== 0) {
    document
      .querySelector(`#player${currentPlayer}`)
      .classList.remove("winner");
  }
  document.querySelector(".latest-dice-throw i").className =
    "fa-solid fa-dice-d6";
  scores = [0, 0];
  roundScore = 0;
  currentPlayer = 1;
  gamePlaying = true;
  highlightCurrentPlayer();
  updateDiceMultiplier();
  updateScoresUI();
}

function rollDice() {
  if (gamePlaying) {
    playDiceSound();
    const randomNum = Math.random();
    let diceValue;

    if (randomNum < diceChance[0] / diceChance[1]) {
      diceValue = 1;
    } else {
      diceValue = Math.floor(Math.random() * 5) + 2;
    }

    document.querySelector(".latest-dice-throw i").className =
      "fa-solid fa-dice-" + diceClasses[diceValue];

    roundScore += diceValue * multiplier;

    if (diceValue === 1) {
      roundScore = 0;
      updateRoundScoreUI();
      switchPlayers();
      failSound();
    } else {
      updateRoundScoreUI();
    }
  }
}

function holdScore() {
  if (gamePlaying) {
    if (roundScore === 0) {
      return;
    }
    holdScoreSound();
    scores[currentPlayer - 1] += roundScore;
    roundScore = 0;
    updateScoresUI();
    if (scores[currentPlayer - 1] >= WINNING_SCORE) {
      // game over
      const winner = document.querySelector(`#player${currentPlayer}`);

      winner.classList.add("winner");
      winner.classList.remove("active");

      document.querySelector(".latest-dice-throw i").className =
        "fa-solid fa-crown";

      gamePlaying = false;
    } else {
      document.querySelector(".latest-dice-throw i").className =
        "fa-solid fa-dice-d6";
      switchPlayers();
    }
  }
}

function switchPlayers() {
  roundScore = 0;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  highlightCurrentPlayer();
  updateRoundScoreUI();
}

function highlightCurrentPlayer() {
  if (currentPlayer === 1 ? true : false) {
    document.querySelector("#player1").classList.remove("currentPlayer");
    document.querySelector("#player2").classList.add("currentPlayer");
  } else {
    document.querySelector("#player2").classList.remove("currentPlayer");
    document.querySelector("#player1").classList.add("currentPlayer");
  }
}

function updateScoresUI() {
  // Current player scores
  document.querySelector(`#player${currentPlayer} .player-score`).textContent =
    scores[currentPlayer - 1];
  document.querySelector(
    `#player${currentPlayer} .player-current-score`
  ).textContent = roundScore;

  // Reset other player scores
  document.querySelector(
    `#player${currentPlayer === 1 ? 2 : 1} .player-score`
  ).textContent = scores[currentPlayer === 1 ? 1 : 0];
  document.querySelector(
    `#player${currentPlayer === 1 ? 2 : 1} .player-current-score`
  ).textContent = 0;
}

function updateRoundScoreUI() {
  document.querySelector(
    `#player${currentPlayer} .player-current-score`
  ).textContent = roundScore;
}

window.addEventListener("DOMContentLoaded", (event) => {
  checkGamePlaying();
});

function checkGamePlaying() {
  if (gamePlaying) {
    document.querySelector("#continue-button").classList.remove("hidden");
  } else {
    document.querySelector("#continue-button").classList.add("hidden");
  }
}

// Function to continue the game
function continueGame() {
  // Update the UI
  updateScoresUI();
  updateRoundScoreUI();
  toggleMainMenu();
}

// Function to start a new game
function startNewGame() {
  // Reset the game variables
  newGame();

  // Update the UI
  updateScoresUI();
  updateRoundScoreUI();
  toggleMainMenu();
}

// Function to toggle the settings tab
function toggleSettingsTab() {
  if (!document.querySelector("#credits-tab").classList.contains("hidden")) {
    displayCredits();
  }
  const settingsTab = document.querySelector("#settings-tab");
  settingsTab.classList.toggle("hidden");
}

function updateWinningScore() {
  const value = document.querySelector("#winning-score-input").value;
  WINNING_SCORE = value;
  if (value >= 500) {
    document.querySelector("#multiplier-select").options[3].disabled = false;
    document.querySelector("#multiplier-select").value = "1";
  } else {
    document.querySelector("#multiplier-select").options[3].disabled = true;
    document.querySelector("#multiplier-select").value = "1";
  }
}

function updateDiceMultiplier() {
  multiplier = document.querySelector("#multiplier-select").value;
  document.querySelector(`.multiplier-in-game`).textContent = `x${multiplier}`;
  if (gamePlaying) {
    document.querySelector("#continue-button").classList.remove("hidden");
  } else {
    document.querySelector("#continue-button").classList.add("hidden");
  }
}

const chanceClasses = {
  0: "1/6",
  1: "1/3",
  2: "1/2",
  3: "5/6",
};

function updateOneChance() {
  const multiplierSelected = document.querySelector(
    "#dice-chances-range"
  ).value;
  const zaehler = parseInt(
    chanceClasses[parseInt(multiplierSelected)].charAt(0)
  );
  const nenner = parseInt(
    chanceClasses[parseInt(multiplierSelected)].charAt(2)
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
  if (creditsTab) {
    creditsTab.classList.toggle("hidden");
  }
}

function toggleMainMenu() {
  checkGamePlaying();
  document.querySelector("#main-menu").classList.toggle("hidden");
  if (!document.querySelector("#settings-tab").classList.contains("hidden")) {
    toggleSettingsTab();
  }
  if (!document.querySelector("#credits-tab").classList.contains("hidden")) {
    displayCredits();
  }
}
