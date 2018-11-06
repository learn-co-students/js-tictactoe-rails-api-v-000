// Code your JavaScript / jQuery solution here

// Board -> Game Logic

var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0;
var gameCount = 0;


$(document).ready(function(){
  attachListeners();
});


function player(){
  return turn % 2 === 0 ? 'X' : 'O'
}

// Board -> Game Set Up
function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
    doTurn(this)
    }
  })
  $('#save').on('click', ()=> saveGame())
  $('#previous').on('click', ()=> previousGames())
  $('#clear').on('click', ()=> resetBoard())
}

// Board -> Game logic

function checkWinner(){
	var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBINATIONS.some(function(position){
    if (board[position[0]] == board[position[1]] && board[position[2]] == board[position[1]] && board[position[1]] !== "") {
      saveGame();
      setMessage(`Player ${board[position[0]]} Won!`);
      return winner = true;
      resetBoard();
    }
    else if (!winner && turn === 9){
      setMessage('Tie game.')
      saveGame();
      resetBoard();
    }
  })
  return winner
}


// Board -> Message Handling

function setMessage(str){
  $('#message').append(str)
}

function updateState(square){
  (square).append(player())
}

// Board Click -> Event Handling

function doTurn(spot) {
  updateState(spot)
  turn++
    if (checkWinner() === true) {
      saveGame()
      resetBoard()
			// setMessage("");
    }
    else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      resetBoard()
			// setMessage("");
    }
}
//
// function doTurn(square){
//   updateState(square)
//   turn++
//   checkWinner()
// }


 // Board -> Save Handling

function saveGame() {
	var state = Array.from($('td'), e => e.innerText);
	var gameData = {state: state}

	if (!gameCount === 0) {
		$.ajax({
			type: 'PATCH',
			url: `/games/${gameCount}`,
			dataType: 'json',
			data: gameData
		});
	} else if (gameCount === 0){
			$.post(`/games`, gameData, function(game) {
			gameCount = game.data.id;
		});
	};
};


// Board -> Previous Game Handling

function previousGames() {
	$('#games').empty();

		$.get('/games', function(game) {
			if (game.data.length) {
				game.data.map(function(game) {
				$('#games').append(`<button id="gameCount-${game.id}">Retrieve Game: #${game.id}</button><br>`)
				$("#gameCount-"+game.id).on('click', () => reloadGame(game.id))
			})
		}
	})
}


function reloadGame(gameCount) {
    $.get(`/games/${gameCount}`, function(game) {
        var state = game.data.attributes.state;
        $('td').text((index, token) => state[index]);
        gameCount = gameCount
        turn = state.join('').length;
        checkWinner();
    });
};

// Board -> Reset Handling

function resetBoard() {
  $('td').empty();
  turn = 0;
  gameCount = 0;
	setMessage("");
}
