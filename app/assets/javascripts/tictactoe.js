// STATE (ugh)

var currentGame, turn, board;


// CONSTANTS

var WINNING_COMBOS = [
  // across
  {
    x1: 0, y1: 0,
    x2: 0, y2: 1,
    x3: 0, y3: 2
  },
  {
    x1: 1, y1: 0,
    x2: 1, y2: 1,
    x3: 1, y3: 2
  },
  {
    x1: 2, y1: 0,
    x2: 2, y2: 1,
    x3: 2, y3: 2
  },

  // down
  {
    x1: 0, y1: 0,
    x2: 1, y2: 0,
    x3: 2, y3: 0
  },
  {
    x1: 0, y1: 1,
    x2: 1, y2: 1,
    x3: 2, y3: 1
  },
  {
    x1: 0, y1: 2,
    x2: 1, y2: 2,
    x3: 2, y3: 2
  },

  // diagonal
  {
    x1: 0, y1: 0,
    x2: 1, y2: 1,
    x3: 2, y3: 2
  },
  {
    x1: 2, y1: 0,
    x2: 1, y2: 1,
    x3: 0, y3: 2
  }
];


// BOARD LOGIC

function newBoard() {
  return [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
}

function placeToken(token, x, y) {
  board[y][x] = token;
}

function boardWinner() {
  for (var i = 0; i < WINNING_COMBOS.length; i++) {
    var combo = WINNING_COMBOS[i];
    var first  = board[combo.x1][combo.y1];
    var second = board[combo.x2][combo.y2];
    var third  = board[combo.x3][combo.y3];

    if (first !== '' && first === second && first === third) return first;
  }

  return null;
}


// GAME LOGIC

function newGame() {
  turn = 0;
  currentGame = 0;
  board = newBoard();
  displayState();
}

function player() {
  return (turn % 2 === 0) ? "X" : "O";
}

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();
}

function updateState(event) {
  var cell = event.target.dataset;
  placeToken(player(), cell.x, cell.y);
  displayState();
}

function checkWinner() {
  var winner = boardWinner();
  var boardFull = (turn === 9);

  if (winner || boardFull) {
    message(winner ? "Player " + winner + " Won!" : "Tie game");
    saveGame(true);
    newGame();
    return true;
  }

  return false;
}


// I DON'T KNOW, STATE/REQUEST LOGIC? FUCK IT

function getState() {
  return [].concat.apply([], board);
}

function currentGameData() {
  var gameData = { game: { state: getState() } };
  if (currentGame > 0) gameData.game.id = currentGame;

  return gameData;
}

function createGameWithAjax(successFunc) {
  $.ajax({
    url: '/games',
    method: 'POST',
    data: currentGameData(),
    dataType: 'json',
    success: successFunc
  });
}

function updateGameWithAjax(successFunc) {
  $.ajax({
    url: '/games/' + currentGame,
    method: "PATCH",
    data: currentGameData(),
    dataType: 'json',
    success: successFunc
  });
}

function saveGame(isAutosave) {
  var continueFunc = function(data) {
    console.log('created!');
    var game = data.game || data;
    currentGame = game.id;
  };

  var newGameFunc = function() {
    console.log('autosaved!');
  };

  if (currentGame === 0) {
    createGameWithAjax(isAutosave ? newGameFunc : continueFunc);
  } else {
    updateGameWithAjax(function() { console.log('updated!'); });
  }
}


// UI LOGIC

function displayPreviousGames() {
  $.get('/games').success(function(data) {
    var games = data.games || data;
    var gamePars = $.map(games, function(game) {
      return "<p>" + game.id + " - " + game.state + "</p>";
    });
    $('#games').html(gamePars.join(""));
  });
}

function attachListeners() {
  $('td').on('click', function(event) { doTurn(event); });
  $('#previous').on('click', displayPreviousGames);
  $('#save').on('click', saveGame.bind(null, false));
}

function message(msg) {
  $('#message').text(msg);
}

function displayState() {
  $('td').each(function() {
    $(this).text(board[this.dataset.y][this.dataset.x]);
  });
}


// MAIN

$(attachListeners);
$(newGame);
