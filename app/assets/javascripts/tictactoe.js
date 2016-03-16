var turn = 0;

var winningCombos = [
  ['[data-x="0"][data-y="0"]','[data-x="1"][data-y="0"]','[data-x="2"][data-y="0"]'], //[[0,0],[1,0],[2,0]],
  ['[data-x="0"][data-y="1"]','[data-x="1"][data-y="1"]','[data-x="2"][data-y="1"]'], //[[0,1],[1,1],[2,1]],
  ['[data-x="0"][data-y="2"]','[data-x="1"][data-y="2"]','[data-x="2"][data-y="2"]'], //[[0,2],[1,2],[2,2]],
  ['[data-x="0"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="2"][data-y="2"]'], //[[0,0],[1,1],[2,2]],
  ['[data-x="0"][data-y="0"]','[data-x="0"][data-y="1"]','[data-x="0"][data-y="2"]'], //[[0,0],[0,1],[0,2]],
  ['[data-x="2"][data-y="0"]','[data-x="2"][data-y="1"]','[data-x="2"][data-y="2"]'], //[[2,0],[2,1],[2,2]],
  ['[data-x="1"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="1"][data-y="2"]'], //[[1,0],[1,1],[1,2]],
  ['[data-x="2"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="0"][data-y="2"]']  //[[2,0],[1,1],[0,2]]
];


function attachListeners() {
  $('[data-x]').click(function() {
    doTurn(this);
  });
}

function doTurn(cell) {
  if ($(cell).text() === "") {
    updateState(cell);
    checkWinner();
    //turn += 1;
  }
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(cell) {
  $(cell).text(player());
}

function checkWinner() {
  var winner;

  $.each(winningCombos, function (index, combo) {
    if ($(combo[0]).text() === player() && $(combo[1]).text() === player() && $(combo[2]).text() === player()) {
      winner = player();
    }
  });

  if (winner) {
    message("Player " + winner + " Won!");
    resetGame();
    return winner;
  } else if (turn > 7) {
    message("Tie game");
    resetGame();
    return 'tie';
  } else {
    turn += 1;
    return false;
  }
}

function message(string) {
  $('#message').text(string);
}

function resetGame() {
  $('td').text("");
  turn = 0;
}

$(document).ready(function() {
  attachListeners();
});
