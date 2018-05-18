// tests don't pass with let and const, not optimized for ES6
var turn = 0;
var winCombinations = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[6,4,2]
];

$(function() {
  attachListeners();
});

function isEven(num) {
  return num % 2 === 0;
}

function player() {
  return isEven(turn) == true ? "X" : "O";
}

function updateState(square) {
  $(square).text(player());
}

// function updateState(x, y) {
//   $(`[data-x=${x}][data-y=${y}]`).html(player());
// }

function setMessage(message) {
  $("#message").text(message);
}

function getBoard() {
  let td = $("td");
  let arr = [];
  $.each(td, function(key, value) {
    arr.push(value.innerHTML);
  });
  return arr;
}

function checkWinner() {
  let board = getBoard();
  let won = false;
  winCombinations.find(combo => {
    if (board[combo[0]] != "" && ((board[combo[0]] == board[combo[1]]) && (board[combo[1]] == board[combo[2]]))) {
      won = true;
      setMessage(`Player ${board[combo[0]]} Won!`);
    }
  })
  return won;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    resetBoard();
  }
}

function resetBoard() {
  turn = 0;
  let td = $("td");
  $.each(td, function(key, value) {
    value.innerHTML = "";
  });
  // setMessage("");
}

function attachListeners() {
  $("td").on("click", function() {
    if (!checkWinner() && this.innerText === "") {
      doTurn(this);
    }
  });
}

$("#clear").on("click", resetBoard());
$("#previous").on("click", previousGames());
$("#save").on("click", saveGame());

function saveGame() {
  console.log(this);
}

function previousGames() {

}
