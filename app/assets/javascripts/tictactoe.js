// Code your JavaScript / jQuery solution here

//NEED TO HIDE THESE VARIABLES FROM GLOBAL VIEW
//main variables
var $squares
var turn = 0

$(function(){ //on document.ready
  attachListeners();
  $squares = $("td");
  // debugger
});

function doTurn(square){
  updateState(square);
  let won
  let tied
  checkWinner() ? won = true : null;
  checkCatsGame() ? tied = true : null;

  if (won === true) {
    clearBoard();
  } else if (tied === true){
    setMessage("Tie game.");
    clearBoard()
  } else {
    turn++;
  }
}

function clearBoard(){
  turn = 0
  for (var s of $squares){
    s.innerHTML = "";
  };
  // debugger
}

function checkGameStatus(){

}

function checkCatsGame(){
  var currentBoard = boardToArray();
  const blankSpaces = function(currentBoard){
    var foundBlankSpace = false;
    for (let s of currentBoard){
      s === "" ? foundBlankSpace = true : null;
    }
    return foundBlankSpace;
  };
  return !blankSpaces(currentBoard);
}

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
  if ($(element).text() === ""){
    //needs to actually update the game object in the database

    $(element).text(player())
    // CAPTURE THE ELEMENT'S DATASET IN VARIABLES, then put them into DOMCoordinatesMapper
    let xCoord = parseInt(element.dataset["x"])
    let yCoord = parseInt(element.dataset["y"])
    let boardArrayCoord = DOMCoordinatesMapper(xCoord,yCoord)
    // debugger
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
  var currentBoard = boardToArray()
  var wonStatus = false
  for (var combo of winningCombos){
    var pos1 = currentBoard[combo[0]]
    var pos2 = currentBoard[combo[1]]
    var pos3 = currentBoard[combo[2]]

    if ((pos1 == pos2 & pos2 == pos3) & (pos1 == "X" | pos1=="O")){
      setMessage(`Player ${pos1} Won!`)
      wonStatus = true
      break
    }
  };
  return wonStatus
};

function saveGame(){

  alert("game save button pushed")
}

function attachListeners(){
  let $theBoard = $("td")
  let $saveButton = $("button#save")
  let $previousButton = $("button#previous")
  let $clearButton = $("button#clear")

  for (let i of $theBoard){
    $(i).on("click", function(e){
      i.innerHTML === "" ? doTurn(this) : null
    })
  };

  $saveButton.on("click", function(e){
    alert("save button clicked")
    // this.get("/games", function(data){
    //
    // })
  });


}
