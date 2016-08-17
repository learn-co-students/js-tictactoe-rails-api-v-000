var turn = 0;
var currentGame = 0;
var winCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]]
];

function attachListeners() {
  $("tbody").on("click", function(event) {
    doTurn(event);
  });
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn++;
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  var playerToken = player();
  var cell = event.target;
  $(cell).html(playerToken);
}

function message(str) {
  $("#message").html(str);
}

function won() {
  for (var n = 0; n < winCombos.length; n++) {
    for (var j = 0; j < winCombos[n].length; j++) {
      var winIndexOne = winCombos[n][j][0];
      var winIndexTwo = winCombos[n][j][1];
      var winCell = $('[data-x="' + winIndexOne + '"][data-y="' + winIndexTwo + '"]');
      if(winCell.html() != player()) {
        return false;
      }
    }
  }
      return true;
}

function checkWinner() {
  if(won()) {
    console.log("You Won!");
    // message("Player " + player() + " Won!");
  } else {
    console.log("You Lost!");
  }
}

$(document).ready(function () {
  attachListeners();
});


