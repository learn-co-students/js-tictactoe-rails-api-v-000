// Using [x,y] instead of [a,b,c] because of how html is set up
var win_conditions = [[[0,0],[1,0],[2,0]], 
                     [[0,1],[1,1],[2,1]], 
                     [[0,2],[1,2],[2,2]], 
                     [[0,0],[1,1],[2,2]], 
                     [[0,0],[0,1],[0,2]], 
                     [[2,0],[2,1],[2,2]], 
                     [[1,0],[1,1],[1,2]], 
                     [[2,0],[1,1],[0,2]]];
var currentGame = undefined;
var currentTurn = 0;

$(document).ready(function() {
  attachListeners();
})

var attachListeners = function() {
  $("tbody").click(function(e) {
    doTurn(e);
  });

  $("#games").click(function(e) {
    var state = $(e.target).data("state").split(",");
    changeGame(state, $(e.target).data("id"));
  });

  $("#save").click(function() {
    save();
  });

  $("#previous").click(function() {
    showAllGames();
  });

  $("#clear").click(function() {
    clearGame();
  });
}

var doTurn = function(e){
  updateState(e);
  
  if(checkWinner() || tie()) {
    save();
    resetGame();
  } else {
    currentTurn += 1;
  }
}

var updateState = function(e) {
  $(e.target).html(player());
}

var checkWinner = function() {
  for(var i = 0; i < win_conditions.length; i++) {
    if(checkCells(win_conditions[i])) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

var checkCells = function(array) {
  for(let i = 0; i < array.length; i++) {
    var cell_data = $('[data-x="' + array[i][0] + '"][data-y="' + array[i][1] + '"]').html();
    if(cell_data != player()) {
      return false;
    }
  }
  return true;
}

var message = function(message) {
  $("#message").html(message);
}

var tie = function() {
  var tie = true;
  $("td").each(function() {
    // the game can only be tied if board is full
    if ($(this).html() === "") {
      tie = false;
    }
  });

  if (tie) {
    message("Tie game");
  }

  return tie;
}

var clearGame = function() {
  resetGame();
  $("#games").empty();
  $("#message").html("");
}

var changeGame = function(state, id) {
  buildBoard(state);
  currentGame = id;
  currentTurn = getNewCurrentTurn(state);
}

var player = function() {
  return currentTurn % 2 === 0 ? "X" : "O";
}

var resetGame = function() {
  $("td").html("");
  currentTurn = 0;
  currentGame = undefined;
}

var showAllGames = function() {
  $.get("/games").done(function(games) {
    $("#games").empty();

    games["data"].forEach(function(game) {
      $("#games").append($('<li>', {text: game.id, 'data-id': game.id, 'data-state': game.attributes.state}));
    });
  })
}

var getNewCurrentTurn = function(state) {
  var turn = 0;
  state.forEach(function(cell) {
    if(cell != "") {
      turn += 1;
    }
  })
  return turn;
}

var buildBoard = function(state) {
  $("td").each(function(i) {
    $(this).text(state[i]);
  })
}

var getBoard = function() {
  var board = []
  $("td").each(function(i) {
    board.push(this.innerHTML)
  })
  return board;
}

var save = function() {
  var url;
  var method;
  var value = {
    state: getBoard()
  }

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
    data: value,
    success: function(game) {
      currentGame = game.data.id;
    }
  })
}
