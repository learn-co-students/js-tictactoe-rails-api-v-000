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
  if (checkWinner()){ //won
    saveGame();
    clearGame();

  } else if (turn >= 8){ //tied
    saveGame();
    setMessage("Tie game.");
    clearGame();
  } else {
    updateState($(clickedElement));
    turn += 1;
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

function getPreviousGames(){

  $.get('/games', function(games){

      games["data"].forEach(function(game){

        //game["attributes"]["state"]
        var button = document.createElement("button")
        var text = document.createTextNode(game["id"])
        button.appendChild(text);
        button.setAttribute("id", "game-"+game["id"]+"btn")
        $("#games").append(button);

        $("#game-"+game["id"]+"btn").click(function(){
          $.get("/games/"+ game["id"], function(data){

            var stateArr = data["data"]["attributes"]["state"]
            fillInTable(stateArr);
            currentGameState = stateArr;
            turn = stateArr.reduce(function(acc, currentVal){
              
              if (currentVal != ""){
                acc++
              }
              return acc
            }, 0)
            currentGameId = data["data"]["id"]
            debugger;
          })
        })

      });

  });
}


var numberToXYConcordances = [[0,0], [1,0], [2,0], [0,1], [1,1], [2, 1], [0,2], [1,2],[2,2]];

function fillInTable(stateArr){
  //I: ["X", "O", "", "X", "O", "", "", "", "X"]
  // Desired behaviour: update the table with the correct token for each square
    stateArr.forEach(function(token, index){
      var XYCords = numberToXYConcordances[index];
      // grab the x y cordinates, grab the corresponding square:
      $(`td[data-x='${XYCords[0]}'][data-y='${XYCords[1]}']`).text(token);
    });
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

  $("#previous").click(function(e){
    e.preventDefault();
    getPreviousGames();
  })

}
