// Code your JavaScript / jQuery solution here

//NEED TO HIDE THESE VARIABLES FROM GLOBAL VIEW EVENTUALLY
var turn = 0
var currentBoard = ["","","",
                    "","","",
                    "","",""]
const DOMCoordinatesMapper = function(x, y){
// takes in xy coordinates as inputs and converts to
if (x === 0){
  let rowArr = [0, 1, 2]
  return rowArr[y]
} else if (x===1){
  let rowArr = [3, 4, 5]
  return rowArr[y]
} else if (x===2) {
  let rowArr = [6, 7, 8]
  return rowArr[y]
}
};


function player(){
  if (turn % 2 === 0){
    return 'X'
  } else {
    return 'O'
  }
};


function updateState(element){
  if ($(element).text() === ""){
    //needs to actually update the game object in the database

    $(element).text(player())
    // CAPTURE THE ELEMENT'S DATASET IN VARIABLES, then put them into DOMCoordinatesMapper
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
