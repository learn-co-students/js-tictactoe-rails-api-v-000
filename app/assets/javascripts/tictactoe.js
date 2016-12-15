var turn = 0
var winCombinations = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
  ]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("table").click(function(event) {
    doTurn(event)
  });
  $("#games").click(function(event) {
    var state = parseState(event)
    changeGame(state, getGameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() || tie()) {
    // save(true);
    resetGame();
  } else {
    turn += 1;
  }
}

function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  $(event.target).text(player());
}

function checkWinner() {
  for(var i = 0; i < winCombinations.length; i++) {
    if(board(winCombinations[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function board(winCombinations) {
  for(var i = 0; i < winCombinations.length; i++) {
    var winCombination = winCombinations[i];
    var x = winCombination[0];
    var y = winCombination[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (doesntMatch(selector)) {
      return false;
    }
  }
  return true;
}

function doesntMatch(selector) {
  return (selector.text() != player())
}

function tie() {
  if(!checkWinner() && turn == 8) {
    message("Tie game");
    return true;
  }
}

function message(message) {
  $('#message').text(message);
}

function resetGame() {
  $('td').text("");
  turn = 0;
  currentGame = 0;
}

// Persistence Functionality
