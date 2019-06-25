// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

$(document).ready(function() {
  attachListeners();
})

function attachListeners() {
  userClick();
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGame());
  $('#clear').on('click', () => resetBoard());
}

function userClick(){
  $('td').on('click', function(){
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  })
}

function saveGame() {
  let state = [];

  $('td').text((index, td) => {
    state.push(td);
  });

  if (currentGame !== 0) {
    $.ajax({
      url: `/games/${currentGame}`,
      data: {
        state: state,
        id: currentGame
      },
      type: 'PATCH'
    });
  } else {
    $.post('/games', {state: state}).done((data) => {
      currentGame = data['data']['id'];
    });
  }
}

function previousGame() {
  $.get('/games', (data) => {
    let games = data['data'];
    if (games.length > 0) {
      let gamesHtml = '';

      $(games).each((i, game) => {
        gamesHtml += '<button data-id="' + game['id'] + '" class="game-button">' + game.id + '</button><br>';
      });
      $('#games').html(gamesHtml);
      $('.game-button').on('click', (event) => {
        loadPreviousGame(event);
      });
    }
  });
}

function loadPreviousGame(event) {
  let id = $(event.target).data('id');
  $.get(`/games/${id}`, (game) => {
    currentGame = game['data']['id'];
    let td = $('td');
    game['data']['attributes']['state'].forEach((data, i) => {
      if (data) {
        td[i].innerHTML = data;
        ++turn;
      } else {
        td[i].innerHTML = '';
      }
    });
  });
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

var player = () => turn % 2 ? 'O' : 'X';

var updateState = (td) => $(td).html(player());

var setMessage = (message) => $('#message').text(message);

var checkWinner = () => {
  let winner = false;
  const board = {};

  $('td').text((index, square) => board[index] = square);

  winningCombos.forEach(function(td) {
    if (board[td[0]] !== '' && board[td[0]] === board[td[1]] && board[td[1]] === board[td[2]]) {
      setMessage(`Player ${board[td[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

var doTurn = (clickedTd) => {
  updateState(clickedTd);
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
