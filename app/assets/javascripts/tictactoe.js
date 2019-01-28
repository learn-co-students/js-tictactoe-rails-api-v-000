var turn = 0;
var currentGame = 0;

$(document).ready(function(){
	attachListeners();
});


function player() {
	if(turn % 2 == 0 ) {
		return "X";
	} else {
		return "O";
	}
}

function updateState(square) {
	let currentPlayer = player();
	$(square).append(currentPlayer);
}

function setMessage(string) {
	$("div#message").append(string);
}


function checkWinner() {
	var board = {};
	var winner = false;
	// returns true when a player wins horizontally
	// returns true when a player wins diagonally
	// returns true when a player wins vertically
	// returns false if no winning combination is present on the board
	
	$('td').text( (index, square) => board[index] = square);
	let winCombinations = [
	  [0, 1, 2],
	  [3, 4, 5],
	  [6, 7, 8],
	  [0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [6, 4, 2]
	];

	winCombinations.forEach(function(position) {
		if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
		setMessage(`Player ${board[position[0]]} Won!`)
		winner = true;
		saveGame();
		}
	})
	return winner;
}

function doTurn(square) {
	updateState(square);
	turn++;

	if (checkWinner(turn) === true) { 
		saveGame();
		clearGame();
	} else if (turn === 9) {
		saveGame();
		turn = 0;
		setMessage(`Tie game.`);
		clearGame();
	};
}

function gameOver() {
	let gameOver = false;
	if (checkWinner() === true || setMessage() === `Tie game.`) {
	gameOver = true;

};
	return gameOver;
}


function attachListeners(){
	$('td').on("click", function() {
	// check if square is empty and if so allow the player to take turn
	if (this.innerHTML === "" && gameOver() === false) {
		doTurn(this);
	};
	
	});
	$('#previous').on("click", function() {
			previousGame();
		});
	$('#save').on("click", function() {
		saveGame();
	});
	$('#clear').on("click", function() {
		clearGame();
	});
}

function saveGame() {
	let state = [];


	$('td').text((index, square) => {
    state[index] = square;
  });
	var gameData = { state: state }
	
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id
      $("#games").append(`<button id="game-${game.data.id}" onClick="loadGame(${game.data.id})">${game.data.id}</button><br>`);
    });
  }
}



function previousGame() {
    $.get('/games', function(response) {
    	const games = response.data;
    	var list = $('div#games').text();

    	games.forEach(function(game) {
    		if (!list.includes(game.id)) {
    			// iterate over each game button add an event listener to each button 
    		$("#games").append(`<button id="game-${game.id}" onClick="loadGame(${game.id})">${game['id']}</button><br>`);
    		};
    	});
    });
}

function loadGame(id) {
	$.get('/games/' + id, function(response) {
	let state = response.data.attributes.state;
    let $tds = $('td');
    for (let index = 0; index < state.length; index++) {
      $tds[index].innerHTML = state[index];
      if (state[index].innerHTML !== "") {turn++;};
    };
    currentGame = id;
    turn = state.join('').length;

	});
}


function clearGame() {
	$('td').empty();
	board = {};
	turn = 0;
	currentGame = 0;
}



