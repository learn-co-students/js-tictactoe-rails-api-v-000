var turn = 0;
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
}

function doTurn(cell) {
  if (cell.textContent === "") {
    updateState(cell);
    turn += 1;
  }
  if (checkWinner()) {
    //save game & reset board
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    resetBoard();
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
    //
    // if (params[:id]) {
    //   $.patch('/games/' + params[:id])
    // }
    // if the game has been saved -- update it
    // else create it
    $.post('/games', function(data) {
      alert("Saved!");
    });
  });
  // previous games button
  $("button#previous").on("click", function() {
    event.preventDefault;
    $.get('/games', function(data) {
      if (data) {
        var games = data;
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
            game.data.attributes.state;
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
