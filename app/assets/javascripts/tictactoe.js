const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0;

// attachListeners() must be invoked inside either a $(document).ready() (jQuery)
$(document).ready(function() {
  attachListeners();
});


// When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
function attachListeners() {
  $('td').on("click", function() {
    if (!checkWinner()) {
      doTurn(this);
    };
  });

  $('#save').on('click', function() {
    saveGame();
  });

  $("#previous").on("click", function() {
    previousGames();
  });

  $("#clear").on("click", function() {
    clearGame();
  });
};


// Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
function player() {
  var player = "X";
  if (turn % 2 === 0) {
    player = "X";
  } else {
    player = "O";
  }
  return player;
};


// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.
function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    resetGame();
  } else {
    if (turn === 8) {
      setMessage('Tie game.');
      resetGame();
    } else {
      turn++;
    }
  };
};

function resetGame() {
  currentGame = 0;
  saveGame();
  $('td').empty();
  turn = 0;
  setMessage('');
};

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function updateState(square) {
  var playerToken = player();
  if (square.innerHTML == '') {
    $(square).text(playerToken);
  } else {
    turn --;
  };
};

// Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function checkWinner() {
  var winner = false;
  var board = {};
  var playerToken = player();
  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(position => {
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] != "") {
      setMessage('Player ' + board[position[0]] + ' Won!');
      return winner = true;
    }
  });
  return winner;
};

// Accepts a string and adds it to the div#message element in the DOM.
function setMessage(message) {
  $("div#message").html(message);
};


function saveGame() {
  var state = [];
  var gameState = {};

  $('td').text((index, square) => {
    state[index] = square;
  });

  gameState = {state: state};

  if(currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameState
    });
  } else {
    $.post('/games', gameState, function(game) {
      currentGame = game.data.id;
    });
  };
};


function previousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(createGameButton);
    }
  });
};


function createGameButton(game) {
  $('#games').append(`<button id="game-${game.id}">Game ${game.id}</button><br>`);

  $(`#game-${game.id}`).on('click', function() {
    loadGame(game.id);
  });
};



function loadGame(gameId) {

  $.get(`/games/${gameId}`, function(data) {
    var id = data.data.id;
    var state = data.data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    };
    turn = state.join('').length;
    currentGame = id;
    if (checkWinner()) {
    } else {
      if (turn === 8) {
        setMessage('Tie game.');
      }
    }
  });
};


function clearGame() {
  if (!currentGame) {
    currentGame = 0;
    $('td').empty();
    turn = 0;
  } else {
    resetGame();
  }
};
