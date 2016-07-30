
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

$(document).ready(function() {
    attachListeners();
});

var attachListeners = function() {
  $("td").click(function(e) {
    doTurn(e);
  });
  $("#games").click(function(e) {
    var state = parseState(e);
    changeGame(state, getGameId(e));
  });
  $("#save").click(function() {
    save();
  });
  $("#previous").click(function() {
    getAllGames();
  });
};


var doTurn = function(e){
  updateState(e);
  if(checkWinner() || checkTie()) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
};

var player = function(){
  return (turn % 2) == 0 ? "X" : "O";
};

var updateState = function(e) {
  $(e.target).html(player());
};

var checkCells = function(winningCombos) {
  for(var i = 0; i < winningCombos.length; i++) {
    var winningCombo = winningCombos[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
};

var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
};

var checkTie = function() {
  var tie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie) message("Tie game");
  return tie;
};

var noCellMatch = function(cell) {
  return (cell.html() != player())
};

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0;
};

var message = function(string) {
  $("#message").html(string);
};

var parseState = function(e) {
  return $(e.target).data("state").split(",")
};

var getGameId = function(e) {
  return $(e.target).data("gameid")
};

// getAllGames button it should send a get request to /games
var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
};

var showGames = function(games) {
  var dom = $();
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $("#games").html(dom);
};

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};

// sets markers, id, turn
var changeGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
};

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
};

var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
};

var getMarks = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
};

// save posts to /games w a patch to /games/:id
var save = function(resetCurrentGame) {
  if(currentGame) {
    var url = "/games/" + currentGame;
    var method = "PATCH";
  } else {
    var url = "/games";
    var method = "POST";
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
        currentGame = 0;
      } else {
        currentGame = data.game.id;
      }
    }
  })
};
