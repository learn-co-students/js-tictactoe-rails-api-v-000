const winCombos = [[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]];
var turn = 0

function attachListeners() {
	var allCells = document.getElementsByTagName("td");
	  Array.prototype.forEach.call(allCells, function(cell){
	    cell.addEventListener("click", function(event){
    	    doTurn(event);
    	})
	})
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn += 1
}

function checkWinner() {
  if ("X") {
		return message("Player X Won!") //Player X won
	} else if ("O") {
		return message("Player O Won!") //Player O won
	} else {
		return false //No winner
	}
}

function updateState(event) {
	event.target.innerHTML = player(turn)
}

function player() {
  if (turn % 2 == 0){
    return 'X'
  }
  else {
    return 'O'
  }
}

var message = function (winner) {
  document.getElementById("message").innerHTML = winner;
}

$(function() {
  attachListeners();
});
