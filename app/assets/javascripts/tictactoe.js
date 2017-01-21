var turn = 0;
var winCombinations = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
var currentGame;

$(function() {
  attachListeners();
})

var doTurn = function(event) {
  // fires when player clicks a cell
  updateState(event);
  checkWinner();
  turn++;
}

var updateState = function(event) {
  // adds X or O to the clicked-on cell
  $(event.target).html(player());
}

var endGame = function() {
  // clears board and restarts game
  saveGame(true);
  $("td").html("");
  turn = -1;
}

var checkTie = function() {
  // checks if all cells are full
  if ($("td").text().length === 9) {
    return true;
  } else {
    return false;
  }
}

var getBoard = function() {
  var board = [];
  $("td").each(function() {
    // adds text value of each cell to board array
    board.push($(this).text());
  });
  return board;
}

var checkWinner = function() {
  // if there is a winner or tie, passes message to message(), returns true
  // if game is not over, returns false

  if (checkTie()) {
    endGame();
    currentGame = 0;
    message("Tie game");
    return true;
  } else {
    var gameBoard = getBoard();
    var l = winCombinations.length;
    var wonString = "Player " + player() + " Won!";

    for (var i = 0; i < l; i++) {
      if ( (gameBoard[winCombinations[i][0]] === "X") && (gameBoard[winCombinations[i][1]]===  "X") && (gameBoard[winCombinations[i][2]] === "X") ) {
        endGame();
        message(wonString);
        return true;
      } else if ( (gameBoard[winCombinations[i][0]] === "O") &&   (gameBoard[winCombinations[i][1]] === "O") && (gameBoard[winCombinations[i][2]] === "O")  ) {
        endGame();
        message(wonString);
        return true;
      }
    }
    return false;
  }
}

var player = function() {
  // returns x or o depending on whether turn is odd or even
  if ( turn % 2 === 0 ) {
    return "X";
  } else {
    return "O";
  }
}

var message = function(string) {
  // adds the given string to div#message
  return $("#message").html(string);
}


var attachListeners = function() {
  // attaches a click handler to the table cell, calls doTurn()
  $("td").click(function(event) {
    doTurn(event);
  });
  $('#save').on('click', function() {
    saveGame(false)
  });
  displayGames();
}

var displayGames = function() {
  // returns a display of all the saved games, just returns true right now
  $('#previous').on('click', function() {
    $.getJSON('/games').done(function(data) {
      $("#games").html("");
      $.each(data.games, function(index, value) {
        $('#games').append("<p><a href='#' class='game' data-id='" + value.id + "'>Game " + value.id + "</a></p>")
        attachLinks()
      })
    })
  })
}

var attachLinks = function() {
  $('.game').on('click', function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id")
    $.getJSON('/games/' + id).done(function(data) {
      var state = data.game.state;
      turn = state.join("").length;
      $("td").each(function(index) {
        $(this).html(state[index]);
      })
      currentGame = parseInt(id)

    })
  })
}

var saveGame = function(reset) {
  // Uses an ajax call to /games POST to save the game to the database

    saveState = getState()

    if(currentGame) {
      method = "PATCH"
      url =  "/games/" + currentGame
    } else {
      method = "POST"
      url = "/games"
    }
    $.ajax({
      method: method,
      url: url,
      data: {
        game: {
          state: saveState
        }
      },
      success: function(data) {
        if(reset) {
          currentGame = null;
        } else {
          currentGame = data.game.id
        }
        message("Game Saved");
      }
    })
}

var getState = function() {
  var state = []
  $('td').each(function(s) {
    state.push($(this).text())
  })
  return state
}
