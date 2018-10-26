// Code your JavaScript / jQuery solution here
var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0;
var gameCount = 0;
// let turn = 0;
// let gameCount = 0;

$(document).ready(function(){
  attachListeners();
});


function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
    doTurn(this)
    }
  })
  $('#save').on('click', ()=> saveGame())
  $('#previous').on('click', ()=> previousGames())
  $('#reset').on('click', ()=> resetBoard())
}


function player(){
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square){
  (square).append(player())
}


function setMessage(str){
  $('#message').append(str)
}


function checkWinner(){
	var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBINATIONS.some(function(position){
    if (board[position[0]] == board[position[1]] && board[position[2]] == board[position[1]] && board[position[1]] !== "") {
      saveGame()
      setMessage(`Player ${board[position[0]]} Won!`);
      return winner = true;
      resetBoard()
    }
    else if (!winner && turn === 9){
      setMessage('Tie game.')
      saveGame()
      resetBoard()
    }
  })
  return winner
}



function doTurn(square){
  updateState(square)
  turn++
  checkWinner()
}


function saveGame() {
	var state = Array.from($('td'), e => e.innerText);
	if (gameCount) {
		$.ajax({
			type: 'PATCH',
			url: `/games/${gameCount}`,
			dataType: 'json',
			data: {state: state}
		});
		} else {
			$.post(`/games`, {state: state}, function(game) {
			gameCount = parseInt(game.data.id);
		});
	};
};



function resetBoard() {
  $('td').empty();
  turn = 0;
  gameCount = 0;
}
