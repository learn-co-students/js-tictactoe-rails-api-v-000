var turn = 0;
var currentGame;
var winningCombos = [
  [[0,0],[1,0],[2,0]],
  [[0,0],[1,1],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[2,0],[1,1],[0,2]]]

$(function() {
  attachListeners()
})

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
  $("#games").click(function(event) {
    var state = parseState(event)
    swapGame(state, getGameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
}

function doTurn(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
}

function player() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function message(msg) {
  $("#message").html(msg);
}

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function checkCells(cells) {
  for(var i = 0; i < cells.length; i++) {
    var winningCombo = cells[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

function tie() {
  var tieGame = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tieGame = false;
    }
  });
  if (tieGame) message("Tie game");
  return tieGame;
}

function noCellMatch(e) {
  return (e.html() != player())
}

function resetGame() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

function parseState(event) {
  return $(event.target).data("state").split(",")
}

function updateState(event) {
  $(event.target).html(player());
}

function getGameId(event) {
  return $(event.target).data("gameid")
}

function getAllGames() {
  $.getJSON("/games").done(function(response) {
    showAllGames(response.games)
  })
}

function showAllGames(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function findTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

function swapGame(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

function placeMarks(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}
function getMarks() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

function save(resetCurrentGame) {
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
