
var turn = 0;
var winningCombos = [
	[
		[0,0], [1,0], [2,0]
	], 
	[
		[0,1], [1,1], [2,1]
	],
	[
		[0,2], [1,2], [2,2]
	], 
	[
		[0,0], [1,1], [2,2]
	], 
	[
		[0,0], [0,1], [0,2]
	], 
	[
		[2,0], [2,1], [2,2]
	], 
	[
		[1,0], [1,1], [1,2]
	], 
	[
		[2,0], [1,1], [0,2]
	]
]

function attachListeners() {
	$('td').on('click', function(event) {
		doTurn(event);
	});	
}

function doTurn(event) {
	updateState(event);
	var check = checkWinner();
	// console.log('Turn: ' + turn);
	// console.log(check);
	if (check === true ) {
		turn = 0;
		$('td').text('');
	}
	else {
		turn ++;		
	}

}

function checkWinner() {
	for (var i = 0, len = winningCombos.length; i < 1; i++) {
		checkCells(winningCombos[i]);
	}
}

function checkCells(winningCombo) {
	
	var cells = $('td');
	console.log(cells);
	for (var j = 0, len = winningCombo.length; j < len; j++) {
		
	}
}

function player() {
	if (turn % 2 === 0 || turn === 0)  {
		return 'X';
	}
	else {
		return 'O';
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

$(document).ready(function() {
	attachListeners();
});


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