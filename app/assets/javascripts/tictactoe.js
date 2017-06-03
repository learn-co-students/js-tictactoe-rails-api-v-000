var turn = 0;
var currentGame;

var winningCombinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[2,0],[2,1],[2,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[1,1],[0,2]]
]

function doTurn(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    save(true);
    resetGame();
  } else {
    turn++;
  }
}

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(event) {
  $(event.target).html(player());
}

function checkWinner() {
  for(var i = 0; i < winningCombinations.length; i++) {
    if(checkGameArray(winningCombinations[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function checkGameArray(currentGameArray) {
  for(var i = 0; i < currentGameArray.length; i++) {
    var winner = currentGameArray[i];
    var x = winner[0];
    var y = winner[1];
    var element = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( doesNotMatch(element)) {
      return false;
    }
  }
  return true;
}

function message(message) {
  $("#message").html(message);
}

function tie() {
  var tie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie){
    message("Tie game");
  }
  return tie;
}

function doesNotMatch(element) {
  return (element.html() != player())
}

function resetGame() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

function checkState(event) {
  return $(event.target).data("state").split(",")
}
function gameId(event) {
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

function switchGame(state, id) {
  setMarker(state);
  currentGame = id;
  turn = turnCount(state);
}

function turnCount(state) {
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
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
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
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
  $("#games").click(function(event) {
    var state = checkState(event)
    switchGame(state, gameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getGames();
  })
}

$(function() {
  attachListeners()
})
