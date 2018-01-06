// Code your JavaScript / jQuery solution here
var turn = 0
var board = document.querySelectorAll('td')

var winningBoard = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
 ]

function isEven(turn) {
  return turn % 2 === 0;
}

function player(){
  return isEven(turn) ? 'X' : 'O';
}

function updateState(position){
  position.innerHTML = player();
}

function setMessage(string){
  $("#message").html(string);
}

function setBoard(){
  var board = []
  $('td').toArray().forEach(x => board.push(x.innerHTML))
  return board
}

function checkWinner(){
  var currentBoard = setBoard();
	function winningCombo(currentVal) {
		if (currentBoard[currentVal[0]] === currentBoard[currentVal[1]] && currentBoard[currentVal[1]] === currentBoard[currentVal[2]] && currentBoard[currentVal[0]] !== "") {
      winner = currentBoard[currentVal[0]]
      setMessage(`Player ${winner} Won!`);
      return true;
		}
	}
	return winningBoard.some(winningCombo)
}

function tieGame(){
  var currentBoard = setBoard();
  if (currentBoard.every(x => x !== "")){
    setMessage("Tie game.");
  }
}

function doTurn(position){
  //doTurn() increments the value of the "turn" variable
  turn++;
  //doTurn() invokes the checkWinner() function
  //doTurn() resets the board and the "turn" counter when a game is won

  if (checkWinner()){
    $('td').html("")
    turn = 0;
  };
  //doTurn() invokes the updateState() function
  updateState(position);
  //doTurn() invokes the setMessage() function with the argument "Tie game." when the game is tied
  tieGame();

}

function attachListeners(){

}
