var turn = 0;
var winCombinations = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];

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


var checkWinner = function() {
  // checks to see if the game is over (tied or won)
  // if there is a winner or tie, passes message to message()

  if (checkTie()) {
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
        message(wonString);
        return true;
      } else if ( (board[winCombinations[i][0]] === "O") &&   (board[winCombinations[i][1]] === "O") && (board[winCombinations[i][2]] === "O")  ) {
        message(wonString);
        return true;
      }
    }
    return false;
  }
}

var player = function() {
  // returns x or o depending on whether turn is odd or even
  if ( turn === 0 || turn % 2 === 0 ) {
    return "X";
  } else {
    return "O";
  }
}

var message = function(string) {
  // adds the given string to div#message
  endGame();
  return $("#message").html(string);

}

var attachListeners = function() {
  // called in $(document).ready to attach click handlers
  // click handlers pass params of clicked cell to doTurn()
  $("td").click(function(event) {
    doTurn(event);
  });
}

$(function() {
  attachListeners();
})
