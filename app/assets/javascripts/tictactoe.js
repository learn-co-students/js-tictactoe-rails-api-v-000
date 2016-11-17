$(document).ready(function() {
  attachListeners();
});

var turn = 0;
var currentGame;
var winCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
  ];

function attachListeners() {
  $('td').click(function(event) {
    doTurn(event)
  });
  $('#games').click(function(event) {
    var state = getState(event);
    changeGame(state, getGameId(event));
  });
  $('#save').click(function(event) {
    save();
  });
  $('#previous').click(function(event) {
    getGames();
  });
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() || checkTie()) {
    save(true);
    resetGame();
  } else {
    turn ++;
  }
}

function checkWinner(array) {
  for (i = 0; i < winCombos.length; i++) {
    if (current(winCombos[i]) == true) {
      message('Player ' + player() + ' Won!');
      return true;
    }
  }
  return false;
}

function checkTie(){
  var tie = true;
  $('td').each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie) message("Tie game");
  return tie;
}

function updateState(event) {
  $(event.target).html(player());
}

function cellTaken(){
  var currentCell = $(event.target).html()
  return (currentCell == "" ? false : true);
}

function player() {
  return (turn % 2 == 0 ? "X" : "O");
}

function current(winCombos) {
  for(var i = 0; i < winCombos.length; i++) {
    var winCombo = winCombos[i];
    var x = winCombo[0];
    var y = winCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (noMatch(selector)) {
      return false;
    }
  }
  return true;
}

function noMatch(selector) {
  return (selector.html() != player());
}

function message(string) {
  $('#message').html(string)
}

function resetGame() {
  $('td').html('');
  turn = 0;
}

function save(resetCurrentGame) {
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
        state: getChars()
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

function getState(event) {
  return $(event.target).data("state").split(",")
}
function getGameId(event) {
  return $(event.target).data("gameid")
}

function getGames() {
  $.getJSON("/games").done(function(response) {
    displayGames(response.games)
  })
}

function displayGames(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(displayGame(game));
  })
  $("#games").html(dom);
}

function displayGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function changeGame(state, id) {
  placeChars(state);
  currentGame = id;
  turn = currentTurn(state);
}

function currentTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

function placeChars(chars) {
  $("td").each(function(i) {
    $(this).text(chars[i]);
  })
}

function getChars() {
  var chars = []
  $("td").each(function(i) {
    chars.push($(this).text())
  })
  return chars;
}
