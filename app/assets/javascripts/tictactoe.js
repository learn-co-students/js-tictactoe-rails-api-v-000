//number of turns in current game
var turn = 0; 
var winCombo = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
//currentGame will hold the id of the current game after it's been saved
var currentGame = 0;

$(document).ready(function() {
	attachListeners();
});

function player() {
	if (turn % 2 === 0) {
		return "X"
	} else {
		return "O"
	}
};

function updateState(space) {
	space.innerHTML = player();
};

function setMessage(message) {
	$('#message').text(message)
}

function checkWinner() {
	var winner = false
	var board = []

	//Captures the board values into the board array
	$('td').map(function (index, value) { 
		board[index] = value.innerHTML;
	});

	for (win of winCombo) {
		if (board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]] && board[win[0]] != ''){
			//Saves winning board automatically
			$("#save").click()
			setMessage(`Player ${board[win[0]]} Won!`) 
			winner = true
		}
	}
	return winner;
};

function doTurn(space) {
	updateState(space);
	turn ++;
	if (checkWinner()) {
		$('td').empty();
		turn = 0;
		currentGame = 0;
	} else if (turn === 9) {
		$("#save").click()
		setMessage("Tie game.")
		$('td').empty();
		turn = 0;
		currentGame = 0;
	}
}

function attachListeners() {
	$('td').on('click', function() {
		if (!checkWinner() && !this.innerHTML) {
			doTurn(this)
		};
	})

	$('#previous').on('click', function() {
		$.ajax({
			method: 'GET',
			url: '/games'
		}).done(function(data) {
			$("#games").empty();
			data["data"].forEach( function(game) {
				buttonize(game)
			})

		})
	})

	$('#save').on('click', function() {
		var values = []
		var board = document.querySelectorAll("td");
		for (let i = 0; i < board.length; i++) {
			values.push(board[i].innerHTML);
		}
		if (currentGame) {
			$.ajax({
				method: 'PATCH',
				url: `/games/${currentGame}`, 
				data: { state: values }
			}) 
		} else {
			$.ajax({
				method: "POST",
				url: "/games",
				data: { state: values }
			}).done( function(game) {
				currentGame = game["data"]["id"];
				buttonize(game["data"]);
			})
		}
	})

	$('#clear').on('click', function() {
		$('td').empty();
		currentGame = 0;
		turn = 0;
	})
}

function buttonize(game) {
	$('#games').append(`<button id="game-${game["id"]}">Game ${game["id"]}</button><br>`);
	$(`#game-${game["id"]}`).on("click", function() {
		currentGame = game["id"]
		$.get( "/games/" + game["id"]).done(function(data) {
			var state = data["data"].attributes["state"]
			var board = document.querySelectorAll("td")
			for (var i = 0; i < state.length; i++) {
				board[i].innerHTML = state[i]
			}
			turn = state.reduce(function(total, space) {
				if (space) {
					total++
				}
				return total
			}, 0)
		})
	})
}

