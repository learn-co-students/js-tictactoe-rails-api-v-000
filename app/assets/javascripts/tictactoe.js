// Code your JavaScript / jQuery solution here
var turn = 0;
var board = Array(9).fill("");
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

function position(input) {
  return parseInt(input) - 1;
}

function full() {
  if (board.indexOf("") >= 0) {
    return false;
  } else {
    return true;
  }
}

function taken(board, input) {
  if (board[position(input)] === "X" || board[position(input)] === "O") {
    return true;
  } else {
    return false;
  }
}

function validMove(board, input) {
  if (parseInt(input) >= 1 && parseInt(input) <= 9 && taken(board, input) === false) {
    return true
  } else {
    return false
  }
}

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

function over(board) {
  if (full(board) === true) {
    return true;
  } else {
    return false;
  }
}

function checkWinner() {
  for(var winArray of WIN_COMBINATIONS) {
    if (winArray.every(winIndex => taken(board, winIndex + 1))) {
      var winIndex1 = winArray[0];
      var winIndex2 = winArray[1];
      var winIndex3 = winArray[2];
      if (board[winIndex1] === board[winIndex2] && board[winIndex1] === board[winIndex3]) {
        var winner = board[winIndex1];
        setMessage("Player " + winner + " Won!");
        return winner;
      }
    } else {
      return false;
    }
  }
}

function draw() {
  if (full() && checkWinner() === false) {
    return true;
  }
}

function doTurn(cell) {
  if (cell.textContent === "") {
    updateState(cell);
    if (checkWinner()) {
      // clear content from gameboard
      var cells = $("td")
      for(var i = 0; i < 9; i++) {
        cells[i].innerHTML = "";
      }
      // reset board
      board = Array(9).fill("");
      //reset turn
      turn = 0;
    } else if (draw()) {
      setMessage("Tie game.");
    }
    turn += 1;
  }
}

$(function() {
  // function attachListeners() {
    $("td").on("click", function() {
      var tdCell = this;
      doTurn(tdCell);
    });
    // $("button#save").on("click", function(event) {
    //   event.preventDefault();
    //   if (params[:id]) {
    //     $.patch('/games/' + params[:id])
    //   }
    //   if the game has been saved -- update it
    //   else create it
    //   $.post('/games')
    // });
    // $("button#previous").on("click", function() {});
    // $("button#clear").on("click", function() {});
  // }
});
