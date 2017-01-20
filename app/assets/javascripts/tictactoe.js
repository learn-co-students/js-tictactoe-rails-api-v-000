var turn = 0;

function attachListeners() {
  // called in $(document).ready to attach click handlers
  // click handlers pass params of clicked cell to doTurn()
  $("td").on("click", function(e) {
    doTurn(e.currentTarget);
    // debugger;
  });
}

function doTurn(cell) {
  // turn + 1
  // calls updateState() and checkWinner()
  updateState(cell);
  debugger;
  if (checkWinner() === false) {
    turn++;
  }

}

function updateState(cell) {
  // calls player(), adds return (x or o) to the clicked cell
  $(cell).html(player());
}

function endGame() {
    $("td").html("");
    turn = 0;
}

function checkWinner() {

  // checks to see if anyone has won
  // if winner, calls on player to see who won
  // and passes "Player X/O Won" to message()
  var board = [];
  var winCombinations = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];

  if ($("td").text().length === 9) {
    message("Tie game");
  } else {
    $("td").each(function() {
      // adds text value of each cell to board
      board.push($(this).text());
    });

    var l = winCombinations.length;
    var wonString = "Player " + player() + " Won!";

    for (var i = 0; i < l; i++) {
      if ( (board[winCombinations[i][0]] === "X") && (board[winCombinations[i][1]]===  "X") && (board[winCombinations[i][2]] === "X") ) {
        return message(wonString);
      } else if ( (board[winCombinations[i][0]] === "O") &&   (board[winCombinations[i][1]] === "O") && (board[winCombinations[i][2]] === "O")  ) {
        return message(wonString);
      }
    }
    return false;
  }
}

function player() {
  // returns x or o depending on whether turn is odd or even
  if ( turn === 0 || turn % 2 === 0 ) {
    return "X";
  } else {
    return "O";
  }
}

function message(string) {
  // adds the given string to div#message
  endGame();
  return $("#message").html(string);

}

$(document).ready(function () {
  attachListeners();
});
