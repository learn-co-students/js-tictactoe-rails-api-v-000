// Variable keeps track of the turn count
var turn = 0;

//This variable contains all of the possible winning combinations of the game.
var winCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], [[2,0],[1,1],[0,2]]];

// Variable tracks the current game
var currentGame;

// function responds to a user's click and calls the appropriate function.
var attachListeners = function() {
  // If a cell is clicked, then a turn is made
  $("td").click(function(event) {
    doTurn(event)
  });
  
  // If a game is clicked then the game is switched.
  $("#games").click(function(event) {
    var state = parseState(event)
    swapGame(state, getGameId(event))
  });

  // If save is clicked then the game is saved.
  $("#save").click(function(event) {
    save();
  });

  // If previous is clicked then the past games are displayed.
  $("button#previous").on("click", getPreviousGames);
}

/* A turn is made if no one has already won the game.
 * If the game is won then it is saved and then the game is reset.
 * Otherwise, the turn counter is incremented and updateState is called. */
var doTurn = function(event) {
  updateState(event);
  if(checkWinner() || tie()) {
    save(true);
    reset();
  } else {
    turn += 1;
  }
}

// Returns the token of the current player.
// If turn count is even then "X" is the player, otherwise "O"
var player = function() {
  if(turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

// Checks to see if someone has won the game.
var checkWinner = function() {
  for(var i = 0; i < winCombos.length; i++) {
    if(checkCells(winCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

// Checks that a winning combination has been made.
var checkCells = function(array) {
  for(var i = 0; i < array.length; i++) {
    var winningCombo = array[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noMatch(selector)) {
      return false;
    }
  }
  return true;
}


var noMatch = function(element) {
  return (element.html() != player())
}

// Checks if there is a tie
var tie = function() {
  var tie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie) message("Tie game");
  return tie;
}

// Updates the state of the board
var updateState = function(event) {
  $(event.target).html(player());
}

// Prints the given message in the message div in the view
var message = function(string) {
   $("#message").html(string);
}

// Resets the game by setting turn to 0 and clearing the board.
var reset = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

// Gets the state
var parseState = function(event) {
  return $(event.target).data("state").split(",")
}

// Gets the game id
var getGameId = function(event) {
  return $(event.target).data("gameid")
}

//Lists previous games
var getPreviousGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

// returns all of the games
var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

// Shows each games
var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

// Switches to a different game
var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

//Finds the turn of the game that has just been switched to, since
// it hasn't been incrementing
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

// Save the game
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
  })
}

$(function() {
  attachListeners()
})