$(function(){
  attachListeners();
})

var turn = 0;
var currentGame = 0;
var board = ["", "", "", "", "", "", "", "", ""];

const winningCombo = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function attachListeners(){
  $("table tr td").on("click", function(e){
    doTurn.call(this)
  });

  $(":button#save").click(function(e){
    e.preventDefault;
    saveGame();
  });

  $(":button#previous").click(function(e){
    e.preventDefault;
    displayListOfPreviousGames();
  });
}


function doTurn(){
  turn = numberTokensOnTheBoard(board);
  var gameIsWon = hasTheGameBeenWon()
  // debugger
  if (gameIsWon){
    resetGame();
  }
  else{
    updateState.call(this)
    // console.log("current turn is ...", turn)
    turn ++ ;
    // console.log("you just played, current turn is...", turn)
    checkWinner();
  }
}


function updateState(){
  var x = parseInt($(this).data("x"))
  var y = parseInt($(this).data("y"))

  var token = player();
  if($(this).html() === ""){
    $(this).html(token);
    updateBoard(token, x, y)
  }
}


function checkWinner(){
  // debugger
  if(numberTokensOnTheBoard(board) < 4){
    return false ;
  } else {
    var gameIsWon = hasTheGameBeenWon()
// debugger
    switch (true){
      case (numberTokensOnTheBoard(board) >= 9 && !gameIsWon):
        return tieGame();
      case (turn >= 4):
        return gameIsWon;
    }
  }
}


function hasTheGameBeenWon(){
  var lastMove = lastToken();
  // debugger
  // forEach(winningCombo, combo => {
  //   var result = 0;
  //   forEach(combo, position => {
  //     if(board[position] === lastMove){
  //       result ++;
  //     }
  //   });
  for (let i = 0, l = winningCombo.length; i < l; i++){
    var result = 0;
    var combo = winningCombo[i];

    for (let j = 0, k = combo.length; j < k; j++){
      if(board[combo[j]] === lastMove){
        result ++;
      }
    }

    if(result === 3 && currentGame){
      // debugger
      resetGameId();
      // debugger
      saveGame();
      message(`Player ${lastMove} Won!`);
      return true;
    }
    else if(result === 3){
      saveGame();
      resetGame();
      message(`Player ${lastMove} Won!`);
      return true;
    }
  }
  // });
  return false;
}


// function forEach(array, callback){
//   for (let i = 0, l = array.length; i < l; i++){
//     callback(array[i]);
//   }
// }

function resetGameId(){
  currentGame = 0;
}


function displayListOfPreviousGames(){
  $.get("/games", function(data){
    $("#games").html("");
    data.games.map( game => {
      $("#games").append(`<li data-id=${game.id}>` + game.id + '</li>')
    }).join("");
    loadAPreviousGame();
  });
}


function loadAPreviousGame(){
  $("#games li").on("click", function(e){
    var gameId = $(this).data("id")
    $.get("/games/" + gameId, function(data){
      var boardArray = data.game.state
      resetGrid();
      displayBoardOnGrid(boardArray)
      loadGameParams(boardArray, gameId)
      // debugger
      // checkWinner()
    });
  });
}


function displayBoardOnGrid(boardArray){
  board = boardArray;
  var cells = $("tbody td");
  for (let i = 0, l = cells.length; i < l; i++){
    $(cells[i]).html(boardArray[i]);
  }
}


function loadGameParams(boardArray, gameId){
  board = boardArray;
  currentGame = gameId;
  turn = numberTokensOnTheBoard(board);
}


function numberTokensOnTheBoard(board){
  var tokens = 0;
  for(let i = 0, l = board.length; i < l; i ++){
    if(board[i] !== ""){
      tokens++;
    }
  }
  return tokens;
}


function saveGame(){
  // debugger
  var GameId = currentGame;
  var data = {
      game: {
        // id: currentGame,
        state: board
      }
  }
  if(GameId === 0){
    // delete data.game.id;
    debugger
    jsSave(data);
  } else {
    debugger
    jsUpdate(data, GameId);
  }
}


function jsSave(gameInfo){
  $.ajax({
    type: 'POST',
    url: '/games',
    data: gameInfo,
  }).success(function(data){
    // console.log(data)
    currentGame = data.game.id;
  });
}


function jsUpdate(gameInfo, gameId){
  $.ajax({
    type: 'PATCH',
    url: '/games/' + gameId,
    data: gameInfo
  }).success(function(data){
    // debugger

  });
}


function tieGame(){
  message("Tie game");
  resetGame();
  return false;
}


function resetGame(){
  turn = 0;
  currentGame = 0;
  board = ["", "", "", "", "", "", "", "", ""];
  resetGrid();
}


function resetGrid(){
  var $rows = $("tbody")[0].children
  for (let i = 0, l = $rows.length; i < l; i++){
    var $cols = $($rows[i])[0].children

    for (let i = 0, l = $cols.length; i < l; i++){
      $($cols[i]).html("")
    }
  }
}

function lastToken(){
  // return numberTokensOnTheBoard(board) % 2 === 0 ? "O" : "X"
  return turn % 2 === 0 ? "O" : "X"
}


function player(){
  // return numberTokensOnTheBoard(board) % 2 === 0 ? "X" : "O"
  return turn % 2 === 0 ? "X" : "O"
}


function message(text){
  $("#message").text(text)
}


function updateBoard(token, x, y){
  switch(true){
    case (x === 0 && y === 0):
      board[0] = token;
      break;
    case (x === 1 && y === 0):
      board[1] = token;
      break;
    case (x === 2 && y === 0):
      board[2] = token;
      break;
    case (x === 0 && y === 1):
      board[3] = token;
      break;
    case (x === 1 && y === 1):
      board[4] = token;
      break;
    case (x === 2 && y === 1):
      board[5] = token;
      break;
    case (x === 0 && y === 2):
      board[6] = token;
      break;
    case (x === 1 && y === 2):
      board[7] = token;
      break;
    case (x === 2 && y === 2):
      board[8] = token;
      break;
  }
}
