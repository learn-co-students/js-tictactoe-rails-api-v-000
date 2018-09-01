// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
const WINNING_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

$(document).ready(function() {
  attachListeners();
});

function player(){
  if (turn % 2 === 0 || turn === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(cell){
  $(cell).text(player());
}

function setMessage(message){
  $("#message").html(message)
}

function checkWinner() {
    var board = getBoard();
    WINNING_COMBINATIONS.some(function (combo){
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
        setMessage(`Player ${board[combo[0]]} Won!`)
        return winner = true;
      }
      else {
        return winner = false;
      }
    })
    return winner
}

function getBoard(){
  return $("td").toArray().map((element) => {return element.innerHTML})
}

function doTurn(cell){
  updateState(cell);
  turn++;
  if (checkWinner()){
      saveGame();
      resetBoard();
  }else if(turn === 9){
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame=0;
}

function attachListeners(){
  $("td").on('click', function(){
    if(!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#previous').on('click', () => previousGames());
  $('#save').on('click', () => saveGame());
  $('#clear').on('click', () => resetBoard());
}

function previousGames(){
  $("#games").empty();
  $.get('/games', function(previousGame){
    for(i=0; i < previousGame.data.length; i++){
      $("#games").append('<button name="BUTTON" class="game_button" data-id="' + previousGame.data[i].id + '" data-state="' + previousGame.data[i].state + '">Game #' + (i+1) + '</button>')
    };
    loadGame();
  }, "json");
}

function loadGame() {
  $("button").on("click", function() {
    $.get(`/games/${this.attributes["data-id"].value}`, function(game) {
      boardState = game.data.attributes.state;
      currentGame = game.data.id;
      for (var i = 0; i < 9; i++) {
        $("td")[i].innerHTML = boardState[i];
      }
      turn = boardState.join('').length;
    });
  });
}


function saveGame() {
  var gameState = getBoard();
  if (currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {state: gameState}
    });
  }else{
    $.post('/games', {state: gameState}, function(game){
      currentGame = game.data.id;
  });
  }
}
