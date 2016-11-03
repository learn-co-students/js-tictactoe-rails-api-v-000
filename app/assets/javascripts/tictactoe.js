
var turn = 0;
var winCombinations = [
  [0,1,2], //top row
  [3,4,5], //middle row
  [6,7,8], //bottom row
  [0,3,6], //left column
  [1,4,7], //middle column
  [2,5,8], //right column
  [0,4,8], //top left to bottom right diagonal
  [2,4,6], //bottom left to top right diagonal
  ];

  var xPositions = [];
  var oPositions = [];

function attachListeners() {
	$('td').click(function(event) {
		doTurn(event.target);
	});
}

function doTurn(target) {

	updateState(target);
	var check = checkWinner();
	// console.log("Turn: " + turn);
	// console.log(check);
	if (check === true ) {
		turn = 0;
		$('td').text('');
	}
	else {
		turn += 1;		
	}

}

function checkWinner() {
	var currentPlayer = player();

	if (turn > 3 && turn < 8) {
		for (var i = 0; i < 8; i++){
			var xWinCount = 0;
			var oWinCount = 0;	
			
			for (var j = 0; j < 3; j++) {
				if (currentPlayer === "X") {
					if(xPositions.includes(winCombinations[i][j])) {

						xWinCount++;
					}
				}
				else if (currentPlayer === "O") {
					if(oPositions.includes(winCombinations[i][j])) {
						oWinCount++;
					}
				}
			}
			if (xWinCount === 3 || oWinCount === 3) {
				
				message("Player " + currentPlayer + " Won!");
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

function player() {
	if (turn % 2 === 0 || turn === 0)  {
		return "X";
	}
	else {
		return "O";
	}
}

function updateState(target) {

	var currentPlayer = player();
	if($(target).is(':empty')) {
		$(target).html(currentPlayer);
		var cells = $('tr').find('*');
		var cellNumber = cells.index(target);
		if(currentPlayer === "X") {
			xPositions.push(cellNumber);
		}
		else {
			oPositions.push(cellNumber);
		}
	}
}

function message(messageString) {
	$('#message').html(messageString);
}

$(document).ready(function() {
	attachListeners();

});


// <body>
// 	<table border="1" cellpadding="40">
// 		<tr>
// 			<td data-x="0" data-y="0"></td>
// 			<td data-x="1" data-y="0"></td>
// 			<td data-x="2" data-y="0"></td>
// 		</tr>
// 		<tr>
// 			<td data-x="0" data-y="1"></td>
// 			<td data-x="1" data-y="1"></td>
// 			<td data-x="2" data-y="1"></td>
// 		</tr>
// 		<tr>
// 			<td data-x="0" data-y="2"></td>
// 			<td data-x="1" data-y="2"></td>
// 			<td data-x="2" data-y="2"></td>
// 		</tr>
// 	</table>
// 	<div id="games"></div>
// 	<div id="message"></div>
// 	<button id="save">Save Game</button>
// 	<button id="previous">Show Previous Games</button>
// </body>