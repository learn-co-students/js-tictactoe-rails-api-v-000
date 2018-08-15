// Code your JavaScript / jQuery solution here
$(document).ready(function() {
	attachListeners();
})

var WINNERS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]];

var turn = 0;
var savedGame = 0;

function attachListeners() {
	$("td").click(function() {
		if (!checkWinner()) {
			doTurn(this);
		};
	})
	$("#save").click(function(){
		saveGame();
	})
	$("#previous").click(function() {
		previousGames();
	})
	$("#clear").click(function() {
		resetBoard();
	})
}

function player() {
	if (turn % 2 == 0) {
		return 'X';
	} else {
		return 'O';
	}
}

function updateState(square) {
	$(square).text(window.player());
}

function resetBoard() {
	$("td").empty();
	turn = 0;
	savedGame = 0;
}

function setMessage(string) {
	$("#message").html(string);
}


function checkWinner() {
	var squares = $("td");
	var squaresArray = $.makeArray(squares);
	var squaresData = squaresArray.map(x => x.innerHTML);
	var playerToken = '';
	var won = false;

	WINNERS.forEach(function(combo) {
		if (squaresData[combo[0]] === squaresData[combo[1]] && 
			squaresData[combo[1]] === squaresData[combo[2]] && squaresData[combo[0]] != '') {
			playerToken = squaresData[combo[0]];
			won = true;
		}
	});

	if (won === true) {
		setMessage(`Player ${playerToken} Won!`);
		saveGame();

	} else if(won === false && !squaresData.includes('')) {
		setMessage("Tie game.")
		saveGame();
		resetBoard();
	};
	return won;
}

function doTurn(square) {
	if (square.innerHTML === '') {
		updateState(square);
		turn += 1;
		if (checkWinner()) {
			resetBoard();
		}
	}
	
}

function saveGame() {
	var squares = $("td");
	var squaresArray = $.makeArray(squares);
	var state = squaresArray.map(x => x.innerHTML);
	var gameParams = {state: state}

	if (savedGame) {
		$.ajax({
			type: 'PATCH',
			url: `/games/${savedGame}`,
			data: gameParams
		});
	} else {
		$.post('/games', gameParams, function(game) {
			savedGame = game.data.id;
		})
	}
}

function previousGames() {
	$("#games").empty();
	$.get("/games", function(games) {
		games.data.forEach(function(game) {
			$("#games").append("<button class='js-saved' data-id='" + game.id + "'>" + game.id + "</button")
			$(".js-saved").click(function() {
				var id = $.parseJSON($(this).attr('data-id'));
				$.get(`/games/${id}`, function(data) {
					loadGame(data.data.attributes.state, id);
				})
			})
		});
	})
}

function loadGame(state, id) {
	var squares = $("td")
	var index = 0
	state.forEach(function (token) {
		squares[index].innerHTML = token;
		index += 1;
	})
	savedGame = id;

	var turnsTaken = state.filter(token => token != '');
	turn = turnsTaken.length;
}