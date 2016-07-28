'use strict';


$(document).ready(function () {
  attachListeners();
});

var turn = 0;
var method = ""
var url = ""
var gameOver;
var currentGame = [];
var gameResult = '';
var currentGame = ["","","","","","","","","",];
var state = 0;
var emptyBoardArr = ["","","","","","","","","",];
var lastTurn = '';
var reset = false;
var gameId = "false";
var validMove = true;
var allGames = [];

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
   gameId = 'false'
   lastTurn = turn
  turn = 0;
   $("td").each(function(cell){
     $(this).text('');
   });
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
  updateGame(function(){
    console.log("had check reset here")
  })
}


function listGames() {
  $.get("/games",function(response) {
    $("#games").html("");
    response["games"].forEach(function(game){
      $("#games").append("<li data-gameid="+game["id"]+" class=oldGames id=" +game["id"] + ">" + game["id"]+ "</li>")
    })
  }).done(function (response) {
    allGames = response["games"]
    $(".oldGames").on('click', function(event) {
      console.log("clicked it");
      loadGame(event);
    });
  });
}

function updateGame(callback) {
callback();
    if(lastTurn > 1 && lastTurn !== ''){

      gameId = 'false';
      lastTurn = '';
    }

    if(gameId === 'false'){
      gameOver = false;
      method = 'POST'
      url = '/games'
    }else {
      method = 'PATCH'
      url = "/games/" + gameId
    }

  console.log(method)
  console.log(gameId)
  $.ajax({
    type: method,
    url: url,
    dataType: 'json',
    data: { game: {state: currentGame}}
  }).done(function (result) {
    if(method === 'POST'){
      gameId = result["game"]["id"]
      console.log("Game Created id=" + gameId)
    } else {
      console.log("Game Updated id=" + gameId)
    }
    checkReset();
    return result
  });
}

function loadGame(event) {

  console.log("went to load game event = " + event)
  var oldGameId = parseInt(event.currentTarget["id"])
  console.log("old Game ID=" + oldGameId)
  debugger;
    $("td").each(function(index){
      $(this).html(allGames[oldGameId - 1]["state"][index]);
    })

}

// function createGame(callback) {
//   callback();
//
//   console.log("visited Create Game, Game Id currently" + gameId)
//   $.post('/games',{game:{state: currentGame} }, function(result) {
//     gameId = result["game"]["id"]
//     console.log("New Game Created id=" + result["game"]["id"])
//     console.log(turn)
//
//     console.log("Right before reset in Create Game")
//     console.log("setCurrentGame= " + setCurrentGame().get() + " currentGame = " + currentGame + "Empty Board Array= " + emptyBoardArr)
//     //checkReset();
//     return result;
//   }).fail(function (response) {
//     // console.log(response["statusText"])
//     // console.log(response)
//     // console.log(response["status"])
//   });
// }

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
      gameOver = true;
      resetGame();
    } else if (turn === 9) {
      message("Tie game")
      gameOver = true;
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
  if (currentGame !== 0) {
    if(emptyBoard() && emptyBoardArr !== currentGame ) {
      if(turn === 0){
        console.log("entered reset in create game")
        gameId = 'false';
        console.log("Game Id set to false")
      }
    }
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
