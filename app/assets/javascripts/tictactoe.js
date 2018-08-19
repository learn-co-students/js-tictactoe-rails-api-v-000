// Code your JavaScript / jQuery solution here
const winning_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let turn = 0;
let game = 0;

function player() {
  return turn % 2 === 0 ? "O" : "X";
}

function updateState() {}

function setMessage() {}

function checkWinner() {}

function doTurn() {}

function attachListeners() {}
