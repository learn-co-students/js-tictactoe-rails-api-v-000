$(document).ready(function(){
  attachListeners();
});

const WIN_COMBS = [[0,1,2], 
                   [3,4,5], 
                   [6,7,8], 
                   [0,3,6], 
                   [1,4,7], 
                   [2,5,8], 
                   [0,4,8], 
                   [6,4,2]];

var turn = 0;

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(td){
  $(td).text(player());
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message;
}

function checkWinner() {
  let game = false
  const grid = document.querySelectorAll("td");
  const board = Array.from(grid).map(td => td.innerHTML);  
  
  WIN_COMBS.forEach(function(combo) {
    if (
      board[combo[0]] == board[combo[1]] &&
      board[combo[1]] == board[combo[2]] &&
      board[combo[1]] !== ""
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      game = true;
    }
  });
  return game;
}

function doTurn(td) {
  updateState(td);
  turn++;
  if (checkWinner()) {
    // saveGame();
    resetGame();
  } else if (turn === 9) {
    // saveGame();
    setMessage("Tie game.");
    resetGame();
  }
}

function resetGame() {
  const grid = document.querySelectorAll("td");
  const board = Array.from(grid).map(spot => (spot.innerHTML = ""));
  turn = 0;
}

function attachListeners() {
  $("td").on("click", function() {
    if (!$.text(this) && checkWinner() !== true) {
      doTurn(this);
    }
  });
}
