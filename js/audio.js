const backgroundSound = new Audio("resources/shortenedBackgroundMusic.mp3");
function switchSound() {
  if (
    document.querySelector("#volume-icon").className ===
    "fa-solid fa-volume-high"
  ) {
    document.querySelector("#volume-icon").className =
      "fa-solid fa-volume-xmark";
    return backgroundSound.pause();
  }
  backgroundSound.play();
  document.querySelector("#volume-icon").className = "fa-solid fa-volume-high";
}

function playDiceSound() {
  return gamePlaying ? new Audio("resources/rollingDice.mp3").play() : null;
}

function holdScoreSound() {
  return gamePlaying ? new Audio("resources/holdCheckpoint.mp3").play() : null;
}

function failSound() {
  return gamePlaying ? new Audio("resources/fail.mp3").play() : null;
}
