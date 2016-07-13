$( document ).ready(function() {
  // alert("Ready");
  attachListeners();
});

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
  $("#games").click(function(event) {
    var state = parseState(event)
    switchGame(state, getGameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getPreviousGames();
  })
  $("#reset").click(function() {
    resetGame();
  })
}

var turn = 0;

var currentGame = 0;

var winningCombos = [
[[0,0],[1,0],[2,0]], 
[[0,1],[1,1],[2,1]], 
[[0,2],[1,2],[2,2]], 
[[0,0],[1,1],[2,2]], 
[[0,0],[0,1],[0,2]], 
[[2,0],[2,1],[2,2]], 
[[1,0],[1,1],[1,2]], 
[[2,0],[1,1],[0,2]]];

function doTurn(event){
  updateState(event);
  if(checkWinner() || checkTie() ) {
    save(true);
    resetGame();
  } else {
    turn ++;
  }
}

function updateState(event) {
  $(event.target).html(player());
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

function checkTie() {
  var tie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie) message("Tie game");
  return tie;
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



function player() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}



function noCellMatch (element) {
  return (element.html() != player())
}


function resetGame() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

function message(message) {
  $("#message").html(message);
}


function parseState(event) {
  return $(event.target).data("state").split(",")
}
function getGameId(event) {
  return $(event.target).data("gameid")
}

function getPreviousGames() {
  $.get('/games', function(data) {
   $('#games').empty();
   data.games.forEach(function(game) {
     gameElement = $('<button>', {'data-state': game.state, 'data-gameid': game.id, text: 'Game ' + game.id});
     $('#games').append(gameElement);
   });
 });
}


function switchGame(state, id) {
  placeToken(state);
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

function placeToken(tokens) {
  $("td").each(function(i) {
    $(this).text(tokens[i]);
  })
}
function getTokens() {
  var tokens = []
  $("td").each(function(i) {
    tokens.push($(this).text())
  })
  return tokens;
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
        state: getTokens()
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




