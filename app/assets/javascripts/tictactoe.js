$(function() {
  attachListeners()
});

var count = 0

var turn = function(){
  count += 1
}

function attachListeners() {
	var allCells = document.getElementsByTagName("td");

	  Array.prototype.forEach.call(allCells, function(cell){
	    cell.addEventListener("click", function(){
    	    doTurn();
    	})
	})
}

// var turn = function turn(count) {
//   count += 1;
// }

function doTurn() {
  checkWinner();
  updateState();
}

function checkWinner() {

}

function updateState() {

}
