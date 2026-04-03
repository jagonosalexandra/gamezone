const board = document.getElementById("game-board");
const squares = document.getElementsByClassName("square");
const players = ['X', 'O'];
let currentPlayer = players[0];

const message = document.getElementById("message");

const winning_combinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
];

const imgPaths = {
    'X': './images/x-image.png',
    'O': './images/o-image.png'
};

for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', () => {
        if (squares[i].dataset.player || message.textContent.includes('wins')) {
            return;
        }

        squares[i].classList.add('taken');
        const img = document.createElement('img');
        img.src = imgPaths[currentPlayer];
        img.alt = currentPlayer;
        squares[i].appendChild(img);

        squares[i].dataset.player = currentPlayer;

        if (checkWin(currentPlayer)) {
            message.textContent = `Game over! ${currentPlayer} wins!`;
            highlightWin(); 
            return;
        }
        
        if (checkTie()) {
            message.textContent = `Game is tied!`;
            return;
        }

        currentPlayer = (currentPlayer === players[0] ? players[1] : players[0]);
        message.textContent = `${currentPlayer}'s turn!`;
    });
}

function checkWin(player) {
    return winning_combinations.some(combination => {
        return combination.every(index => {
            return squares[index].dataset.player === player;
        });
    });
}

function highlightWin() {
    winning_combinations.forEach(combination => {
        const [a, b, c] = combination;
        if (squares[a].dataset.player && 
            squares[a].dataset.player === squares[b].dataset.player && 
            squares[a].dataset.player === squares[c].dataset.player) {
            squares[a].classList.add('winner');
            squares[b].classList.add('winner');
            squares[c].classList.add('winner');
        }
    });
}

function checkTie() {
    return Array.from(squares).every(square => square.innerHTML !== '');
}

function restartButton() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].innerHTML = '';
        squares[i].classList.remove('winner');
        squares[i].classList.remove('taken');
        delete squares[i].dataset.player;
    }
    currentPlayer = players[0];
    message.textContent = `X's turn!`;
}

function returnButton() {
    location.href = "../../index.html";
}