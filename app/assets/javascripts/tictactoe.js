var turn = 0;
var currentGameId = 0;
var board = ["", "", "", "", "", "", "", "", ""];
var winCombo = [[0,1,2], [3,4,5], [6,7,8], // horizontal wins
                [0,3,6], [1,4,7], [2,5,8], // vertical wins
                [0,4,8], [2,4,6]]; // diagonal wins

$(document).ready(function() {
  attachListeners();
});

// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements
// When a user clicks on a square on the game board, the event listener should invoke doTurn() function and pass it in the element that was clicked
function attachListeners() {
  const squares = $('td')

  for (var i = 0; i < squares.length; i++) {
    $(squares[i]).on('click', function(event) {
      if ($.text(this) == "" && !checkWinner()) {
        doTurn(this);
      };
    });
  };

  $('#save').on('click', function() {
    saveGame();
  });

  $('#previous').on('click', function() {
    previousGames();
  });

  $('#clear').on('click', function() {
    clearGame();
  });
}

// Returns the token of the player whose turn it is, 'X' when even, '0' when odd
function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  };
}

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board
function updateState(square) {
  var token = ""
  if (player() === 'X') {
    token = 'X';
  } else {
    token = 'O';
  }
  $(square).append(token);
}

// Accepts a string and adds it to the div#message element in the DOM
function setMessage(msg) {
  $('#message').append(msg);
}

// Returns true if current board contains any winning combinations
// If there is a winner, should invoke setMessage(), passing in who won
function checkWinner() {
  var winner = false;

  var squares = $('td')
  squares.text(function(index, td) {
    board[index] = td;
  })

  winCombo.some(function(combo) {
    if (board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[0]] != "") {
      winner = true;
      setMessage("Player " + board[combo[0]] + " Won!");
    };
  });

  return winner;
}

// Increments the turn variable by 1
// Invokes the updateState() function, passing it the element that was clicked
// Invokes the checkWinner() function, determining whether the move results in a winning play
function doTurn(square) {
  updateState(square);

  turn += 1;

  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    clearGame();
  }
}

// When the current game has not yet been saved sends a POST request to the "/games" route
// When the current game already exists in the database sends a PATCH request to the "/games/:id" route
function saveGame() {
  // ex. state = ["X", "X", "O", "", "", "", "", "", ""]
  var state = []

  var squares = $('td')
  squares.text(function(index, square) {
    state.push(square);
  });

  // Create game object
  var gameData = { state: state }

  if (currentGameId) {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + currentGameId,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      currentGameId = game.data.id
      $("#games").append(`<button id="gameid-${currentGameId}">Game: ${currentGameId}</button><br/>`);
      $("#gameid-" + currentGameId).on('click', function(){
        reloadGame(currentGameId);
      });
    });
  }
}

// Sends a GET request to the "/games" route
// When no previously-saved games exist in the database does not add any children to the div#games element in the DOM
// When previously-saved games exist in the database adds those previous games as buttons in the DOM's div#games element
// When previously-saved games exist in the database does not re-add saved games already present in the div#games element when the "previous" button is clicked a second time
function previousGames() {
  $('#games').empty();
  $.get('/games', function(game) {
    //debugger
    for (var i = 0; i < game.data.length; i++) {
      $('#games').append(`<button id="gameid-${game.data[i].id}">Game: ${game.data[i].id}</button><br>`)
      $('#gameid-' + game.data[i].id).on('click', { id: game.data[i].id }, function(data) {
        //debugger
        reloadGame(data.data.id)
      })
    }
  })
}

function reloadGame(gameId) {
  //debugger
  clearGame();
  $.get('/games/' + gameId, function(data) {
    const squares = $('td')

    for (var i = 0; i < data.data.attributes.state.length; i++) {
      $(squares[i]).append(data.data.attributes.state[i])
    }
    currentGameId = data.data.id

    var state = [];
    for (var i = 0; i < data.data.attributes.state.length; i++) {
      if (data.data.attributes.state[i] !== "") {
        //debugger
        state.push(data.data.attributes.state[i]);
      };
    }
    turn = state.length;
  })
}

function clearGame() {
  $('td').empty();
  turn = 0;
  currentGameId = 0;
}
