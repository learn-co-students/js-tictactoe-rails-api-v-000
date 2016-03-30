var turn = 1;
var winCombos = [
[[0,0], [1,0], [2,0]],
[[0,1], [1,1], [2,1]],
[[0,2], [1,2], [2,2]],
[[0,0], [0,1], [0,2]],
[[1,0], [1,1], [1,2]],
[[2,0], [2,1], [2,2]],
[[0,0], [1,1], [2,2]],
[[0,2], [1,1], [2,0]]];

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {

}

function checkWinner(cell) {

  for (var i = 0; i < winCombos.length; i++) {
    var combo = winCombos[i];

    var currentBoard = [];
    $.each(combo, function(i, position){
      var x = position[0],
          y = position[1],
          board = $('[data-x="' + x +'"][data-y="' + y + '"]').html();

        if (board === player()) {
          currentBoard.push(board);
        }

        if (currentBoard.length === 3) {
          message(player());
        }
    });
  }
}

function newBoard() {
  $('table td').empty();
}

function newGame() {
  newBoard();
  turn = 1;
}

function player() {
  var token = (turn %2 ) ? 'X' : 'O';
  return token;
}

function updateState() {
  $('td').on('click', function() {
    if($(this).html == '') {
      $(this).text = player();
      turn += 1;
    } else {
      alert("This position is taken.")
    }
    checkWinner();

    if(turn == 10) {
      alert("Cats Game!");
      saveGame();
      $('table td').empty(); //removes the content from all td within the table.
      turn = 1; //resets the turn counter to 1 for a new game
    }
  });
}

