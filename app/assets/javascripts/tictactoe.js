//const WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var turn = 0;
var currentGameState = new Array(9).fill("")
var currentGameId

$(function(){
  attachListeners();
});




function saveGame(){

      gameData = {state: currentGameState}

      if (currentGameId){
        alert("saving existing game")
        $.ajax({
          method: "PATCH",
          url: "/games/" + currentGameId,
          data: gameData
        }).done(function(){
          alert("SUCCESS")
        }).fail(function(){
          alert("FAIL")
        })
      } else {
        $.post('/games', gameData, function(data){

          currentGameId = data["data"]["id"]
        }).fail(function(){
          alert("ERROR")
          debugger;
        });
      }

}




function player(){ // return the token for the NEXT player (i.e. the one about to play)
  var token
    if (turn % 2 == 0){
      token = "X"
    } else {
      token = "O"
    }
  return token
}

function doTurn(clickedElement){
if ($(clickedElement).text() == ""){
  updateState($(clickedElement));

  turn += 1;
  if (checkWinner()){
    saveGame();
    clearGame();

  } else if (turn >= 8){
    saveGame();
    setMessage("Tie game.");
    clearGame();

  }
} else {
  setMessage("Can't select a taken field")
}

}

function updateState(clickedElement){
  var token = player(); // right now player() returns the player that JUST PLAYED
  $(clickedElement).text(token)
  squareIndex = getTableIndex(clickedElement);
  currentGameState[squareIndex] = token;


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

function getTakenPositions(){

  var XPositionIndices = [];
  var OPositionIndices = [];

  var XPositions = $("td").filter(function(td){
    return this.innerHTML == "X";
  });
  $(XPositions).each(function(){
    var tableIndex = getTableIndex(this)
    XPositionIndices.push(tableIndex)
  });

  var OPositionIndices = [];
  var OPositions = $("td").filter(function(td){
    return this.innerHTML == "O";
  });
  $(OPositions).each(function(){
    var tableIndex = getTableIndex(this)
    OPositionIndices.push(tableIndex)
  });

  return {"X": XPositionIndices, "O": OPositionIndices};

}

function checkWinner(){
  var positions = getTakenPositions();

  var hasWinner = false;
  var winner
  const WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  WINNING_COMBOS.forEach(function(combo){
    var isWinningCombo = combo.every(function(element){
      return positions["O"].indexOf(element) >= 0;
    });
    if (isWinningCombo){
      hasWinner = true;
      winner = "O"
    }
  });

  WINNING_COMBOS.forEach(function(combo){
    var isWinningCombo = combo.every(function(element){
      return positions["X"].indexOf(element) >= 0;
    });
    if (isWinningCombo){
      hasWinner = true;
      winner = "X"
    }
  });

  if (hasWinner){
    setMessage(`Player ${winner} Won!`);
  }
  return hasWinner;
}





function clearGame(){
  $('td').empty();
  turn = 0;
}



function attachListeners(){
  $("td").on('click', function(){
    doTurn(this);
  });

  $("#save").click(function(e){
    e.preventDefault();
    saveGame();
  });
  $("#clear").click(function(e){
    e.preventDefault();
    clearGame();
  });

}
