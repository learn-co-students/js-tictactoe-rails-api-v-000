var turn = 0;
var currentSavedGame = null;

$(function() {
  attachListeners();
});

function player() {
  return turn % 2 ? "O" : "X";
}

function updateState(domEl) {
  const playerString = player();
  domEl.innerHTML = playerString;
}

function setMessage(message) {
  $('#message').text(message);
}

function getCurrentBoard() {
  // we need to convert to a normal array. If we keep the array style object
  // we get back from jQuery unfortunately that includes some other special jquery stuff
  // and when we save to the server it doesn't work. Essentially we just need the array of values
  return Array.from($('td')).map(x => x.innerHTML);
  // return $('td').map(function() {
  //   return $(this).text();
  // });
}

function populateBoard(state) {
  const tds = $('td');

  for(let i = 0; i < state.length; i++) {
    tds[i].innerHTML = state[i];
  }
}

function checkWinner() {
  const winningCombo = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 5, 9],
    [3, 5, 7]
  ];

  const currentBoard = getCurrentBoard();
  const players = ["X", "O"];

  for(let player of players) {
    for (let combo of winningCombo) {
      if(currentBoard[combo[0] - 1] === player
        && currentBoard[combo[1] - 1] === player
        && currentBoard[combo[2] - 1] === player
      ) {
        setMessage(`Player ${player} Won!`);
        return true;
      }
    }
  }

  return false;
}

function doTurn(domEl) {
  updateState(domEl);
  turn += 1;

  const winner = checkWinner();

  if(winner) {
    saveGame();
  }

  if(turn === 9) {
    if(!winner) {
      setMessage('Tie game.');
      saveGame();
    }
    clearGame();
  }
}

function clearGame() {
  $('td').html('');
  turn = 0;
  currentSavedGame = null;
}

function loadGame(id) {
  clearGame();

  $.get(`/games/${id}`, function(response) {
    const boardState = response.data.attributes.state;
    const numberOfTurns = boardState.filter(stateValue => stateValue !== '').length;

    populateBoard(boardState);
    turn = numberOfTurns;
    currentSavedGame = response.data.id;
  });
}

function saveGame() {
  const currentBoard = getCurrentBoard();

  if(currentSavedGame) {
    const saveGameResponse = $.ajax({
      url: `/games/${currentSavedGame}`,
      method: 'PATCH',
      data: { state: currentBoard }
    });
  } else {
    const saveGameResponse = $.post('/games', { state: currentBoard });
    saveGameResponse.done(function(response) {
      const gameId = response.data.id;
      $('#games').append(`<button data-id="${gameId}">${gameId}</button>`);

      currentSavedGame = gameId;
    });
  }
}

function previousGames() {
  $.get('/games', function(response) {
    const games = response.data.map(game => `<button data-id="${game.id}">${game.id}</button>`);
    $('#games').html(games);

    $('#games button').on('click', function() {
      const id = $(this).data('id');
      loadGame(id);
    });
  });
}

function attachListeners() {
  // clicking on a square
  $('td').on('click', function(e) {
    const winner = checkWinner();
    if(!winner) {
      const domEl = this;
      if(domEl.innerHTML === '') {
        doTurn(this);
      }
    }
  });

  $('#save').on('click', saveGame);
  $('#previous').on('click', previousGames);

  // clicking on previous button
  $('#clear').on('click', function() {
    clearGame();
  });
}
