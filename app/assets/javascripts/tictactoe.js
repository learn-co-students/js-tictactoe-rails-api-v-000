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
  if(turn < 9 && !HasTheGameBeenWon()){
    updateState.call(this);
    // if(numberTokensOnTheBoard(board) === tokens+1){
    //   turn ++ ;
    // }
    console.log("current turn is ...", turn)
    turn ++ ;
    console.log("you just played, current turn is...", turn)
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
  switch (true){
    case (numberTokensOnTheBoard(board) === 9 && !HasTheGameBeenWon()):
      return tieGame();
    case (turn >= 4):
      return HasTheGameBeenWon();
    default:
      return false;
  }
}


function HasTheGameBeenWon(){
  var lastMove = lastToken();
  winningCombo.forEach( combo => {
    var result = 0;
    combo.forEach( position => {
      if(board[position] === lastMove){
        result ++;
      }
    });

    if(result === 3){
      saveGame();
      resetGame();
      return message(`Player ${lastMove} Won!`);
    }
  });
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
      var boardArray = data.state
      resetGrid();
      displayBoardOnGrid(boardArray)
      loadGameParams(boardArray, gameId)
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
  var id = currentGame;
  var data = {
    game: {
      // id: currentGame,
      state: board
    }
  }
  if(currentGame === 0){
    // delete data.game.id;
    jsSave(data);
  } else {
    jsUpdate(data, id);
  }
}


function jsSave(gameInfo){
  $.ajax({
    type: 'POST',
    url: '/games',
    data: gameInfo
  }).success(function(data){
    currentGame = data.id;
  });
  // $.post('/games', gameInfo).done(function(data){
  //   currentGame = data.id;
  // });
}


function jsUpdate(gameInfo, gameId){
  $.ajax({
    type: 'PATCH',
    url: '/games/' + gameId,
    data: gameInfo
  }).success(function(data){});
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
  return turn % 2 === 0 ? "O" : "X"
}


function player(){
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
