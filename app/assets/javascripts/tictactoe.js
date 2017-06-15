$(function() {
  attachListeners()
})

var attachListeners = function() {
  $("tbody").click(function(event) {
    event.preventDefault();
    doTurn(event)
  });
  $("#games").click(function(event) {
    event.preventDefault();
    var state = parseState(event)
    switchGame(state, getGameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    loadGames();
  })
}

var turn = 0;
var winningGame = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
var currentGame;

// Game Functionality

var doTurn = function(event){
  updateState(event);
    if(checkWinner() || tie() ) {
      console.log("Saving!")
      save(true);
      resetGame();
    } else {
      turn += 1;
  }
}

var updateState = function(event) {
  $(event.target).html(player())
}

var checkWinner = function() {
  for(var i = 0; i < winningGame.length; i++) {
    if(checkCells(winningGame[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

var tie = function() {
  var haveTie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      haveTie = false;
    }
  });
  if (haveTie) {
    message("Tie game");
  };
  return haveTie;
}

var save = function(toReset) {
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    // console.log("calling POST to Games");
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
    success: function(response) {
      if(toReset) {
        currentGame = undefined;
      } else {
        currentGame = response.game.id;
      }
    },
    failure: function(response) {
      console.log(response);
    }
  })
}

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

var player = function() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

var checkCells = function(array) {
  for(var i = 0; i < array.length; i++) {
    var winning = array[i];
    var x = winning[0];
    var y = winning[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

var noCellMatch = function(element) {
  return (element.html() != player())
}

var message = function(message) {
  $("#message").html(message);
}

var parseState = function(event) {
  return $(event.target).data("state").split(",")
}
var getGameId = function(event) {
  return $(event.target).data("gameid")
}

var loadGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

var showGames = function(games) {
  var show = $()
  games.forEach(function(game) {
    show = show.add(showGame(game));
  })
  $("#games").html(show);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var switchGame = function(state, id) {
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