// Code your JavaScript / jQuery solution here

//NEED TO HIDE THESE VARIABLES FROM GLOBAL VIEW EVENTUALLY
var turn = 0
var currentBoard = ["","","",
                    "","","",
                    "","",""]


function player(){
  if (turn % 2 === 0){
    return 'X'
  } else {
    return 'O'
  }
};


function updateState(element){
  const DOMCoordinatesMapper = function(x, y){

  if ($(element).text() === ""){
    //needs to actually update the game object in the database

    $(element).text(player())
    // $.patch('/games/' + id)
    turn ++
  }
}

function setMessage(msg){
  let $messageDiv =  $("#message")
  $messageDiv.text(msg)
}

function checkWinner(board){
  const WinningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]

  for (const i of currentBoard){

  }

  //check to see if there are any winning combos on the board

}

function doTurn(){

}

function attachListeners(){
  let $theBoard = $("td")

  for (let i of $theBoard){
    $(i).on("click", function(e){
      updateState(this)
    })
  }
}

$(function(){
  attachListeners();
});
