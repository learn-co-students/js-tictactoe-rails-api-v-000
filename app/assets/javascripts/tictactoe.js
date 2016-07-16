var currentGame;
var tableHash = {
  "0,0": 0,
  "1,0": 1,
  "2,0": 2,
  "0,1": 3,
  "1,1": 4,
  "2,1": 5,
  "0,2": 6,
  "1,2": 7,
  "2,2": 8
}
var winCombinations =  [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

var turn = 0;
var board = ["","","","","","","","",""];

function player() {
  if (turn%2===0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(cellElement) {
  cell = cellElement.data("x") + "," + cellElement.data("y");
  board[tableHash[cell]] = player(turn);
  cellElement.text(player(turn));
}

function checkWinner() {
  var isWinner = winCombinations.map(function(combination) {
    if (board[combination[0]] !== "" && board[combination[0]] === board[combination[1]] && board[combination[0]] === board[combination[2]]) {
      return combination;
    }
  });
  var winner = isWinner.filter(function(n) { return n != undefined } )[0];

  if (winner !== undefined) {
    message("Player " + board[winner[0]] + " Won!");

    resetGame();
  } else {
    return false;
  }
}

function boardSize() {
  return $('td').text().length;
}

function checkTie() {
  if (boardSize() === 9) {
    message("Tie game");
    // save
    resetGame();
  }
}

function resetGame() {
  $('td').text("");
  turn = 0;
  board = ["","","","","","","","",""];
  // start new game on back end
}

function message(str) {
  $("#message").html(str);
}

function doTurn(cellElement) {
  updateState(cellElement);
  turn += 1;
  checkWinner();
  checkTie();
}

function attachListeners() {
  tableListener();
  saveListener();
  previousListener();
}

function tableListener() {
  $("td").on("click", function(e) {
    thisValue = $(this).text();

    if (thisValue === "") {
      doTurn($(this));
    }
  });
}

function saveListener() {
  $("#save").on("click", function(e) {
    saveHandler()
  });
}

function saveHandler() {
// $.post request to save game state
  debugger;
  $.post("/games", { state: board} );
}

function previousListener() {
  $("#previous").on("click", function(e) {
    getAllGames();
  });
}

function getAllGames() {
  $.get("/games");
}

$(function(){
  attachListeners(board);
});
