const WIN_COMBOS = [
  [0, 1, 2], [0, 3, 6], [0, 4, 8],
  [3, 4, 5], [1, 4, 7], [6, 4, 2],
  [6, 7, 8], [2, 5, 8]
];
var turn = 0;
var game = 0;

$(document).ready(attachListeners)

function attachListeners() {
  $('td').click((e) => { if(!$(e.target).text() && !checkWinner()) { doTurn(e.target) } })
  $('#save').click(() => { saveGame() })
  $('#previous').click(() => { previousGames() })
  $('#clear').click(() => { resetBoard() })
}

function player() { return turn % 2 ? 'O' : 'X' }
function updateState(s) { $(s).text(player()) }

function doTurn(s) {
  updateState(s);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  game = 0;
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  let board = $('td').map((index, target) => { return $(target).text(); })
  let won = false

  WIN_COMBOS.forEach((combo) => {
    if(board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      won = true;
      return;
    }
  })

  return won;
}

function saveGame() {
  let board = [];
  $('td').each((index, target) => { board[index] = $(target).text(); })

  if(game) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${game}`,
      data: {state: board}
    }, () => {
      console.log('here')
    });
  } else {
    $.ajax({
      type: 'POST',
      url: `/games`,
      data: {state: board}
    }).done((data) => {
      game = data.data.id;
      $('#games').append(`<button id="gameid-${game}">${game}</button><br>`);
      $("#gameid-" + data.data.id).click(() => loadGame(data.data.id));
    });
  }
}

function previousGames() {
  $('#games').empty();
  $.get('/games').done((data) => {
    if (data.data.length) {
      data.data.forEach((game) => {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $("#gameid-" + game.id).click(() => loadGame(game.id));
      });
    }
  })
}

function loadGame(id) {
  setMessage('')

  $.get({
    url: `/games/${id}`,
  }).done((data) => {
    $('td').map((index, target) => { $(target).text(data.data.attributes.state[index]); })
    turn = data.data.attributes.state.join('').length;
    game = data.data.id;
  });
}
