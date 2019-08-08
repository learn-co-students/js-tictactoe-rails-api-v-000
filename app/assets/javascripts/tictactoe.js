// Code your JavaScript / jQuery solution here
var turn = 0
var board = {};
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function player() {
  if(turn % 2 == 0){
    return "X";
  }else {
    return "O";
  };
};

function updateState(square) {
  $(square).append(player());
}

function setMessage(message) {
  $('#message').append(message);
}

function checkWinner() {
  var winner = false;

  $('td').text(function(index, square) {
    return board[index] = square;
  });

  WINNING_COMBOS.some(function(winCombo) {
    if(board[winCombo[0]] !== "" && board[winCombo[0]] === board[winCombo[1]] && board[winCombo[1]] === board[winCombo[2]]) {
      setMessage(`Player ${board[winCombo[0]]} Won!`)
      return winner = true;
    }
  });
  return winner;
}

function emptyBoard() {
  $('td').empty();
  turn = 0;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if(checkWinner()) {
    emptyBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    emptyBoard();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if($(this).text === "") {
      doTurn(this);
    }
  })
}
