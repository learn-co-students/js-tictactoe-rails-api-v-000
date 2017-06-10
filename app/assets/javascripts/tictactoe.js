$(function() {
  attachListeners()
  const turn = 0
});

function attachListeners() {
	var allCells = document.getElementsByTagName("td")

	  Array.prototype.forEach.call(allCells, function(cell){
	    cell.addEventListener("click", function(){
    	    doTurn()
    	})
	})
}

function turn(turn) {
  turn += 1
}

function doTurn() {

}

function checkWinner() {

}

function updateState() {
  
}
