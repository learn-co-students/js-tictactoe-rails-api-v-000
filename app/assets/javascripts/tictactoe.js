'use strict';


$(document).ready(function () {
  attachListeners();
});

var turn = 0;
var currentGame = [];
var gameResult = '';
var currentGame = ["","","","","","","","","",];
var state = 0;
var emptyBoardArr = ["","","","","","","","","",];
var lastTurn = 0;
var reset = false;
var gameId = "false";
var validMove = true;

const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
 ]

 function resetGame() {
   turn = 0;
   $("td").each(function(cell){
     $(this).text('');
   });
console.log("reset set to " +reset+ "in resetGame()" )
   saveGame(function () {
     console.log("Game Id before reset = " + gameId)
   });
 }

function player() {
  if(turn % 2 === 0){
    return "X";
  }else {
    return "O";
  };
}

function attachListeners() {
  $("td").on('click', function(event) {
    doTurn(event);
  });

  $("#save").on('click', function() {
    saveGame();
  });

  $("#previous").on('click', function() {
    listGames();
  });
}


function saveGame(callback) {
  console.log("visited save Game game id =" + gameId)

  if(gameId === 'false'){
    createGame(callback);
  }else {
    updateGame(callback);
  }
}


function listGames() {
  $.get("/games",function(response) {
    $("#games").html("");
    response["games"].forEach(function(game){
      $("#games").append("<li data-gameid="+game["id"]+" class=oldGames id=" +game["id"] + ">" + game["id"]+ "</li>")
    })
  }).done(function () {
    $(".oldGames").on('click', function(event) {
      console.log("clicked it");
      loadGame(event);
    });
  });
}

function updateGame(callback) {
  console.log("visited update Action")
  $.ajax({
    type: "PATCH",
    url: "/games/" + gameId,
    dataType: 'json',
    data: { game: {state: currentGame}}
  }).done(function (result) {
    console.log("Game Updated id=" + result["game"]["id"])
    console.log(result)
    checkReset();
    return result
  });
}

function loadGame(event) {
  console.log("old Game ID=" + event.currentTarget["id"])
  var oldGameId = event.currentTarget["id"]
  $.get("/games/" + oldGameId + ".json", function(response) {
    $("td").each(function(index){
      debugger;
      $(this).html(response["game"]["state"][index]);
    })
    gameId = oldGameId;
    return response
  }).done(function(response) {
    console.log("fail")
    console.log("load-"+response)
    console.log("Game" + response["game"]["state"])
  });

}

function createGame() {
  console.log("visited Create Game, Game Id currently" + gameId)
  $.post('/games',{game:{state: currentGame} }, function(result) {
    gameId = result["game"]["id"]
    console.log("New Game Created id=" + result["game"]["id"])
    console.log(turn)

    console.log("Right before reset in Create Game")
    console.log("setCurrentGame= " + setCurrentGame().get() + " currentGame = " + currentGame)
    checkReset();
    return result;
  }).fail(function (response) {
    checkReset();
    // console.log(response["statusText"])
    // console.log(response)
    // console.log(response["status"])
  });
}

function doTurn(event) {
  updateState(event);
  if(validMove){
    turn += 1;
  }

  checkWinner();
}

function updateState(event) {

  var target = $(event.currentTarget).text()
  if(target === ""){
    $(event.currentTarget).html(player());
    validMove = true
  } else {
    alert("position occupied");
    validMove = false;
  }

}

function checkWinner() {
  currentGame = setCurrentGame().get();
  WIN_COMBINATIONS.map(function(pattern){
    if (gameWon(pattern,currentGame)== true) {
      resetGame();
    } else if (turn === 9) {
      message("Tie game")
      resetGame();
      return false
    }else {
      return false
    }
  });
  return false
}

function gameWon(pattern, currentGame) {
  if(currentGame[pattern[0]] && currentGame[pattern[0]] === currentGame[pattern[1]] && currentGame[pattern[1]] === currentGame[pattern[2]]){
    if(currentGame[pattern[0]] === "X"){
      message("Player X Won!");
      return true
    }else {
      message("Player O Won!");
      return true
    };

  }
}

function checkReset() {

    if(emptyBoard() && emptyBoardArr !== currentGame ) {
      console.log("entered reset in create game")
      gameId = 'false';
      reset = false;

  }

}


function emptyBoard() {
  if(setCurrentGame().get().sort().join(',') === emptyBoardArr.sort().join(',')){
    return true
  } else return false
}

function message(gameResult) {
  $("#message").html(gameResult)
}

function setCurrentGame() {
  return $("td").map(function(token){
    return $(this).text();
  })
}
