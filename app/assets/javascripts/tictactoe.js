// Code your JavaScript / jQuery solution here

//NEED TO HIDE THESE VARIABLES FROM GLOBAL VIEW EVENTUALLY
var $squares
var currentBoard = []
$(function(){
  attachListeners();
  $squares = $("td");
  debugger
});

var turn = 0


function boardToArray(){
  var newArr = []
  for (let i = 0; i < 9; i++) {
    newArr[i] = $squares[i].innerHTML;
  }
  return newArr
}

const DOMCoordinatesMapper = function(x, y){
// takes in xy coordinates as inputs and converts to
  if (y === 0){
    let rowArr = [0, 1, 2]
    return rowArr[x]
  } else if (y===1){
    let rowArr = [3, 4, 5]
    return rowArr[x]
  } else if (y===2) {
    let rowArr = [6, 7, 8]
    return rowArr[x]
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
  const token = player()
  if ($(element).text() === ""){
    //needs to actually update the game object in the database

    $(element).text(token)
    // CAPTURE THE ELEMENT'S DATASET IN VARIABLES, then put them into DOMCoordinatesMapper
    let xCoord = parseInt(element.dataset["x"])
    let yCoord = parseInt(element.dataset["y"])
    let boardArrayCoord = DOMCoordinatesMapper(xCoord,yCoord)
    // debugger
    currentBoard[boardArrayCoord] = token
    turn ++
  }
}

function setMessage(msg){
  let $messageDiv =  $("#message")
  $messageDiv.text(msg)
}

function checkWinner(){
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]

  //for each entry in WinningCombos:
  var wonStatus = false
  for (var combo of winningCombos){
    var pos1 = currentBoard[combo[0]]
    var pos2 = currentBoard[combo[1]]
    var pos3 = currentBoard[combo[2]]

    if ((pos1 == pos2 & pos2 == pos3) & (pos1 == "X" | pos1=="O")){
      wonStatus = true
      break
    }
  };
  return wonStatus
};

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
