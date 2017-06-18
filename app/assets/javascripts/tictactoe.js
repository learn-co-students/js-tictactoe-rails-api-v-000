const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]
var turn = 0
var board = document.getElementsByTagName("td")

// Event Listeners

function attachListeners() {
  Array.prototype.some.call(board, function(cell) {
    cell.addEventListener("click", doTurn); 
  })
  // document.getElementById("save").addEventListener("click", saveGame);
  // document.getElementById("previous").addEventListener("click", previousGame);
}

function saveGame(){
  debugger;
}

function previousGame() {
    // do something that responds to the button pree
  }

// Turn functionality

function doTurn() {
  updateState();
  if (checkWinner() === true){
    turn = 0;
  } else {
    turn += 1;
  }
}

function updateState() {
	event.target.innerHTML = player()
}

function player() {
  if (turn % 2 == 0){
    return 'X'
  }
  else {
    return 'O'
  }
}

// Check if there is a winner, a tie, or play should continue.

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
  if (winCombos.some(combo => board[combo[0]].innerHTML === "X" && board[combo[1]].innerHTML === "X" && board[combo[2]].innerHTML === "X")){
      message("Player X Won!"); //Player O won
      return true;

    } else if (winCombos.some(combo => board[combo[0]].innerHTML == "O" && board[combo[1]].innerHTML == "O" && board[combo[2]].innerHTML == "O")) {
      message("Player O Won!"); //Player O won
      return true;
    }
}

function message(winner) {
  document.getElementById("message").innerHTML = winner;
  // Clear board
  Array.prototype.forEach.call(board, function(cell){
    cell.innerHTML = ""
  })
}

/////////THIS IS NEW:
  
  function currentGame(){

  }

  // Document ready

$(function() {
  attachListeners();
});
