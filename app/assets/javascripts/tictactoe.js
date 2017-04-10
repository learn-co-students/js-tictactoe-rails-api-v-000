var turn = 0;
var currentGame;
var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]];

var checkCells = function(combo) {
  for(var i = 0; i < combo.length; i++) {
    var winningCombo = combo[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if(noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      
      message("Player " + player() + " Won!");
      return true;
    };
  };
  return false;
}

var tie = function() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

var noCellMatch = function(element) {
  return (element.html() != player())
}

var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event);
  });
  $("#games").click(function(event) {
    var state = parseState(event);
    swapGame(state, getGameId(event))
  });
  $("#save").click(function() {
    save();
  });
  $("#previous").click(function() {
    getAllGames();
  });
}

var doTurn = function(event) {
  if( cellAvailable(event) ) {
      updateState(event);
      message("");
    } else {
      message("This cell is taken.");
    }
  
  
  if( checkWinner() || tie() ) {
    save(true);
    resetGame();
  } else {
    turn ++;
  }
}

var cellAvailable = function(event) {
  if ( $(event.target).html() === "" ) {
    return true;
  } else {
    return false;
  }
}

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0;
}

var player = function() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

var updateState = function(event) {
  $(event.target).html(player());
}

var message = function(message) {
  $("#message").html(message);
}

var parseState = function(event) {
  return $(event.target).data("state").split(",");
}

var getGameId = function(event) {
  return $(event.target).data("gameid");
}

var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

var findTurn = function(state) {
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
  });
}

$(function() {
  attachListeners();
});