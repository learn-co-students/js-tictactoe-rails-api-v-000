// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners();
});

const WIN_COMBOS = [
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

var player = () => turn % 2 ? 'X' : 'O';

function getState(cell) {
  var state = [];
  $('td').text((i, cell) => {
    state.push(cell);
  });
  return state;
}

function updateState(cell) {
  $(cell).text(player());
}

function setMessage(message) {
  $('#message').text(message);
 }

 function checkWinner() {
   let winner = false;
   let board = {};
   $('td').text((i, cell) => board[i] = cell);
   WIN_COMBOS.some(function(combo) {
     if (board[combo[0]] !== "" &&
         board[combo[0]] === board[combo[1]] &&
         board[combo[1]] === board[combo[2]]) {
       setMessage(`Player ${board[combo[0]]} Won!`);
       return winner = true;
     }
   });
   return winner;
 }

function doTurn(cell) {
  updateState(cell);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("It's a Tie. Womp womp");
    saveGame();
    clearBoard();
  }
}

function attachListeners() {
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPrevGames());
  $('#clear').on('click', () => clearBoard());
  $('td').on('click', function(){
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  });
}

function saveGame() {
  let gameData = {
    state: getState()
  };
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(
        `<button id="gameid-${game.data.id}">Game ${game.data.id}</button><br>`
      );
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    });
  }
}

function showPrevGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if(savedGames.data.length) {
      savedGames.data.forEach(makeButton);
    }
  });
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function makeButton(game) {
  $('#games').append(
    `<button id="gameid-${game.id}">Game ${game.id}</button><br>`
  );
  $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
}

function loadGame(gameID) {
  document.getElementById('message').innerHTML = '';
  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;
    let i = 0;
    for (let y=0; y<3; y++) {
      for (let x=0; x<3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[i];
        i++;
      }
    }
    turn = state.join('').length;
    currentGame = id;
    if (!checkWinner() && turn === 9) {
      setMessage("It's a tie.");
    }
  };
  xhr.send(null);
}
