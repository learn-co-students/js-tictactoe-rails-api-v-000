const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentState = new Array(9).fill("")

$(function(){
  attachListeners();
});


function saveGame(){
  $("#save").click(function(e){
    e.preventDefault();
  })
}

function player(){
  var token
    if (turn % 2 == 0){
      token = "X"
    } else {
      token = "O"
    }
  return token
}

function doTurn(){
  turn += 1;
  updateState($(this));
  checkWinner();
}

function updateState(clickedElement){
  var token = player();
  var tableIndex = getTableIndex(clickedElement);
  $(clickedElement).text(token)
  currentState[tableIndex] = token

}

function getTableIndex(clickedElement){
  var x = $(clickedElement).data("x")
  var y = $(clickedElement).data("y")

  var correspondance = [[0,1,2], [3,4,5],[6,7,8]]
  var tableIndex = correspondance[y][x];
  return tableIndex;
}

function setMessage(message){
  $("#message").text(message);
}

function getPositionsOfCurrentPlayer(){
  var token = player();
  var result = []
  currentState.forEach(function(el, i){
    if (el == token){
      result.push(i);
    }
  });
  return result
}

function checkWinner(){
  var playerPositions = getPositionsOfCurrentPlayer();
  var hasWinner = false;
  debugger;
  WINNING_COMBOS.forEach(function(combo){
    // check if the combo is included in result
    var matched = combo.every(function(element){
      return playerPositions.indexOf(element) >= 0;
    });
    if (matched){
      hasWinner = true;
    }
  });

  if (hasWinner){
    alert("SOMEONE WON!!")
  }
  return hasWinner;
}

function attachListeners(){
  $("td").click(doTurn)
  saveGame();
}
