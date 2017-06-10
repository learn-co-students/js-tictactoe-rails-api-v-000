$(function() {
  attachListeners()
});

var turn = 1

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
  checkWinner();
  updateState(event);
}

function checkWinner() {

}

function updateState(event) {
	
	event.target.innerHTML = player()
}

function player() {
	if (turn % 2 === 0){
		return 'X'
	} else {
		return 'O'
	}
}