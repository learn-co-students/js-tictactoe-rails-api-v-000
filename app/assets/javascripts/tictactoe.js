const WINNING_COMBOS = [[0,1,2],
[3,4,5],[6,7,8],[0,3,6],[1,4,7],
[2,5,8],[0,4,8],[2,4,6]]
var turn = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if(turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function doTurn(square) {
  updateState(square);
  turn++;
  if(checkWinner()) {
    console.log('We have a winner!');
    resetBoard();
  } else if(turn === 9) {
    message("Tie game");
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    doTurn(this);
  });
  $('#save').on('click', function() {
    saveGame(this);
  });
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text(function(index, square) {
    board[index] = square;
  })

  WINNING_COMBOS.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message("Player " + board[combo[0]] + " Won!");
      return winner = true;
    }
  })
  return winner;
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function message(string) {
  $('#message').text(string);
}

function saveGame(board) {
  // var text = "";
  // $('td').text(function(index, square) {
  //   if(square) {
  //     text += index + square;
  //   } else {
  //     text += index + "_";
  //   }
  // });
  console.log($(board).serialize());

  // $.post('/games', text).done(resetBoard());
}