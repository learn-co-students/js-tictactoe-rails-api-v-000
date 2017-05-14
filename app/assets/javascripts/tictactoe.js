var turn = 0;
var currentGame = 0;
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

function board(winCombinations) {
  for(var i = 0; i < winCombinations.length; i++) {
    var winCombination = winCombinations[i];
    var x = winCombination[0];
    var y = winCombination[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (noMatch(selector)) {
      return false;
    }
  }
  return true;
}

function noMatch(selector) {
  return (selector.html() != player())
}

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event);
  });

  $('#save').on('click', function() {
    save();
  });

  $('#previous').on('click', function() {
    getAllGames();
  });

  $('#games').on('click', function(event) {
    var state = parseState(event);
    changeGame(state, getGameId(event));
  })
}

function doTurn(event) {
  updateState(event)
  if (checkWinner() || tie()) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
}

function updateState(event) {
  $(event.target).html(player());
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

function tie() {
  if(!checkWinner() && turn == 8) {
    message("Tie game");
    console.log("it's a tie");
    return true;
  }
}

function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(string) {
  $('#message').html(string);
}

function resetGame() {
  $('td').html("");
  turn = 0;
  currentGame = 0;
}

function parseState(event) {
  return $(event.target).data("state").split(",")
};

function getGameId(event) {
  return $(event.target).data("gameid")
};

function getAllGames() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
};

function showGames(games) {
  var dom = $();
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $("#games").html(dom);
};

function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};

function changeGame(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
};

function findTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
};

function placeMarks(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
};

function getMarks() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
};

function save(resetCurrentGame) {
  if(currentGame) {
    var url = "/games/" + currentGame;
    var method = "PATCH";
  } else {
    var url = "/games";
    var method = "POST";
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getMarks()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = 0;
      } else {
        currentGame = data.game.id;
      }
    }
  })

}


$(document).ready(function() {
  attachListeners();
});
