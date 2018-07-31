var ID = 0;
var turn = 0;

function player() {
  var player = player || ( turn%2 === 0 ) ? 'X' : 'O';
  return player;
}

function positions() {
  var positions = positions || $("td");
  return positions;
}

function state() {
  var state = state || Array.from(positions()).map(position => position.innerHTML);
  return state;
}

function updateState(position) {
  $(position).text(player());
}

function setMessage(message) {
  $('#message').html("<br>" + message + "<br>");
}

function checkWinner() {
  const winning_combos = [ [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
  var win = false;

  for(const combo of winning_combos) {
    var a = state()[combo[0]],  b = state()[combo[1]], c = state()[combo[2]];
    var empty = a === "" || b === "" || c === "";
    var match = a === b && a === c;

    if(!empty && match) {
      win = true;
      setMessage("Player " + a + " Won!");
      break;
    }
  }
  return win;
}

function checkTie() {
  if(turn === 9) {
    setMessage("Tie game.");
    return true;
  }
}

function checkTurn(moves = state()) {
  turn = 0;
  moves.forEach(function(position) {
    if(position === 'X' || position === 'O') {
      turn++;
    }
  })
}

function resetBoard() {
  turn = 0;
  ID = 0;
  for(const position of positions()) {
    $(position).empty();
  }
}

function gameOver() {
  return checkTie() || checkWinner();
}

function doTurn(position) {
  updateState(position);
  checkTurn();
  if(turn === 1) {
    setMessage("");
  }
  if(gameOver()) {
    saveGame();
    resetBoard();
  }
}

$(document).ready(attachListeners);

function attachListeners() {
  $('button#save').on('click', saveGame);
  $('button#previous').on('click', previousGames);
  $('button#clear').on('click', resetBoard);

  $(positions()).on('click', function() {
    if (this.innerHTML === "" && !gameOver()) {
      doTurn(this);
    }
  });
}

function previousGames() {
  var div = $('#games');
  div.empty();

  var listing = listing || $.getJSON("/games", function(games) {
    $.each(games["data"], function(key, val) {
      var date = new Date(val["attributes"]["updated-at"]).toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "numeric" });
      div.append("<button>" + val["id"] + "</button> " + date + "<br>");
    })
  })
  listing.done(function() {
    $('#games button').on('click', function() {
      loadGame(this);
    })
  })
}

function loadGame(button) {
  $.getJSON("/games/" + button.innerHTML, function(game) {
    ID = Number(game["data"]["id"]);
    var loaded = game["data"]["attributes"]["state"];
    checkTurn(loaded);

    var i = 0;
    for(const position of positions()) {
      $(position).text(loaded[i]);
      i++;
    }
  })
}

function saveGame() {
  if(ID) {
    $.ajax({
      url: "/games/" + ID,
      data: state(),
      type: 'PATCH'
    })
  } else {
    $.post("/games", state(), function(game) {
      ID = Number(game["data"]["id"]);
    });
  }
}
