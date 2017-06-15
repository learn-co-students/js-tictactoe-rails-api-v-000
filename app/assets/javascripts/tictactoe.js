var turn = 1;
const winCombos = [[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]];

function attachListeners() {
	var allCells = document.getElementsByTagName("td");
	  Array.prototype.forEach.call(allCells, function(cell){
	    cell.addEventListener("click", function(event){
    	    doTurn(event);
    	})
	})
}

function doTurn(event) {
  turn += 1
  updateState(event);
  checkWinner();
}

function checkWinner() {
  if (true) {
		"Player X Won!" 
	} 
	return false;
}

function updateState(event) {
	event.target.html = player()
}

function player() {
	if (turn % 2 === 0){
		return 'X';
	} else {
		return 'O';
	}
}

var message = function (winner) {
  document.getElementById("message").innerHTML = winner;
}

$(function() {
  attachListeners();
});
