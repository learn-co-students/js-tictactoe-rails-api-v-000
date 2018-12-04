// Code your JavaScript / jQuery solution here

//variables
const solutions = [
  [0,1,2],
  [0,4,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [2,4,6],
  [3,4,5],
  [6,7,8]
]
var turnCount = 0;
var currentGame = 0;


//functions
var player = () => turn % 2 ? 'O' : 'X'; // this works where a full function does not... 


$(document).ready(function() {
  attachListeners();
});

//listener
function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

//functions proper
function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

var updateState = function(square) {
   var marker = player();
   $(square).text(marker);
}

var setMessage = function(string) {
  $("#message").text(string)
}

var checkWinner = function(){
  var board = {};
    var winner = false;
    $('td').text((index, square) => board[index] = square);
    solutions.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
  });
  return winner;
}

//button functions
  function resetBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
  }

  function saveGame() {
    var state = [];
    var gameData;
  
    $('td').text((index, square) => {
      state.push(square);
    });
  
    gameData = { state: state };
  
    if (currentGame) {
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

function showPreviousGames(){
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if(savedGames.data.length){
      savedGames.data.forEach(previousGame);
    }
  })
}

function previousGame(game){
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
  }

//xhr
function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const request = new XMLHttpRequest;
  request.overrideMimeType('application/json');
  request.open('GET', `/games/${gameID}`, true);
  request.onload = () => {
    const data = JSON.parse(request.responseText).data;
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
  }
  request.send(null);
}
