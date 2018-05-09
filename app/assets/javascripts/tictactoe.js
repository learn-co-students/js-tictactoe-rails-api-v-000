// Code your JavaScript / jQuery solution here
const WINCOMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6], [0,4,8]]

var turn = 0;
var currentGame = 0;


$(document).ready(function() {
	attachListeners();
});


function player() {
	if (turn % 2) {
		return "O";
	} else {
		return "X";
	}
}

function updateState(element) {
	$(element).text(player());
}

function setMessage(string) {
	$('#message').text(string);
}

function checkWinner() {
	let board = [];
	let winner = false;

	$('td').text((index, square) => board[index] = square);

	WINCOMBOS.some(function(combo) {
		if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
			setMessage(`Player ${board[combo[0]]} Won!`);
			winner = true;
		}
	})
	return winner;
}

function doTurn(square) {
	updateState(square);
	turn++;
	if (checkWinner()) {
		saveGame();
		clearBoard();
	} else if (turn === 9) {
		setMessage("Tie game.");
		saveGame();
		clearBoard();
	}
}

function clearBoard() {
	$('td').empty();
	turn = 0;
	currentGame = 0;
}	

function attachListeners() {
	$('td').on('click', function() {
		if (!$.text(this) && !checkWinner()) {
			doTurn(this);
		}
	});	

	$('#save').on('click', () => saveGame());
	$('#previous').on('click', () => showPreviousGames());
	$('#clear').on('click', () => clearBoard());
}

function showPreviousGames() {
	$('#games').empty();
	$.get('/games', function(savedGames) {
		if (savedGames.data.length > 0) {
			savedGames.data.forEach(buildGameButton);
		}
	});
}

function buildGameButton(game) {
	$('#games').append(`<button id="game-${game.id}">${game.id}</button>`);
	$(`#game-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameId) {
	$('#message').innerHTML = '';

	$.get(`/games/${gameId}`, function(game) {
		const id = game.data.id;
		const state = game.data.attributes.state;

		let i = 0;
		for (let y=0; y<3; y++) {
			for (let x=0; x<3; x++) {
				document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[i];
				i++;
			};
		};
		turn = state.join('').length;
		currentGame = id;

		if (!checkWinner() && turn === 9) {
			setMessage('Tie game.');
		}
	});

	

}

function saveGame() {
  let state = [];
  let gameData;

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}




