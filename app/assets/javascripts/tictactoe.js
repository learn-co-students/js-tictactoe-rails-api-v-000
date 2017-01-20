var turn = 0;

function attachListeners() {
  // called in $(document).ready to attach click handlers
  // click handlers pass params of clicked cell to doTurn()
  $("td").on("click", function() {
    $(this).addClass("current");
    doTurn($(this).data());
    $(this).removeClass("current");
  });
}

function doTurn(cellData) {
  // turn + 1
  // calls updateState() and checkWinner()
  turn++;
  updateState(cellData);
  checkWinner();
}

function updateState(cellData) {
  // calls player(), adds return (x or o) to the clicked cell
  $(".current").html(player());
}

function checkWinner() {
  // checks to see if anyone has won
  // if winner, calls on player to see who won
  // and passes "Player X/O Won" to message()
  var board = {};
  var winCombinations = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];

  $("td").each(function(index) {
    // adds text value of each cell to board
    board[index] = $(this).text();
  });

  for (var i in winCombinations) {
      if ( (board[winCombinations[i][0]] === "X") && (board[winCombinations[i][1]] === "X") && (board[winCombinations[i][2]] === "X") ) {
        message("Player " + player() + " Won");
      } else if ( (board[winCombinations[i][0]] === "O") && (board[winCombinations[i][1]] === "O") && (board[winCombinations[i][2]] === "O") ) {
        message("Player " + player() + " Won");
      }
  }
}

function player() {
  // returns x or o depending on whether turn is odd or even
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(string) {
  // adds the given string to div#message
  $("#message").html(string);
}

$(document).ready(function () {
  attachListeners();
});
