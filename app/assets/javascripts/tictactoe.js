'use strict';


$(document).ready(function () {
  attachListeners();
});

var turn = 0;
var currentGame = [];
var gameResult = '';
var currentGame = [];
var state = 0;
var gameId = "false";

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


function saveGame() {
  if(isNaN(gameId)){
    createGame();
  }else {
    updateGame();
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

function updateGame() {
  $.ajax({
    type: "PATCH",
    url: "/games/" + gameId,
    data: {state: currentGame}
  }).done(function (result) {
    console.log(result)
  });
}

function loadGame(event) {
  var oldGameId = event.currentTarget["id"]
  $.get("/games/" + oldGameId + ".json", function(response) {
    $("td").each(function(index){
      $(this).html(response["state"][index]);
    });
  })
  gameId = oldGameId;
}

function createGame() {
  $.post("/games",{state: currentGame}, function(result) {
    gameId = result["id"]
    console.log(result)
  });
}

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();
}

function updateState(event) {
  $(event.currentTarget).html(player());
}

function checkWinner() {
  currentGame = setCurrentGame().get();
  WIN_COMBINATIONS.map(function(pattern){
    if (gameWon(pattern,currentGame)== true) {
      true
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
      resetGame();
      return true
    }else {
      message("Player O Won!");
      resetGame();
      return true
    };

  }
}

function message(gameResult) {
  $("#message").html(gameResult)
}

function setCurrentGame() {
  return $("td").map(function(token){
    return $(this).text();
  })
}


function resetGame() {
  saveGame();
  $("td").each(function(cell){
    $(this).text('');
  })
  turn = 0;
}
