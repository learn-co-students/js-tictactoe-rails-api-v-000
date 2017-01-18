$(document).ready(function () {
  attachListeners();
});
var currentGame;
var turn = 0;
var winCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
]

function attachListeners() {
  $('tbody').click(function(event){
    doTurn(event);
  });

  $('#save').click(function(event){
    saveGame();
  });

  $('#previous').click(function(event) {
    getAllGames();
  });

  $('#games').click(function(event) {
    var state = parseState(event)
    changeGame(state, getGameId(event));
  });
}

function parseState(event) {
  return $(event.target).data("state").split(",")
}

function getGameId(event) {
  return $(event.target).data("gameid")
}

function getAllGames() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

function showGames(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGames(game));
  })
  $("#games").html(dom);
}

function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function changeGame(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
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

function saveGame(resetCurrentGame) {
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
        currentGame = data.game_id;
      }
    }
  })
}

function noCellMatch(element) {
  return (element.html() != player())
}

function doTurn(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    saveGame(true);
    reset();
  } else {
    turn += 1;
  }
}

function updateState(event) {
  $(event.target).html(player());
}

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function message(string){
  $('#message').text(string);
}

function checkCells(ary) {
  for(var i = 0; i < ary.length; i++) {
    var winningCombo = ary[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

function checkWinner() {
  for(var i = 0; i < winCombos.length; i++) {
    if(checkCells(winCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function tie() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

function reset(){
  $('td').html("");
  turn = 0;
  currentGame = 0;
}
