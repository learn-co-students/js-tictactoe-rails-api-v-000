var turn = 0; 
var currentGame = 0; 

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

function player() {
  if (turn % 2 === 0){
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square){
    $(square).text(player())
}

function setMessage(string){
  $('#message').text(string)
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

function doTurn(square){
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9){
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard(){
  $('td').empty()
  turn = 0
  currentGame = 0
}

function saveGame(){
 var state=[];
  $('td').text((index, square) => {
    state.push(square) 
  }); 

  if (currentGame === 0){
    $.post('/games', {state: state}, function(response) {
      currentGame = response.data.id; 
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

function showPreviousGames(){
  $("#games").empty()
  $.get('/games').done(function(savedGames){
    savedGames.data.forEach(createPrevGameButton)
  });
}

function createPrevGameButton(prevGame){
  $('#games').append(`<button id="gameid-${prevGame.id}">${prevGame.id}</button><br>`) 
  $(`#gameid-${prevGame.id}`).on('click', function(){
    reloadGame(prevGame.id)
  });
}

function reloadGame(gameId){
  $.get(`/games/${gameId}`).done(function(game){
    currentGame = game.data.id 
    const state = game.data.attributes.state 
    turn = 0 
    var space = $('td')

    for (var i = 0; i < 9; i++) {
      space[i].innerHTML = state[i]
      if (state[i] !== "") {turn++}
    }
  })
}
