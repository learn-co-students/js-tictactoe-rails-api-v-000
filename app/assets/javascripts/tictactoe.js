$(document).ready(function() {
  attachListeners();

});
var currentGame = false;
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
  $('table tr td').on('click', function(event) {
    currentValue = $(this).text();
    if (currentValue != "X" && currentValue != "O") {
      doTurn(event);
    }
  });
  $('#previous').on('click', function() {
    $.get('/games', function(data) {
      $('#games').empty();
      data.games.forEach(function(game) {
        gameElement = $('<li>', {
          'data-state': game.state,
          'data-gameid': game.id,
          text: 'Game ' + game.id
        });
        $('#games').append(gameElement);
      });
    });
  });
  $('#save').on('click', function() {
    save();
  });
  $('#games').on('click', function(event) {
    var state = $(event.target).data('state').split(",");
    var i = 0;
    $('table tr td').each(function() {
      $(this).text(state[i]);
      i++;
    });
    currentGame = $(event.target).data('id');
  });
}

function getCurrentPositions() {
  var currentPositions = []
  $("table tr td").each(function() {
    currentPositions.push($(this).text());
  });
  return currentPositions;
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  checkTie();
  turn += 1;
}

function save() {
  gameRunning = ($('#message').text() == "")
  if (currentGame) {
    var url = "/games/" + currentGame;
    var method = "PATCH";
  } else {
    var url = "/games"
    var method = "POST";
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getCurrentPositions()
      }
    },
    success: function(data) {
      if (gameRunning) {
        currentGame = data.game.id;
      }
    }
  })
}

function player() {
  return (turn % 2 == 0 ? "X" : "O");
}

function updateState(event) {
  $(event.target).text(player())
}

function checkWinner() {
  var winnerFound = false;
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
    save();
    resetGame();
  } else {
    message("");
    return false;
  }
}

function message(text) {
  $('#message').text(text);
}

function checkTie() {
  if (turn == 8 && $('#message').text() == "") {
    message('Tie game');
    save();
    resetGame();
  }
}

function resetGame() {
  $("table tr td").text("");
  turn = -1;
  currentGame = false;
}