const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]
var turn = 0
var board = document.getElementsByTagName("td")

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
  if (checkWinner() === true){
    turn = 0
  } else {
    turn += 1
  }
}

function checkWinner() {
  if (checkTie() === true) {
    message("Tie game")
    return true;
  }
  if (checkVictory() ){
    return true;
  }
    return false;
}

function checkTie() {
  var tie = true
  Array.prototype.forEach.call(board, function(cell){
    if (cell.innerHTML === ""){
      tie = false
    }
  })
  if (tie === true){
    return true
  }
}


function checkVictory(){
  // Check to see if there's a winner
  if (winCombos.some(combo => board[combo[0]].innerHTML === "X" && board[combo[1]].innerHTML === "X" && board[combo[2]].innerHTML === "X")){
      message("Player X Won!"); //Player O won

      return true;
    } else if (winCombos.some(combo => board[combo[0]].innerHTML == "O" && board[combo[1]].innerHTML == "O" && board[combo[2]].innerHTML == "O")) {
        message("Player O Won!"); //Player O won
        return true;
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

function message(winner) {
  document.getElementById("message").innerHTML = winner;
  var board = document.getElementsByTagName("td")
  Array.prototype.forEach.call(board, function(cell){
    cell.innerHTML = ""
  })
  // turn = 0
}

$(function() {
  attachListeners();
});
