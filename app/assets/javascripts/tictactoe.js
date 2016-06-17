$(document).ready(function() {
  attachListeners();

});

var turn = 0;
var winCombinations = [[[0,0],[1,0],[2,0]],
                       [[0,1],[1,1],[2,1]],
                       [[0,2],[1,2],[2,2]],
                       [[0,0],[0,1],[0,2]],
                       [[1,0],[1,1],[1,2]],
                       [[2,0],[2,1],[2,2]],
                       [[0,0],[1,1],[2,2]],
                       [[2,0],[1,1],[0,2]]
                      ]

function attachListeners() {
  $('table tr td').on('click', function(event){
    currentValue = $(this).text();
    if (currentValue != "X" && currentValue != "O")  { doTurn(event); }
  });
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  checkTie();
  turn += 1;
}

function player() {
  return (turn % 2 == 0 ? "X" : "O");
}

function updateState(event) {
  $(event.target).text(player());
}

function checkWinner() {
  var winnerFound = false;
  message("");
  for (i = 0; i < winCombinations.length; i++) {
    var combo = winCombinations[i];
    firstSlot = $('[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').text();
    secondSlot = $('[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').text();
    thirdSlot = $('[data-x="' + combo[2][0] + '"][data-y="' + combo[2][1] + '"]').text();
    if (player() == firstSlot && player() == secondSlot && player() == thirdSlot) {
      winnerFound = true;
      break;
    }
  }
  if (winnerFound) {
    message("Player " + player() + " Won!");
    resetGame();
  } else {
    return false;
  }
}

function message(text) {
  $('#message').text(text);
}

function checkTie() {
  if (turn == 8 && $('#message').text() == "") {
    message('Tie game');
    resetGame();
  }
}

function resetGame() {
  $("table tr td").text("");
  turn = -1;

}
