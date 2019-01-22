const win_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function player() {
  return window.turn % 2 === 0 ? "X" : "O";
}

function updateState($td) {
  const playerToken = window.player();
  // cannot user innerText bc tests
  $td.innerHTML = playerToken;
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message;
}

function checkWinner() {
  let game = false
  const $grid = document.querySelectorAll("[data-x]");
  const board = Array.from($grid).map($square => $square.innerText);
  const win_combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  win_combos.forEach(function(combo) {
    if (
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]] &&
      board[combo[0]] !== ""
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      game = true
    }
  })
  return game
}

function doTurn() {}

function attachListeners() {}

function checkLine() {}
