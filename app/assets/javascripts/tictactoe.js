var turn =0;
var winningCombIdx = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var currentBoard = window.document.querySelectorAll('td');

$(document).ready(function() {
   attachListeners();
   previousGames();
});


function player() {
	if (turn%2 !== 0  && turn !==0) {
		return "O"
	} else {
		return "X"
	};
}


function updateState(td) {
	td.innerHTML = player();
}

function setMessage(message) {
	$("#message").html(message);
}

function checkWinner() {
	var currentX = [];
	var currentO = [];
	var matchingIdx = [];

//gather the current indices for each player
	for (let i = 0; i < 9; i++) {
		if (currentBoard[i].innerHTML === "X") {
			currentX.push(i)
		} else if (currentBoard[i].innerHTML === "O") {
			currentO.push(i)
		}
	};

//check whether X's indices match any of the winning combos
	for (let i = 0; i < 8; i++) {
		matchingIdx = currentX.filter( function( el ) {
  			return winningCombIdx[i].includes( el );
		} );
		if (arraysEqual(matchingIdx, winningCombIdx[i])) {
			setMessage("Player X Won!")
			return true
		};
	};

//check whether O's indices match any of the winning combos
	for (let i = 0; i < 8; i++) {
		matchingIdx = currentO.filter( function( el ) {
  			return winningCombIdx[i].includes( el );
		} );
		if (arraysEqual(matchingIdx, winningCombIdx[i])) {
			setMessage("Player O Won!")
			return true
		};
	};

//return false if none of the above code executed
	return false;
}


function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var k = arr1.length; k--;) {
        if(arr1[k] !== arr2[k])
            return false;
    }
    return true;
}


function doTurn(td) {
	updateState(td);
	turn++;
	var won = checkWinner();

	if (!won && turn === 9) {
		setMessage("Tie game.")
	};

	if (turn === 9) {
		resetGame()
	};
}


function resetGame() {
	turn = 0;
	for (let i = 0; i < 9; i++) {
    	currentBoard[i].innerHTML = '';
  	}
  	$("#message").html("");
}


function attachListeners() {
	document.querySelectorAll('td')
	.forEach(e => e.addEventListener("click", function() {
		doTurn(event.target);
	}));
}


function previousGames() {
	$("#previous").on("click", function() {
		$.get("/games" + ".json", function(data) {
		var games = data;
	    debugger;
	 	$("#games").text(game["id"]);
	   });
	});
}