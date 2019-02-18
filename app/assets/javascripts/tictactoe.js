var turn = 0

var winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

var player = () => turn % 2 ? 'O' : 'X';

// var player = function() {
// 	if (turn % 2 === 0) {
// 		return "X";
// 	} else {
// 		return "O";
// 	}
// 	turn += 1;
// }

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  move = document.querySelector("td");
  $("td").click(function() {
    doTurn(this);
  });
}

function doTurn(move) {
	turn += 1;
	updateState(move);

	if (checkWinner()) {
	    resetBoard();
	} else if (turn === 9) {
		//  Tie game message not working
	    setMessage("Tie game.");
	    resetBoard();
	}
}

function updateState(td) {
	$(td).html(player());
}

function resetBoard(){
	$('td').empty();
	turn = 0;
}

function setMessage(message) {
	$("#message").html(message);
}

// function checkWinner() {
// 	var square = $('td');
// 	var winner 
// 	let message = `Player ${winner} won!`;

// 	// Check for horizontal X winner
// 	if (square[0].innerHTML === 'X' && square[1].innerHTML === 'X' && square[2].innerHTML === 'X') {
// 		return true;
// 		winner = 'X';
// 	} else if (square[3].innerHTML === 'X' && square[4].innerHTML === 'X' && square[5].innerHTML === 'X') {
// 		return true;
// 		winner = 'X';
// 	} else if (square[6].innerHTML === 'X' && square[7].innerHTML === 'X' && square[8].innerHTML === 'X') {
// 		return true;
// 		winner = 'X';

// 	// Check for diagonal X winner
// 	} else if (square[0].innerHTML === 'O' && square[4].innerHTML === 'O' && square[8].innerHTML === 'O') {
// 		return true;
// 		winner = 'O';
// 	} else if (square[2].innerHTML === 'O' && square[4].innerHTML === 'O' && square[6].innerHTML === 'O') {
// 		return true;
// 		winner = 'O';

// 	// Check for vertical X winner
// 	} else if (square[0].innerHTML === 'X' && square[3].innerHTML === 'X' && square[6].innerHTML === 'X') {
// 		return true;
// 		winner = 'X';
// 	} else if (square[1].innerHTML === 'X' && square[4].innerHTML === 'X' && square[7].innerHTML === 'X') {
// 		return true;
// 		winner = 'X';
// 	} else if (square[2].innerHTML === 'X' && square[5].innerHTML === 'X' && square[8].innerHTML === 'X') {
// 		return true;
// 		winner = 'X';
// 	} else {
// 		return false;
// 	}
// 	debugger

// }

function checkWinner() {
  var winner = false;
  var board = {};

  // generate board object
  // need explanation on this

  winCombinations.forEach(position => {
    if (
      board[position[0]] === board[position[1]] &&
      board[position[1]] === board[position[2]] &&
      board[position[0]] !== ""
    ) {
      setMessage(`Player ${board[position[0]]} Won!`);
      return (winner = true);
    }
  });

  return winner;
}