var turn = 0;
var winningCombos = [[[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]],
                     [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]],
                     [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]]];
var currentGame;

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event);
  });
  $("#previous").click(function(event) {
    getAllGames();
  });
  $("#save").click(function() {
    save();
  });
  $("#games").click(function(event) {
    var state = parseState(event);
    switchGame(state, getGameId(event));
  });
}

function save(resetCurrentGame){
  var url, method;
  if (currentGame) {
    url = "/games/" + currentGame;
    method = "PATCH";
  } else {
    url = "/games";
    method = "POST";
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "JSON",
    data: {
      game: {
        state: getTokens()
      }
    },
    success: function(data) {
      if (resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  });
}

function getTokens() {
  var tokens = [];
  $("td").each(function(i) {
    tokens.push($(this).text());
  });
  return tokens;
}

function parseState(event) {
  return ($(event.target).data("state").split(","));
}

function switchGame(state, gameId) {
  placeTokens(state);
  currentGame = gameId;
  turn = getTurn(state);
}

function placeTokens(tokens) {
  $("td").each(function(i) {
    $(this).text(tokens[i]);
  });
}

function getTurn(state) {
  var turn = 0;
  for (var i = 0; i < state.length; i++) {
    if (state[i] === "X" || state[i] === "O") {
      turn++;
    }
  }
  return turn;
}

function getGameId(event) {
  return event.target.innerHTML;
}


function getAllGames() {
  $.get("/games").done(function(response) {
    showAllGames(response);
  });
}

function showAllGames(response) {
var dom = $();
  response.games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $("#games").html(dom);
}

function showGame(game) {
  return $("<li>", {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function doTurn(event) {
  updateState(event);
    if (checkWinner() || tie()) {
      save(true);
      resetGame();
    } else {
      turn++;
    }
}

function updateState(event) {
  // if (event.target.innerHTML === "") {
    $(event.target).html(player());
  //   return true;
  // }
  // return false;
}

function checkWinner() {
  var winning = false;

  winningCombos.forEach(function(combo) {
    var currentCombo = checkCells(combo);
    if (currentCombo.every(winner)) {
      message("Player " + player() + " Won!");
      winning = true;
    }
  });
  return winning;
}

function checkCells(combo) {
  return [$('[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').html(),
  $('[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').html(),
  $('[data-x="' + combo[2][0] + '"][data-y="' + combo[2][1] + '"]').html()];
}

function winner(element, index, array) {
  return element === player();
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

function resetGame() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function message(winner) {
  $("#message").html(winner);
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

$(function() {
  attachListeners();
});
