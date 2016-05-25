var turn = 0;
var currentGame;
var selector = [
  '[data-x="0"][data-y="0"]',
  '[data-x="1"][data-y="0"]',
  '[data-x="2"][data-y="0"]',
  '[data-x="0"][data-y="1"]',
  '[data-x="1"][data-y="1"]',
  '[data-x="2"][data-y="1"]',
  '[data-x="0"][data-y="2"]',
  '[data-x="1"][data-y="2"]',
  '[data-x="2"][data-y="2"]'
]
var winning_combos = [
  //ACROSS
  [selector[0], selector[1], selector[2]],
  [selector[3], selector[4], selector[5]],
  [selector[6], selector[7], selector[8]],
  //DOWN
  [selector[0], selector[3], selector[6]],
  [selector[1], selector[4], selector[7]],
  [selector[2], selector[5], selector[8]],
  //DIAG
  [selector[0], selector[4], selector[8]],
  [selector[2], selector[4], selector[6]]
]

function doTurn(selector) {
  updateState(selector);
  turn += 1;
  checkWinner();
}

function player() {
  return (turn % 2) == 0 ? "X" : "O";
}

function checkWinner() {
  var winner = ''

  winning_combos.find(function(combo) {
    if($(combo[0]).val() === $(combo[1]).val() && $(combo[1]).val() === $(combo[2]).val()) {
      winner = $(combo[0]).val();
    }
  });

  if(turn > 8 && winner === '') {
    message('Tie game');
    saveGame(true);
    resetAll();
    return;

  } else if(winner === "O") {
    message('Player O Won!');
    saveGame(true);
    resetAll();
    return;

  } else if(winner === "X") {
    message('Player X Won!');
    saveGame(true);
    resetAll();
    return;

  } else {
    return false;
  }
}

function getGames() {
  $.get("/games", function(data) {
    var savedGame = '';
    var games = data["games"]

    games.forEach(function(game) {
      savedGame += ('<li data-gameid="' + game["id"] + '">' + game["id"] + '</li>');
    });
    $("#games").html(savedGame);
  });
}

function autoLoad(event) {
  currentGame = $(event.target).data("gameid");

  $.get('/games/' + currentGame, function(data) {
      var game = data["game"];
      turn = findTurn(game["state"]);

      for(i = 0; i < 9; i++) {
        $(selector[i]).text(game["state"][i]).val(game["state"][i]);
      }
      checkWinner();
  });
}

function findTurn(state) {
  var turn = 0;
  state.forEach(function(token) {
    if(token != "") {
      turn++;
    }
  });
  return turn;
}

var saveGame = function(resetGame) {
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
    data: currentState(),
    success: function(response) {
      resetGame ? currentGame = '' : currentGame = response.game.id;
    }
  })
}

var currentState = function() {
  var state = [];
  for(i = 0; i < 9; i++) {
    state.push($(selector[i]).val());
  }
  return {game: {state: state}};
}

function updateState(selector) {
  $(selector).text(player()).val(player());
}

function attachListeners() {
  selector.forEach(function(selector) {
    $(selector).click(function(data) { doTurn(this) });
  });
  $("#save").click(function(event) {
    saveGame();
  });

  $("#previous").click(function(event) {
    getGames();
  });

  $("#games").click(function(event) {
    autoLoad(event);
  });

}

function resetAll() {
  selector.forEach(function(selector) {
    $(selector).text('').val('');
  });
  turn = 0;
  currentGame = '';
}

function message(message) {
  $("#message").text(message).fadeOut(5000);
}

$(document).ready(function(event) {
  attachListeners();
})
