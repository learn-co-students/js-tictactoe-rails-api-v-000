// Code your JavaScript / jQuery solution here
var turn = 0

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(string) {
  document.getElementById("message").innerHTML = string;
}

function checkWinner() {
  let winner = false

  const board = [];
  document.querySelectorAll("td").forEach(function(square) {
    board.push(square.innerHTML);
  });

  const winningCombos = [[board[0], board[1], board[2]], [board[3], board[4], board[5]],
  [board[6], board[7], board[8]], [board[0], board[3], board[6]],
  [board[1], board[4], board[7]], [board[2], board[5], board[8]],
  [board[0], board[4], board[8]], [board[2], board[4], board[6]]]

  winningCombos.forEach(function(combo) {
    let checkX = combo.every(function(square) {
      return square === "X"
    })
    let checkO = combo.every(function(square) {
      return square === "O"
    });

    if (checkX) {
      setMessage("Player X Won!");
      winner = true;
    } else if (checkO) {
      setMessage("Player O Won!");
      winner = true;
    }
  });
  return winner;
}

function doTurn() {
  
}
