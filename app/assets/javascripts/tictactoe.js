// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var turn = 0;

$(document).ready(function() {
    attachListeners();
});

function player() {
  if (turn % 2 === 0) {
   return "X";
} else {
  return "O";
 }
}

function updateState(square) {
var currentPlayer = player();
$(square).text(currentPlayer);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  var board = {};

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && !!board[position[0]]) {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
updateState(square);
  turn++;
  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9){
    setMessage("Tie game.")
    resetBoard()
  }
}


function attachListeners() {
  $('td').on('click', function(){
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  })
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGame());
  $('#clear').on('click', () => clearGame());
}

function previousGame() {
  $.ajax({
    type: 'GET',
    url: '/games',
    success: function(data) {

    }
  })
}

function saveGame() {
var $gameDiv = $('#games');

  $.ajax({
    type: 'POST',
    url: '/games',
    success: function(data) {
      $gameDiv.append('test');
    }
  })
}

function resetBoard() {
    $('td').empty();
    turn = 0;
}
