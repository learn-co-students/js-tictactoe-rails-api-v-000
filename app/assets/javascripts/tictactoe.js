const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let turnCount = 0;
let currentGame = 0;

$(document).ready(function() {
  $('td').on('click', function() {
    if (!$.text(this) && !wonGame()) {
      turn(this);
    }

  });
  $('#message').text(`Welcome to Tic Tac Toe!`);
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
});

var player = () => turnCount % 2 ? 'O' : 'X';

function turn(square){
  updateBoard(square);
  turnCount++;
  $('#message').text(`Make a Selection`);
  if (wonGame()) {
    resetBoard();
  } else if (turnCount === 9){
    alert(`Cat's Game!`);
    resetBoard();
  }
};

function resetBoard(){
  $('td').empty();
  let turnCount = 0;
  $('#message').text(`Welcome to Tic Tac Toe!`);
};

function updateBoard(square){
  $(square).text(player());
};

function wonGame(){
  let board = {};
  let winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
   if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    $('#message').text(`${board[combo[0]]} Won!`);
     return winner = true;
   }
 });


 function saveGame(){

 };

 function showPreviousGames(){

 };


};
