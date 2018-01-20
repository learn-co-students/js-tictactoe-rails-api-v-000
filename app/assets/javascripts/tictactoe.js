$(function() {
  attachListeners();
});

var turn = 0;
var currentGame;

var winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function attachListeners() {
  $('td').on('click', function() {
    if (($(this).text() === "" && !checkWinner()) || fullBoard()) {
      doTurn(this);
    };
  });

  $('#save').on('click', saveGame);
  $('#clear').on('click', clearBoard);
  $('#previous').on('click', showGames);
}

function player() {
  var even = isEven(turn)
  return even ? "X" : "O";
};

function isEven(n) {
  return n % 2 === 0;
};

function updateState(square) {
  $(square).text(player());
};

function setMessage(message) {
  $('#message').text(message);
};

function checkWinner() {
  var board = generateBoard();
  var winner = determineWin(board);
  if (winner) {
    saveGame();
    setMessage("Player " + winner + " Won!");
    return true;
  } else {
    return false;
  };
}

function generateBoard() {
  var cells = $('td');
  var domBoard = [];
  for (var i = 0; i < cells.length; i++) {
    domBoard.push(cells[i].innerHTML);
  };
  return domBoard;
}

function determineWin(board) {
  // creating array of potential winning combos, based on current board
  var combos = [];
  for (var i = 0; i < winningCombinations.length; i++) {
    combos.push([board[winningCombinations[i][0]], board[winningCombinations[i][1]], board[winningCombinations[i][2]]]);
  };

  // determining if any combinations are winning combinations
  var winner = false;
  for (var i = 0; i < combos.length; i++) {
    if(combos[i][0] !== "" && combos[i][0] === combos[i][1] && combos[i][0] === combos[i][2]) {
      winner = combos[i][0];
      break;
    };
  };
  return winner;
}

function doTurn(element) {
  if (fullBoard()) {
    clearBoard();
  }

  updateState(element);
  if (checkWinner()) {
    clearBoard();
  } else if (fullBoard()) {
    saveGame();
    setMessage("Tie game.");
    currentGame = undefined;
  } else {
    turn += 1;
  };
}

function fullBoard() {
  var board = generateBoard();
  for (var i = 0; i < board.length; i++) {
    if (board[i] === "") {
      return false;
    };
  };
  return true;
}

function clearBoard() {
  $('td').text("");
  turn = 0;
  currentGame = undefined;
}

function saveGame() {
  var board = generateBoard();
  if (currentGame) {
    $.ajax({
      url: '/games/' + currentGame,
      method: 'PATCH',
      data: {
        state: board
      }
    });
  } else {
    $.post('/games', { state: board }, function(data) {
      var game = data["data"];
      currentGame = Number.parseInt(game.id);
    });
  }
}

function showGames() {
  $.get('/games', function(response) {
    var games = response["data"];

    if (games.length > 0) {
      var gamesDiv = $('#games');
      gamesDiv.empty();
      for (var i = 0; i < games.length; i++) {
        var button = "<button id='game-" + games[i].id + "'>" + games[i].id + "</button><br>";
        gamesDiv.append(button);
        $('#game-' + games[i].id).on('click', loadGame(games[i].id));
      };
    };
  });
}

function loadGame(gameId) {
  return function() {
    $.get('/games/' + gameId, function(e) {
      var board = e["data"]["attributes"]["state"]
      currentGame = parseInt(e["data"]["id"]);
      turn = board.filter(c => c != "").length;
      displayBoard(board);
    });
  }
}

function displayBoard(board) {
  //// This solution was passing mocha.run() and working in the browser but wasn't passing the last test in Terminal...
  // var gameCells = $('td');
  // for (var i = 0; i < gameCells.length; i++) {
  //   gameCells[i].innerText = board[i];
  // }

  index = 0;
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      $('[data-x="' + x + '"][data-y="' + y + '"]').html(board[index]);
      index++;
    };
  };
}
