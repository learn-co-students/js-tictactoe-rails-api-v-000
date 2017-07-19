// game vars
var gameId;
var turn = 0;
var WIN_COMBO = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

/*
*** add listeners ***
*/

$(document).ready(function(){
  attachListeners()
})

function attachListeners() {
  //save game button
  $("#save").on("click",function(){
    saveState();
  });

  //show games button
  $("#previous").on("click",function(){
    $.get('/games',function(data){
      var array = data["data"]
      var out = ""
      for(var i=0;i<array.length;i++){
        var button = '<button onclick="restoreState('+array[i]["id"]+')" id="game-'+array[i]["id"]+'">Save Game #'+array[i]["id"]+'</button>'
        out += button
      }
      $("#games").html(out)
    })
  });

  //clear game button
  $("#clear").on("click", function(){
    gameId = undefined;
    turn = 0;
    clearBoard();
    message("New Game Initiated");
  })

  // click spaces
  $("td").on("click", function(){
    doTurn(this);
  })
}


/* Functions */

function getState() {
  //converts board state to array of strings
  var spaces = getHTMLBoard();
  var out = []

  for(var i=0;i<spaces.length;i++){
    out.push(spaces[i].innerHTML)
  }
  return out
}

function getHTMLBoard(){
  return document.getElementsByTagName("td")
}

function restoreState(id){
  $.get('/games/'+id, function(data){
    setState(data["data"]["attributes"]["state"]);
    gameId = data["data"]["id"];
    turn = turnCount(getState());
  })
}

function setState(array){
  var spaces = getHTMLBoard()
  for(var i=0;i<spaces.length;i++){
    spaces[i].innerHTML = array[i]
  }
}

function saveState(){
  if(typeof gameId == 'undefined'){
    $.post('/games',{state: getState()}, function(data){
      gameId = data["data"]["id"];
    });
  } else {
    $.ajax({type: "PATCH", url: `/games/${gameId}`, data: {state: getState()},
    success: function(data){
    }});
  }
}

function turnCount(array){
  var count = 0;
  for(var i=0;i<array.length;i++){
    if(array[i] !== ""){
      count += 1;
    }
  }
  return count;
}

/*
*** TTT functionality ***
*/

function player() {
  if(turn % 2 === 0){
    return "X"
  }
  else{
    return "O"
  }
}

function updateState(space) {
  space.innerHTML = player();
}

function message(text) {
  $("#message").text(text);
}

function won(board, player) {
  bigLoop:
  for(var i=0;i<WIN_COMBO.length;i++){
    smallLoop:
    for(var j=0;j<WIN_COMBO[i].length;j++){
      if(board[WIN_COMBO[i][j]] === player){
        continue;
      }
      else{
        continue bigLoop;
      }
    }
    return true;
  }
  return false;
}

function checkWinner() {
  var board = getState();
  var xWon = won(board, "X");
  var oWon = won(board, "O");

  if(xWon === true){
    message("Player X Won!");
    return true;
  }
  else if(oWon === true) {
    message("Player O Won!");
    return true;
  }
  else {
    return false;
  }
}

// Function to not call checkWinner more than once in doTurn per tests...
function checkWinner2() {
  var board = getState();
  var xWon = won(board, "X");
  var oWon = won(board, "O");

  if(xWon === true){
    message("Player X Won!");
    return true;
  }
  else if(oWon === true) {
    message("Player O Won!");
    return true;
  }
  else {
    return false;
  }
}

function gameRunning() {
  if(checkWinner2() === false && turn < 9){
    return true;
  }
  else {
    return false;
  }
}

function doTurn(space) {
  if(gameRunning() === true && spaceOpen(space) === true){
    updateState(space);
    turn += 1;
    var won = checkWinner();

    if(won === true){
      saveState();
      turn = 0;
      clearBoard();

    }
    else if(turn > 8){
      saveState();
      message("Tie game.");
      turn = 0;
      clearBoard();
    }
  }

}

function spaceOpen(space) {
  if(space.innerHTML === ""){
    return true;
  }
  else {
    return false;
  }
}

function clearBoard() {
  var board = getHTMLBoard();
  for(var i=0;i<board.length;i++){
    board[i].innerHTML = '';
  }
}
