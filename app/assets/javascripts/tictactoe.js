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

function setMessage() {

}

function checkWinner() {
	var winner = false
	var board = []

	$(".cell").each(function() {
		board.push(this.innerHTML)
		})
	
	if (!board.some(x => x  === "")) {
    	console.log("Tie Game!");
    	return winner = false;
  }

	WINNERS.forEach(function(arr) {
    if (arr.every(x => board[x]  === "X")) {
    	return winner = true;
   
    } else if (arr.every(x => board[x]  === "O")) {
    	return winner = true;
	    }
	});
	return winner
}


function doTurn(el) {
	updateState(el);
	turn++;

	if (checkWinner() === true) {

	} else {
			
	}
	
}

function saveGame() {
	console.log("saved")
}

function prevGame() {

}

function clearGame() {

}

function setMessage(message) {
	$("#message").text(message)
}



