// Code your JavaScript / jQuery solution here
var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player(){
  return turn % 2 === 0 ? 'X' : 'O'
}

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
    doTurn(this)
    }
  })
  $('#save').on('click', ()=> saveGame())
  $('#previous').on('click', ()=> previousGames())
  $('#clear').on('click', ()=> clearGame())
}

function doTurn(square){
  updateState(square)
  turn++
  checkWinner()
}

function updateState(square){
  (square).append(player())
}

function setMessage(str){
  $('#message').append(str)
}

function checkWinner(){
  var board = {}
  var winner = false;

  $('td').text((index, square) => board[index] = square);
  WINNING_COMBINATIONS.some(function(win_combo){
    if (board[win_combo[0]] == board[win_combo[1]] && board[win_combo[2]] == board[win_combo[1]] && board[win_combo[1]] !== ""){
      saveGame()
      setMessage(`Player ${board[win_combo[0]]} Won!`);
      return winner = true;
      resetBoard()
    }
    else if (!winner && turn === 9){
      setMessage('Tie game.')
      saveGame()
      resetBoard()
    }
  })
  return winner
}

function currentBoard(){
  var board =[];
   $('td').each(function() {
     board.push(this.innerHTML)
   })
   return board;
}

function saveGame(){
  var url, method;
  var game = {state: currentBoard()}

  if (currentGame){
    url ="/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    data: game,
    success: function(data){
     currentGame = data.data.id
    }
  })
}

function clearGame(){
  resetBoard()
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}


function previousGames(){
    $('#games').empty();
    $.get('/games', (oldGames) => {
      if (oldGames.data.length) {
        oldGames.data.forEach(buttonizePreviousGame);
      }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID) {
  document.getElementById('games').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const gameData = JSON.parse(xhr.responseText).data;
    const id = gameData.id
    const state = gameData.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = id;
  };

  xhr.send(null);
}
