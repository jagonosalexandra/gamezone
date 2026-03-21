import { WORDS } from './words.js';

const MAX_ROWS = 6;
const WORD_LENGTH = 5;
const VALID_WORDS = WORDS.filter(w => w.length === WORD_LENGTH);

let targetWord = '';
let currentRow = 0;
let currentCol = 0;
let currentGuess = [];
let gameOver = false;

const board   = document.getElementById('game-board');
const message = document.getElementById('message');

function initBoard() {
    board.innerHTML = '';
    for (let r = 0; r < MAX_ROWS; r++) {
        const row = document.createElement('div');
        row.classList.add('board-row');
        for (let c = 0; c < WORD_LENGTH; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${r}-${c}`;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function chooseWord() {
    return VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)].toLowerCase();
}

function addLetter(letter) {
    if (currentCol >= WORD_LENGTH || gameOver) return;
    currentGuess.push(letter.toLowerCase());
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = letter.toUpperCase();
    cell.classList.add('filled');
    currentCol++;
}

function deleteLetter() {
    if (currentCol <= 0 || gameOver) return;
    currentCol--;
    currentGuess.pop();
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = '';
    cell.classList.remove('filled');
}

function submitGuess() {
    if (currentCol < WORD_LENGTH) {
        showMessage('Not enough letters!', true);
        shakeRow(currentRow);
        return;
    }

    const guess = currentGuess.join('');
    const result = checkGuess(guess);

    colorRow(result, guess);

    if (guess === targetWord) {
        setTimeout(() => {
            showMessage('Brilliant! 🎉');
            bounceRow(currentRow);
        }, WORD_LENGTH * 120 + 100);
        gameOver = true;
        return;
    }

    currentRow++;
    currentCol = 0;
    currentGuess = [];

    if (currentRow >= MAX_ROWS) {
        setTimeout(() => {
            showMessage(`The word was "${targetWord.toUpperCase()}"`);
        }, WORD_LENGTH * 120 + 100);
        gameOver = true;
    }
}

function checkGuess(guess) {
    const result    = Array(WORD_LENGTH).fill('incorrect');
    const targetArr = targetWord.split('');
    const guessArr  = guess.split('');

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i]    = 'correct';
            targetArr[i] = null;
            guessArr[i]  = null;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArr[i] === null) continue;
        const idx = targetArr.indexOf(guessArr[i]);
        if (idx !== -1) {
            result[i]     = 'semi-correct';
            targetArr[idx] = null;
        }
    }

    return result;
}

function colorRow(result, guess) {
    for (let c = 0; c < WORD_LENGTH; c++) {
        const cell   = document.getElementById(`cell-${currentRow}-${c}`);
        const delay  = c * 120;

        setTimeout(() => {
            cell.classList.add('flip');
            setTimeout(() => {
                cell.classList.add(result[c]);
            }, 150);
        }, delay);

        const letter = guess[c].toUpperCase();
        const keyBtn = document.querySelector(`.letter-button[data-key="${letter}"]`);
        if (keyBtn) {
            const priority = { correct: 3, 'semi-correct': 2, incorrect: 1 };
            const current  = keyBtn.dataset.status;
            if (!current || priority[result[c]] > priority[current]) {
                setTimeout(() => {
                    keyBtn.dataset.status = result[c];
                }, delay + 300);
            }
        }
    }
}

function shakeRow(row) {
    for (let c = 0; c < WORD_LENGTH; c++) {
        const cell = document.getElementById(`cell-${row}-${c}`);
        cell.classList.add('shake');
        cell.addEventListener('animationend', () => cell.classList.remove('shake'), { once: true });
    }
}

function bounceRow(row) {
    for (let c = 0; c < WORD_LENGTH; c++) {
        const cell = document.getElementById(`cell-${row}-${c}`);
        setTimeout(() => {
            cell.classList.add('bounce');
            cell.addEventListener('animationend', () => cell.classList.remove('bounce'), { once: true });
        }, c * 100);
    }
}

let messageTimer = null;
function showMessage(msg, temporary = false) {
    clearTimeout(messageTimer);
    message.textContent = msg;
    message.classList.add('visible');
    if (temporary) {
        messageTimer = setTimeout(() => {
            message.classList.remove('visible');
        }, 1800);
    }
}

function restartButton() {
    currentRow   = 0;
    currentCol   = 0;
    currentGuess = [];
    gameOver     = false;
    targetWord   = chooseWord();
    message.textContent = '';
    message.classList.remove('visible');
    initBoard();

    document.querySelectorAll('.letter-button').forEach(btn => {
        delete btn.dataset.status;
    });
}

function returnButton() {
    location.href = '../../index.html';
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Enter') {
        submitGuess();
    } else if (e.key === 'Backspace') {
        deleteLetter();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key);
    }
});

document.querySelectorAll('.letter-button').forEach(btn => {
    btn.addEventListener('click', () => {
        if (gameOver) return;
        const key = btn.dataset.key;
        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'DEL') {
            deleteLetter();
        } else {
            addLetter(key);
        }
    });
});

window.restartButton = restartButton;
window.returnButton  = returnButton;

targetWord = chooseWord();
initBoard();