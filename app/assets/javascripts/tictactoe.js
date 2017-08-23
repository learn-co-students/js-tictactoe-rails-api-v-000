// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners();
});

const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];


 // [[[0,0],[1,0],[2,0]],
 // [[0,1],[1,1],[2,1]],
 // [[0,2],[1,2],[2,2]],
 // [[0,0],[1,1],[2,2]],
 // [[0,0],[0,1],[0,2]],
 // [[2,0],[2,1],[2,2]],
 // [[1,0],[1,1],[1,2]],
 // [[2,0],[1,1],[0,2]]];

var turn = 0;

function attachListeners() {
  $('td').on('click', function(){
    if (!checkWinner()) {
      doTurn(this);
    }
  });


  //$(#previous).on('click', function(){
      //list all previous games and add a button to restore
  //})
  //$(#save).on('click', function(){
    //save game in current state
  //})
  $('#clear').on('click', function(){
    clearBoard()
  });
    // clears the game board and starts a new game
  //})
  //
  //
}

function player() {
  return (turn % 2) ? "O" : "X";
}

function doTurn(cell) {
  //increment turn by one
  if ($(cell).is(':empty')) {
    updateState(cell);
    turn += 1;
    if (checkWinner()) {
      clearBoard();
    } else if (turn === 9) {
      message("Tie game.")
    };
  }


}

function updateState(cell) {
  $(cell).text(player())
}

function message(string) {
  $("#message").html(string);
}

function checkWinner() {
  // true if win combination, false if not. if true, invoke a message and pass on "Player X Won!" or "Player O Won!" return WIN_COMBINATIONS
  //board
  var board = [];
  $('td').each(function() {
    board.push($(this).text());
  });
  function combo(win_combination) {
    if (board[win_combination[0]] == board[win_combination[1]] && board[win_combination[0]] == board[win_combination[2]] && (board[win_combination[0]] === "X" || board[win_combination[0]] === "O")) {
      message(`Player ${board[win_combination[0]]} Won!`)
      return true
    } else {
      return false
    }
  };
  if (WIN_COMBINATIONS.find(combo)) {
    return true
  } else {
    return false
  }



//  WIN_COMBINATIONS.detect do |win_combination|
//      @board.cells[win_combination[0]] == @board.cells[win_combination[1]] && //@board.cells[win_combination[0]] == @board.cells[win_combination[2]] && //(@board.cells[win_combination[0]] == "X" || @board.cells[win_combination[0]] == "O")
//    end



}

function full() {
  return state.includes('');
}

function clearBoard() {
  $('td').text('');
  turn = 0;

}
