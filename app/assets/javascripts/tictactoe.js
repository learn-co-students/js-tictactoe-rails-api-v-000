// Code your JavaScript / jQuery solution here
$(document).ready(function() {
	attachListeners();
})

function attachListeners() {
	$("#save").click(() => saveGame());
	$("#previous").click(() => prevGame());
	$("#clear").click(() => clearGame());

	$('.cell').click(function() {
		if (!$.text(this)) {
			doTurn(this)
		}
	})
}

var turn = 0
var game_id = 0




const WINNERS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function player () {
	if (turn % 2 === 0) {
		return "X"
	} else {
			return "O"
		}
}

function updateState(el) {
	$(el).text(player())
}

function setMessage(message) {
	$('#message').text(message);
}

function checkWinner() {
	var winner = false
	var board = []

	$(".cell").each(function() {
		board.push(this.innerHTML)
		})

	WINNERS.forEach(function(combination) {
    if (combination.every(x => board[x]  === "X")) {
    	setMessage("Player X Won!")
    	 return winner = true
    } else if (combination.every(x => board[x]  === "O")) {
    	setMessage("Player O Won!")
    	 return winner = true
	    };    
	});
	return winner
}


function doTurn(el) {
	updateState(el);
	turn++;

	if (checkWinner() ) {
		saveGame();
		clearGame();
		turn = 0;
	} else if (turn === 9) {
			setMessage("Tie game.");
			turn = 0;
			saveGame();
			clearGame();
	}
	
}

function saveGame() {
	var data = {}
	var state = []

	$(".cell").each(function() {
		state.push(this.innerHTML)
		})

	data.state = state
	
	
	if (game_id) {
		$.ajax({
					type: 'PATCH',
					url: `/games/${game_id}`, 
					data: data
				})
	} else {	
		$.post('/games', data, function(game) {
			game_id = game.data.id
		})
	}
}



function prevGame() {
	$('#games').empty()
		$.get('/games', (archive) => {
			if (archive.data.length) {
				archive.data.forEach(function(game) {
					$('#games').append(`<button id="gameid-${game.id}">${game.id}</button>`)
					 $(`#gameid-${game.id}`).click(() => loadGame(game.id))
				})
			}
		})
}

function loadGame(gameId) {

	$.get(`/games/${gameId}`, (game) => {
		for (step = 0; step < 9; step++) {
	    $(`#cell${step+1}`).each(function() {
				this.innerHTML = game.data.attributes.state[step]
	    })
		}
		turn = game.data.attributes.state.filter(x => x != "").length;
		game_id = game.data.id
	});
}

function clearGame() {
	$(".cell").each(function() {
		this.innerHTML = ""
	})
	turn = 0
	game_id = 0
}

function setMessage(message) {
	$("#message").text(message)
}



