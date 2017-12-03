
let turn = 0;
var currentGame = 0;

$(() => {
  attachListeners();
});

function player() {
  return turn % 2 ? 'O' : 'X';
}

function updateState(selectedEl) {
  let token = player();
  $(selectedEl).text(token);
}

function setMessage(string) {
  $('#message').html(string);
}

function checkWinner() {
  let winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
  ];

  let board = [];
  let won = false;

  $('td').text((index, square) => {
    board[index] = square;
  });

  winningCombinations.some(combo => {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return won = true;
      }
  });

  return won;
}

function doTurn(selectedEl) {
  updateState(selectedEl);

  turn++;

  if (checkWinner()) {
    saveState();
    resetState();
  } else if (tieGame()) {
    setMessage("Tie game.")
    saveState();
    resetState();
  }
}

function buttonizeGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button> - Last saved at: ${game.attributes['updated-at']}<br>`);
  $(`#gameid-${game.id}`).on('click', () => {
    reloadState(game.id);
  });
}

function reloadState(gameId) {
  setMessage("");

  $.get(`/games/${gameId}`, (res) => {
    const id = res.data.id;
    const state = res.data.attributes.state;

    let index = 0;

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
          index++;
        }
    }
  
    turn = state.join('').length;
    currentGame = id;
  
    if (!checkWinner() && turn === 9) {
    setMessage('Tie game.')
    }
  });
}

function tieGame() {
  return turn === 9;
}

function saveState() {
  var board = []
  var gameData
 
  $('td').text((index, square) => {
    board[index] = square
  });
 
  gameData = { state: board }
 
  if (currentGame) {
    $.ajax({
        type: 'PATCH',
        url: `/games/${currentGame}`,
        data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
        currentGame = game.data.id;
        buttonizeGame(game.data);
    });
  }
}

function resetState() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function previousState() {
  $('#games').empty();

  $.get('/games', (savedGames) => {
      if (savedGames.data.length) {
        savedGames.data.forEach(game => {
          buttonizeGame(game);
        });
      }
  });
}

function attachListeners() {
  $('td').click(function() {
     if ($(this).text() === "" && !checkWinner()) {
        doTurn(this)
     }
  });

  $('#clear').click(resetState);
  $('#save').click(saveState);
  $('#previous').click(previousState);
}


