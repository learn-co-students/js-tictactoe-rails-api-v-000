// Code your JavaScript / jQuery solution here
// $(function () {
//   $('#form').submit(function(event) {
//     event.preventDefault();

//     var values = $(this).serialize();
//     var posting = $.post('/products', values);
//     posting.done(function(data) {
//       var product = data;
//       $("#productName").text(product["name"]);
//       $("#productPrice").text("$" + product["price"]);
//       $("#productDescription").text(product["description"]);
//     });
//   });
// });

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
}

function updateState(element) {
  $(element).text(player());
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  let board = [];
  let winner = false;

  $('td').text((index, square) => {
    board[index] = square;
  });

  winningCombos.some((winArray) => {
    if (board[winArray[0]] === board[winArray[1]] && board[winArray[1]] === board[winArray[2]] && board[winArray[0]] !== '') {
      setMessage(`Player ${board[winArray[0]]} Won!`);
      winner = true;
      return winner;
    }
  });
  return winner;
}

function doTurn(element) {
  updateState(element);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#previous').on('click', () => showPreviousGames());
  $('#save').on('click', () => saveGame());
  $('#clear').on('click', () => resetBoard());
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    savedGames.data.forEach((game) => {
      $('#games').append(() => {
        return `<button id="gameid-${game.id}">${game.id}</button>`;
      });
      $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
    });
  });
}

function saveGame() {
  const state = [];
  var gameData;

  $('td').text((index, square) => state.push(square));

  gameData = { state: state };

  if (!currentGame) {
    $.post('/games', gameData, (game) => {
      let id = game.data.id;
      currentGame = id;

      $('#games').append(`<button id="gameid-${game.data.id}>${id}</button><br>`);
      $(`#gameid-${id}`).on('click', () => reloadGame(id));
    });
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  }
}

function reloadGame(gameId) {
  $("#message").text('');
  const req = new XMLHttpRequest();
  req.overrideMimeType('application/json');
  req.open('GET', `/games/${gameId}`);
  req.onload = () => {
    const data = JSON.parse(req.response).data;
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

  req.send(null);
}


  // currentGame = id;
  // $.get(`/games/${id}`, (res) => {
  //   console.log('res', res);
