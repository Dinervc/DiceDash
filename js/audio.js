const backgroundSound = new Audio("resources/shortenedBackgroundMusic.mp3");
function switchSound() {
  if (document.querySelector("#volume-icon").className === "fa-solid fa-volume-high") {
    document.querySelector("#volume-icon").className = "fa-solid fa-volume-xmark";
    backgroundSound.pause();
    return;
  }
  backgroundSound.play();
  document.querySelector("#volume-icon").className = "fa-solid fa-volume-high";
}

function playDiceSound() {
  if (gamePlaying) {
    const sound = new Audio("resources/rollingDice.mp3");
    sound.play();
  }
}

function holdScoreSound() {
  if (gamePlaying) {
    const sound = new Audio("resources/holdCheckpoint.mp3");
    sound.play();
  }
}

function failSound() {
  if (gamePlaying) {
    const sound = new Audio("resources/fail.mp3");
    sound.play();
  }
}
