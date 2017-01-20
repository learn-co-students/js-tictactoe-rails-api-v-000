var turn = 0;

var doTurn = function(event) {
  // turn + 1
  // calls updateState() and checkWinner()
  updateState(event);
  checkWinner();
  turn++;
  // if (checkWinner() === false) {
  //   turn++;
  // }
}

var updateState = function(event) {
  // calls player(), adds return (x or o) to the clicked cell
  $(event.target).html(player());
}

var endGame = function() {
    $("td").html("");
    turn = -1;
}

var checkWinner = function() {
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
