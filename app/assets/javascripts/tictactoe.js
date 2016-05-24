var turn = 0;
var currentGame = false;
var id = '';
var saves = 0;
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
    saveGame();
    resetAll();
    return;

  } else if(winner === "O") {
    message('Player O Won!');
    saveGame();
    resetAll();
    return;

  } else if(winner === "X") {
    message('Player X Won!');
    saveGame();
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
  id = $(event.target).data("gameid");
  currentGame = true;


  $.get('/games/' + id, function(data) {
      var game = data["game"];
      turn = findTurn(game["state"]);

      for(i = 0; i < 9; i++) {
        $(selector[i]).text(game["state"][i]).val(game["state"][i]);
      }
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

//saves a game with an id, resets board
function saveGame() {
  debugger;
    if(currentGame == false) {
      $.post('/games', currentState()).success(function(response) {});
    } else {
      $.ajax({
        url: '/games/' + id,
        method: "PATCH",
        dataType: "json",
        data: currentState()
      });
    }
    // resetAll();
}

// if you're playing a game, you can hit save and persist a new game.
//if you hit save, and hit it again, it should patch.

// //returns the current board
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
    saves++;
  });

  $("#previous").click(function(event) {
    getGames();
  });

  $("#games").click(function(event) {
    autoLoad(event);
  });

}

function resetBoard() {
  turn = 0;
  selector.forEach(function(selector) {
    $(selector).text('').val('');
  });
}

function resetAll() {
  turn = 0;
  currentGame = '';
  selector.forEach(function(selector) {
    $(selector).text('').val('');
  });
}

function message(message) {
  $("#message").text(message).fadeOut(5000);
}

$(document).ready(function(event) {
  attachListeners();
})
