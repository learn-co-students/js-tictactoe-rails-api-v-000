// Document ready function
$(function() {
  attachListeners();
});

var turn = 0;
var currentGame;
var winCombinations = [
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[0,2], [1,1], [2,0]]
];

// Event Listeners (triggers events upon click)
function attachListeners() {
  $('td').click(function(event) {
    doTurn(event)
  });
  $('#games').click(function(event) {
    var state = $(event.target).data("state").split(",");
    var gameId = $(event.target).data("gameid");
    loadGame(state, gameId);   // loads game based on retrieved state and id
  });
  $('#save').click(function(event) {
    save();
  });
  $('#previous').click(function(event) {
    retrieveOldGames();   // shows a list of all previous games
  });
}

function doTurn(event) {
  // updates board state, checks for game over or increases turn
  updateState(event);

  if (checkWinner() || checkTie()) {
    save(true);
    resetBoard();
  } 
  else {
    turn++;
  }
}

function checkWinner(array) {
  for (i = 0; i < winCombinations.length; i++) {
    if (inspectCells(winCombinations[i]) == true) {
      message('Player ' + player() + ' Won!');
      return true;
    }
  }
  return false;
}

function checkTie() {
  // checks to see if there's an empty cell
  // if so, game's still in progress (not a tie)
  var tiedGame = true;

  $('td').each(function() {
    if ($(this).html().length <= 0) {
      tiedGame = false;
    }
  });

  if (tiedGame) {
    message("Tie game");
  }
  return tiedGame;
}

function updateState(event) {
  // fills in selected cell with player's token
  $(event.target).html(player());
}

function player() {
  return turn % 2 == 0 ? "X" : "O";
}

function inspectCells(winCombosArray) {
  // checks each position on the board
  // if all three cells of winCombosArray are the same, game declares winner
  for (var i = 0; i < winCombosArray.length; i++) {
    var winCombo = winCombosArray[i];
    var x = winCombo[0];
    var y = winCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]');
    // ex. [data-x="1"][data-y="2"]
    
    if (noMatch(selector)) {
      return false;
    }
  }
  return true;
}

function noMatch(selector) {
  // checks if cell matches player's token ('X' or 'O')
  // if no match, returns false
  return selector.text() != player();
}

function message(msg) {
  $('#message').html(msg);
}

function resetBoard() {
  $('td').html("");
  turn = 0;
}

function currentTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if (item != "") {
      turn++;
    }
  })
  return turn;
}

// Added persistence //

function retrieveOldGames() {
  $.getJSON('/games').done(function(response) {
    // console.log(response);
    // var games = response["games"];
    var games = response.games;
    var gamesListHtml = "";
    games.forEach(function(game) {
      gamesListHtml += '<li data-state="' + game["state"] + '" data-gameid="' + game["id"] + '" >' + game["id"] + '</li>';
    });
    $('#games').html(gamesListHtml);
  });
}

function save(resetCurrentGame) {
  var url, method;

  if (currentGame) {
    url = '/games/' + currentGame
    method = 'PATCH'
  }
  else {
    url = '/games'
    method = 'POST'
  }

  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: saveBoard()
      }
    },
    success: function(data) {
      if (resetCurrentGame) {
        currentGame = undefined;
      }
      else {
        currentGame = data.game.id;
      }
    }
  })
}

function loadGame(state, id) {
  fillBoard(state);
  currentGame = id;
  turn = currentTurn(state);
}

function saveBoard() {
  // saves state into array
  var stateArr = []
  $('td').each(function(index) {
    stateArr.push($(this).text())
  })
  return stateArr;
}

function fillBoard(tokens) {
  // fills up board based on saved state
  $('td').each(function(index) {
    $(this).text(tokens[index]);
  })
}