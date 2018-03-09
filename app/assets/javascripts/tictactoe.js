var turn = 0;  //works with var but not let ??
let currentGameId = 0;
const winCombo = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  const squares = $('td')

  for (let i = 0; i < squares.length; i++) {
    $(squares[i]).on('click', function(event) {
      if ($.text(this) == "" && !checkWinner()) {
        doTurn(this);
      };
    });
  };

  $('#save').on('click', function() { saveGame(); });
  $('#previous').on('click', function() { previousGames(); });
  $('#clear').on('click', function() { clearGame() });
}

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  };
}

function updateState(square){
  $(square).text(player())
}

function setMessage(string) {
  $('#message').append(string);
}


function checkWinner() {
  let board = [];
  let winner = false;

  $('td').text(function(index, square) {
    board[index] = square
  });

  winCombo.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });

  return winner;
}

function doTurn(square) {
  updateState(square);
  turn += 1;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    clearGame();
  }
}

function saveGame() {
  let board = []
  $('td').text(function(index, square) {
    board.push(square);
  });

  let gameData = { state: board }

  if (currentGameId) {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + currentGameId,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      currentGameId = game.data.id
      $("#games").append(`<button id="gameid-${currentGameId}">Game: ${currentGameId}</button><br/>`);
      $("#gameid-" + currentGameId).on('click', function(){
        reloadGame(currentGameId);
      });
    });
  }
}

function previousGames() {
  $('#games').empty()
  $.get("/games", function (resp) {
    resp.data.forEach(function(game) {
      $("#games").append(`<button data-id="${game.id}" onclick="reloadGame(${game.id})">${game.id}</button>`).val()
    })
  })
}

function reloadGame(id) {
  currentGameId = id
    let game = $.get(`/games/${id}`, function(resp) {
      $('td').toArray().forEach((el, index) => {el.innerHTML = resp.data.attributes.state[index]
        if (el.innerHTML != "") {turn++}})
    })
  }

function clearGame() {
  $('td').text("");
  turn = 0;
  currentGameId = 0;
}
