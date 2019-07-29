// Code your JavaScript / jQuery solution here
/*
  REMINDER: DO NOT USE ES5+ Sprokects cannot read it and it will result in odd, confusing errors!!
*/
var turn = 0;
function resetBoard(){
  boardHTMLData = $("td")
  boardHTMLDataLength = boardHTMLData.length
  board = []
  for(var i = 0; i < boardHTMLDataLength; i++){
    boardHTMLData[i].innerHTML = ""
  }
}

function getBoard(){
  boardHTMLData = document.querySelectorAll("td")
  boardHTMLDataLength = boardHTMLData.length
  board = []
  for(var i = 0; i < boardHTMLDataLength; i++){
    board.push( boardHTMLData[i].innerHTML )
  }
  return board
}
function player(){
   ticTacToePiece = turn % 2 == 0 ? "X" : "O"
   return ticTacToePiece
}

function updateState(board_cell){
    board_cell.innerHTML = player()
}

function setMessage(message){
  document.getElementById("message").innerHTML = message
}

function checkWinner(){
  var WINNING_COMBINATIONS = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,4,8],
      [6,4,2],
      [0,3,6],
      [2,5,8]
  ];
  var WINNING_COMBINATIONS_LENGTH = WINNING_COMBINATIONS.length
  var currentCombination = []
  var playerX = 'X'
  var playerO = 'O'
  var currentBoard = getBoard()
  var playerXWins = false
  var playerOWins = false

  // Check if either player has won
  for(var i = 0; i < WINNING_COMBINATIONS_LENGTH; i++){
     currentCombination = WINNING_COMBINATIONS[i]
      playerXWins = ( currentBoard[currentCombination[0]] == playerX
          && currentBoard[currentCombination[1]] == playerX
          && currentBoard[currentCombination[2]] ==  playerX )

      playerOWins =  ( currentBoard[currentCombination[0]] == playerO
          && currentBoard[currentCombination[1]] == playerO
          && currentBoard[currentCombination[2]] ==  playerO )

      if(playerXWins){
        setMessage("Player X Won!")
        return true
      }
      else if(playerOWins){
        setMessage("Player O Won!")
        return true
      }
   }
   return false
}

function doTurn(board_cell){
  console.log("do turn called")
  if(!checkWinner()){
    updateState(board_cell)
    turn++;

    if(getBoard().indexOf('') < 0){
      setMessage('Tie game.')
      turn = 0;
      resetBoard();
    }
  }
}

function attachListeners(){
  console.log("attach listeners fired")
  boardHTMLData = $("td")
  boardHTMLDataLength = boardHTMLData.length
  board = []
  $("td").on("click", function(e){
    doTurn(e)
  });
  // for(var i = 0; i < boardHTMLDataLength; i++){
  //   boardHTMLData[i].addEventListener("click", doTurn)
  // }
}

$(document).on("ready", function(){
  console.log("ready")
  attachListeners();
})
