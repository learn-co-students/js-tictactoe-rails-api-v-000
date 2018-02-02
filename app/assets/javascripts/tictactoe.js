var turn = 0;
var currentGame = 0;
var WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(cell) {
  var token = player();
  $(cell).text(token);
}

function setMessage(string) {
  $("div#message").text(string);
}

function checkWinner() {
  var board = []
  $("td").text(function(index, square) {
    board[index] = square;
  });

  for(var combo of WIN_COMBINATIONS) {
    if (board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[0]] !== "") {
      setMessage("Player " + board[combo[0]] + " Won!");
      return true;
    }
  }
  return false;
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function doTurn(cell) {
  if (cell.textContent === "") {
    updateState(cell);
    turn += 1;
  }
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function saveGame() {
  var state = [];
  var gameData;

  $("td").text(function(index, square) {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
    });
  }
}

function attachListeners() {
  // each square on the gameboard
  $("td").on("click", function() {
   var tdCell = this;
   doTurn(tdCell);
  });
  // save game button
  $("button#save").on("click", function(event) {
    event.preventDefault();
    saveGame();
  });
  // previous games button
  $("button#previous").on("click", function(event) {
    event.preventDefault;
    $.get('/games', function(data) {
      var games = data;
      if (games.data.length) {
        var $div = $("div#games");
        $div.html("");
        for(var game of games.data) {
          $div.append("<button id='game' data-id='" + game.id + "'>Game " + game.id + "</button>")
        }
        // click on that game to resume
        $("button#game").on("click", function() {
          var id = $(this).data("id");
          $.get("/games/" + id, function(data) {
            var game = data;
            var state = game.data.attributes.state;
            var cells = $("td");
            var i = 0;
            for (var cell of cells) {
              $(cell).text(state[i]);
              i++;
            }
            turn = state.join('').length;
            currentGame = id;
          });
        });
      }
    });
  });
  // clear current game button
  $("button#clear").on("click", function() {
    resetBoard();
  });
}

$(function() { attachListeners() });
