const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function(){
  attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square){
  updateState(square);
  turn++
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
};

function saveGame(){}
function showPreviousGames(){}

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}


function updateState(square){
  var token = player();
  $(square).text(token)
};

function setMessage(string){
  $('#message').text(string)
};

function checkWinner(){
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);
  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    setMessage(`Player ${board[combo[0]]} Won!`);
    return winner = true;
    };
  });
  return winner
};


function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}
