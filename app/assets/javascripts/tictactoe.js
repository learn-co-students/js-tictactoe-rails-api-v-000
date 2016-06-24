var turn = 0;
var winningCombinations = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
  ];
var currentGame;

var attachListeners = function() {
  $('tbody').click(function(event) {
    doTurn(event)
  });
  $('#games').click(function(event) {
    var state = parseState(event);
    swapGame(state, getGameId(event));
  });
  $('#save').click(function(event) {
    save();
  });
  $('#previous').click(function(event) {
    getAllGames();
  });

}
var doTurn = function(event) {
  updateState(event);
  if (checkWinner() || checkTie()) {
    save(true);
    resetGame();
  } else {
    turn ++;
  }
}

var checkWinner = function(array) {
  for (i = 0; i < winningCombinations.length; i++) {
    if (currentCells(winningCombinations[i]) == true) {
      message('Player ' + player() + ' Won!');
      return true;
    }
  }
  return false;
}

var updateState = function(event) {
  $(event.target).html(player());
}

var player = function() {
  if ( turn % 2 == 0) {
    return 'X';
  }
  else {
    return 'O';
  }
}

var currentCells = function(array) {
  for(var i = 0; i < array.length; i++) {
    var winningCombination = array[i];
    var x = winningCombination[0];
    var y = winningCombination[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

var checkTie = function() {
  var tie = true;
  $('td').each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie) message("Tie game");
  return tie;
}

var noCellMatch = function(selector) {
  return (selector.html() != player());
}

var message = function(string) {
  $('#message').html(string)
}

var resetGame = function() {
  $('td').html('');
  turn = 0;
}

var parseState = function(event) {
  return $(event.target).data("state").split(",")
}
var getGameId = function(event) {
  return $(event.target).data("gameid")
}

var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}
var getMarks = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

var save = function(resetCurrentGame) {
  var url, method;
  if(currentGame) {
    url = '/games/' + currentGame
    method = 'PATCH'
  }
  else {
    url = '/games'
    method = 'POST'
  }

  $.ajax({
    url: url,
    method: method,
    datatype: 'json',
    data: {
      game: {
        state: getMarks()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      }
      else {
        currentGame = data.game.id;
      }
    }
  })
}
