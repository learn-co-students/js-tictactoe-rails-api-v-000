
var turn = 0;
var currentGame = 0;
var winningCombos = [
	[0, 1, 2], 
	[3, 4, 5],
	[6, 7, 8], 
	[0, 3, 6], 
	[1, 4, 7], 
	[2, 5, 8], 
	[0, 4, 8], 
	[2, 4, 6]
]

function attachListeners() {
	$('td').on('click', function(event) {
		doTurn(event);
	});
	$('#previous').on('click', function(){
		getPreviousGames();
	});
	$('#save').on('click', function(){
		if(currentGame) {
			console.log("heyoooooo")
			saveGame(false)
		}
		saveGame(true);
	
	});


}

function doTurn(event) {
	updateState(event);

	var check = checkWinner();
	reset = false;

	if (check === true || turn === 8) {
		turn = 0;
			saveGame(true);

		$('td').text('');
	}
	else {
		turn++;		
	}

}

function checkWinner() {
	var winner;
	if (turn > 3 && turn < 8) {
		for (var i = 0, len = winningCombos.length; i < len; i++) {

			winner = checkCells(winningCombos[i]);
			if (winner === "X") {
				message("Player X Won!");
				return true;
			}
			else if (winner === "O") {
				message("Player O Won!");
				return true;
			}
		}
		return false;
	}
	else if (turn === 8) {
		message("Tie game");	
		return false;
	}
	return false;
}

function checkCells(winningCombo) {
	var result;

	var cellsArray = $('td');
	var firstCell = $(cellsArray[winningCombo[0]]);
	
	if (!firstCell.is(':empty')) {
		
		var cell0 = cellsArray[winningCombo[0]].innerHTML;
		var cell1 = cellsArray[winningCombo[1]].innerHTML;
		var cell2 = cellsArray[winningCombo[2]].innerHTML;
	
		if (cell0 === cell1 && cell1 === cell2) {
			var result = cell0;
		}
	}
	return result;
}

function player() {
	if (turn % 2 === 0 || turn === 0)  {
		return "X";
	}
	else {
		return "O";
	}
}

function updateState(event) {
	var currentPlayer = player();
	if($(event.target).is(':empty')) {
		$(event.target).html(currentPlayer);
	}
}

function message(messageString) {
	$('#message').html(messageString);
}

function saveGame(reset) {
	var state = getState();
	var method;
	var url;
	var data = {
		game: {
			state: state	
		}
	}
	if(reset) {
		method = "POST";
		url = '/games';
	}
	else {
		console.log("lol")
		method = "PATCH";
		console.log(currentGame);
		url = '/games/' + currentGame;
		var data = {
			game: {
				id: currentGame,
				state: state
			} 
		}
	}	
 	$.ajax( {
 		url: url,	
 		method: method,
 		data: data
 	}).done(function(data, textStatus, jqXHR) {
 		// console.log(jqXHR);
 		currentGame = JSON.parse(jqXHR.responseText)['game']['id'];	
 		console.log(currentGame);	
 	});
}

function getState() {
	var board = []
 	var cells = ($('td'));
 	for (var k = 0; k < 9; k++) {
 		board.push(cells[k].innerHTML);
 	}
 	return board;
}

function getPreviousGames() {
	$.get("/games").done(function(data) {
		if (data.length > 0){
			for(var l = 0, len = data.length; l < len; l++) {
				$('#games').append("<p>" + data[l].id + "</p>");
			}
		}
	});
}

$(document).ready(function() {
	attachListeners();
});

// $.ajax('/foo', { type: 'POST', data: { _method: 'PATCH' } });

// var data = JSON.stringify({
// 		title: issueTitle, 
// 		body: issueBody
// 	});

// 	$.ajax({
// 		url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/issues',
// 		type: 'POST',
// 		dataType: 'json',
// 		dataContent: 'application/json',
// 		data: data,
// 		headers: {
// 			// Authorization: ''
//   		},
// 	}).done(function(results) {
// 		handleResponse(results);
// 	}).fail(function(jqXHR, textStatus, errorThrown){
// 		handleError(jqXHR, textStatus, errorThrown);
// 	});


// <body>
// 	<table border='1' cellpadding='40'>
// 		<tr>
// 			<td data-x='0' data-y='0'></td>
// 			<td data-x='1' data-y='0'></td>
// 			<td data-x='2' data-y='0'></td>
// 		</tr>
// 		<tr>
// 			<td data-x='0' data-y='1'></td>
// 			<td data-x='1' data-y='1'></td>
// 			<td data-x='2' data-y='1'></td>
// 		</tr>
// 		<tr>
// 			<td data-x='0' data-y='2'></td>
// 			<td data-x='1' data-y='2'></td>
// 			<td data-x='2' data-y='2'></td>
// 		</tr>
// 	</table>
// 	<div id='games'></div>
// 	<div id='message'></div>
// 	<button id='save'>Save Game</button>
// 	<button id='previous'>Show Previous Games</button>
// </body>
