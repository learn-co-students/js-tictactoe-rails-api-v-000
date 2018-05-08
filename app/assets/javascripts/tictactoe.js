//const WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var turn = 0;
var currentGameState = new Array(9).fill("")
var currentGameId = 0


$(function(){
  attachListeners();
});

function saveGame(){
  gameData = {state: currentGameState}

  if (currentGameId){
    $.ajax({
      method: "PATCH",
      url: "/games/" + currentGameId,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(data){
      currentGameId = data["data"]["id"]
    });
  }
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

function doTurn(clickedElement){
  if ($(clickedElement).text()==""){
    updateState(clickedElement);
    turn++;
  }
  if (checkWinner()){ //won
    saveGame();
    clearGame();
  } else if (turn === 9){ //tied
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function updateState(clickedElement){
  var token = player();
  $(clickedElement).text(token);
  squareIndex = getTableIndex(clickedElement);
  currentGameState[squareIndex] = token;
}

function setMessage(message){
  $("#message").text(message);
}

function getTableIndex(clickedElement){
  var x = $(clickedElement).data("x")
  var y = $(clickedElement).data("y")
  var correspondance = [[0,1,2], [3,4,5],[6,7,8]]
  var tableIndex = correspondance[y][x];
  return tableIndex;
}

function getTakenPositions(){
  var XPositionIndices = getTakenPositionsByToken("X");
  var OPositionIndices = getTakenPositionsByToken("O");

  return {"X": XPositionIndices, "O": OPositionIndices};
}


function getTakenPositionsByToken(token){
  var positionIndices = [];
  var positions = $("td").filter(function(td){
    return this.innerHTML == token;
  });
  $(positions).each(function(){
    var tableIndex = getTableIndex(this)
    positionIndices.push(tableIndex)
  });
  return positionIndices
}

function getPreviousGames(){
  $.get('/games', function(games){
    var existingGameIDs = []

    $("button[id^='game-btn']").each(function(index, button){
      existingGameIDs.push(button.textContent)
    });

    games["data"].forEach(function(game){
      if (!existingGameIDs.includes(game["id"].toString())){
        var button = document.createElement("button")
        var text = document.createTextNode(game["id"])
        button.appendChild(text);
        button.setAttribute("id", "game-btn-"+ game["id"])
        $("#games").append(button);
        $("#game-btn-"+game["id"]).click(function(){
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
          })
        });
      }
    });
  });
}


function fillInTable(stateArr){
  var numberToXYConcordances = [[0,0], [1,0], [2,0], [0,1], [1,1], [2, 1], [0,2], [1,2],[2,2]];
  //I: ["X", "O", "", "X", "O", "", "", "", "X"]
  // Desired behaviour: update the table with the correct token for each square
    stateArr.forEach(function(token, index){
      var XYCords = numberToXYConcordances[index];
      // grab the x y cordinates, grab the corresponding square:
      $(`td[data-x='${XYCords[0]}'][data-y='${XYCords[1]}']`).text(token);
    });
}

function checkWinner(){
  var hasWinner = false
  if (checkWinnerByToken("X")){
    setMessage(`Player X Won!`);
    hasWinner = true;
  } else if (checkWinnerByToken("O")){
    setMessage(`Player O Won!`);
    hasWinner = true;
  }
  return hasWinner;
}

function checkWinnerByToken(token){
  const WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var positions = getTakenPositions();
  var isWinner = false;
  WINNING_COMBOS.forEach(function(combo){
    var isWinningCombo = combo.every(function(element){
      return positions[token].indexOf(element) >= 0;
    });
    if (isWinningCombo){
      isWinner = true;
    }
  });
  return isWinner
}

function clearGame(){
  $('td').empty();
  turn = 0;
  currentGameId = 0;
}


function attachListeners(){
  $("td").on('click', function(){
    if (!checkWinner()){
      doTurn(this);
    }

  });

  $("#save").click(function(){
    saveGame();
  });
  $("#clear").click(function(){
    clearGame();
  });

  $("#previous").click(function(){
    getPreviousGames();
  })

}
