// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var turn = 0;
var currentGame = 0;

//Document.Ready
$('document').ready(function(){
  attachListeners();
});

// Atttach Listeners
function attachListeners(){
  document.getElementById('td').on('click', function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  document.getElementById('save').addEventListener('click', () => saveGame());
  document.getElementById('previous').addEventListener('click', () => previousGames());
  document.getElementById('clear').addEventListener('click', () => clearGame());
}


//Define Player
var player = () => turn % 2 ? '0' : 'X';

// Define turn

function doTurn(square){
  updateState(square);
    turn++;

    if(gameWon()){
        saveGame();
        clearGame();
    }else if(turn === 9){
      setMessage('Tie Game!');
        saveGame();
        clearGame();
    }
}


//Update selected Square

function updateState(squre){
  var token = player();
  document.getElementById('square').text(token);
}

// Print Messages

function setMessage(message){
  document.getElementById('message').text(message);
}

// Check Winner

function checkWinner() {
  var board = {};
  var winner = false;

  document.getElementById('td').text((index, square) =>
    board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

// Clear Game

function clearGame(){
  document.getElementById('td').empty();
    turn = 0;
    currentGame = 0;
}


// SAVE GAME
document.selectElementById('save').on('click', () => saveGame());

function saveGame(){
  var state = [],
  var gameData;

  document.selectElementById('td').text((index, square) => {
    state.push(square);
  });

  gameData = {state: state};

  if(currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}


// PREVIOUS GAME
document.selectElementById('games').addEventListener('click', () => previousGames());

  function previousGames(){
    games = document.selectElementById('games')
    games.empty();
    $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
        savedGames.data.forEach(buttonizePreviousGame);
      }
    });
  }

  function buttonizePreviousGame(game){
    document.getElementById('game').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    document.getElementById(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
  }

// RELOAD GAME

  function reloadGame(gameID) {

  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
      }
    };

    xhr.send(null);
  }
