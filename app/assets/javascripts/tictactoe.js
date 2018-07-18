// Code your JavaScript / jQuery solution here
var turn = 0;
var current = 0;

$(document).ready(function(){
  attachListeners(); 
});

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this)
    }
  });
  $('#save').on('click', function(){
    saveGame()
  });
  $('#previous').on('click', function(){
    showPreviousGames()
  }); 
  $('#clear').on('click', function(){
    resetBoard() 
  }); 
}

function player(){
  if(turn % 2 === 0){
    return 'X';
  }
  else {
    return 'O'
  }
}

function updateState(square){
  $(square).text(player())
}

function setMessage(string){
  $("#message").text(string)
}

function currentBoard(){
  var squares = $("td")
  var board = []
  for(var i of squares){
    board.push(i.innerHTML)
  }
  return board
}

function doTurn(square){
  if(validMove(square)){
    updateState(square);
    turn ++;
  }
  gameOver();
}

function validMove(square){
  if(square.innerHTML === ''){
    return true;
  } else {
    return false;
  }
}

function checkWinner(){
  var winner = false;
  var board = {}; 
  const win = [
    [0,1,2], [0,3,6], [0,4,8], [6,4,2], [2,5,8], [6,7,8], [3,4,5], [1,4,7] 
  ]; 
  $('td').text((index, square) => board[index] = square); 

  win.find(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`); 
      return winner = true; 
    }
  });
  return winner;
}


function allGames(){
  $.get("/games").done(function(resp){
    var games = resp.data;
    for(var game of games){
      gameButtons(game)
    }
  })
}

function saveGame(){
 var state=[];
  $('td').text((index, square) => {
    state.push(square) 
  }); 
    var gameData = { state: state }
  if (current === 0){
    $.post('/games', {state: state}, function(response) {
      current = response.data.id; 
      $('#games').append(`<button id="gameid-${response.data.id}">${response.data.id}</button><br>`) 
      $("#gameid-" + response.data.id).on('click', function(){
        reloadGame(response.data.id)
      });
    }); 
  } else {
    $.ajax({
      type: 'PATCH', 
      url: `/games/${currentGame}`, 
      data: {state: state}
    }); 
  }
}

function isTie(){
  if(turn === 9 && !checkWinner()){
    setMessage("Tie game.");
    return true
  }
}


function resetBoard(){
  $('td').empty()
  turn = 0
  current = 0
}

function showPreviousGames () {
  $('#games').empty()
  $.get('/games', (games) => {
    games.data.map((game) => {
      $('#games').append(`<button id="game-${game.id}" onclick="showGame(${game.id})">${game.id}</button>`)
    })
  })
}

function showGame (id) {
  current = id
  $.get(`/games/${id}`, (game) => {
    var state = game.data.attributes.state
    $('td').each((index, square) => {
      turn = state.join('').length
      square.innerHTML = state[index]
    })
  })
}

function gameOver(){
  if(checkWinner() || isTie()){
    saveGame();
    resetBoard();
    return true;
  } else {
    return false;
  }
}