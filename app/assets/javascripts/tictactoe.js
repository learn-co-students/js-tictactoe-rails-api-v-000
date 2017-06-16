// const winCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]];

const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]
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
   var board = document.getElementsByTagName("td")
   winCombos.forEach(function(combo){ 
    if (board[combo[0]].innerHTML === "X" && board[combo[1]].innerHTML === "X" && board[combo[2]].innerHTML === "X") {
    return message("Player X Won!"); //Player X won
      } else if (board[combo[0]].innerHTML == "O" && board[combo[1]].innerHTML == "O" && board[combo[2]].innerHTML == "O") {
        return message("Player O Won!"); //Player O won
      } else {
        ; //No winner
      }
   })
         return false
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

function message(winner) {
  document.getElementById("message").innerHTML = winner;
}

$(function() {
  attachListeners();
});
