const choices = ["rock", "paper", "scissors"];
const playerDisplay = document.getElementById("player-display");
const computerDisplay = document.getElementById("computer-display");
const resultDisplay = document.getElementById("result-display");
const scoreDisplay = document.getElementById("score-display");
let score = 0;

function playGame(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = "";

    if (playerChoice === computerChoice) {
        result = "IT'S A TIE!";
    } else {
        switch (playerChoice) {
            case "rock":
                result = (computerChoice === "scissors") ? "YOU WIN!" : "YOU LOSE. TRY AGAIN!";
                break;
            case "paper":
                result = (computerChoice === "rock") ? "YOU WIN!" : "YOU LOSE. TRY AGAIN!";
                break;
            case "scissors":
                result = (computerChoice === "paper") ? "YOU WIN!" : "YOU LOSE. TRY AGAIN!";
                break;
        }
    }

    playerDisplay.textContent = `PLAYER: ${playerChoice}`;
    computerDisplay.textContent = `COMPUTER: ${computerChoice}`;
    resultDisplay.textContent = result;

    resultDisplay.classList.remove("green-text", "red-text");
    playerDisplay.classList.remove("hidden");
    computerDisplay.classList.remove("hidden");
    resultDisplay.classList.remove("hidden");

    switch (result) {
        case "YOU WIN!":
            resultDisplay.classList.add("green-text");
            score++;
            scoreDisplay.textContent = score;
            break;
        case "YOU LOSE. TRY AGAIN!":
            resultDisplay.classList.add("red-text");
            break;
    }
}

function returnButton() {
    location.href = '../../index.html';
}

function restartButton() {
    score = 0;
    scoreDisplay.textContent = score;
    
    resultDisplay.classList.remove("green-text", "red-text");
    playerDisplay.classList.add("hidden");
    computerDisplay.classList.add("hidden");
    resultDisplay.classList.add("hidden");
}

window.returnButton = returnButton;
window.restartButton = restartButton;