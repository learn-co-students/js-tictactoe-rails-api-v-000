var turn = 0; 
var square; 
var gameID = 0;


function isEven(num) {
  return num % 2 === 0;
}

function player() {
  return isEven(turn) ? 'X' : 'O';
}

function updateState(squares) {
  const token = player();
  return squares.innerHTML = token;
}
function setMessage(string) {
  $('#message').append(string);
}

function checkWinner() {
  const board = $('td');

  const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  const winCombo = winningCombos.find((combo) => {
    return combo.every(i => board[i].innerHTML === 'X') ||
      combo.every(i => board[i].innerHTML === 'O');
  });
  if (winCombo) {
    const token = board[winCombo[0]].innerHTML;
    setMessage(`Player ${token} Won!`);
  }
  return winCombo ? true : false; 
}

function doTurn(move) {
  if (updateState(move)) {
    turn++
  }
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}

function setBoard(arr) {
  const squares = $('td');
  for (let i = 0; i < arr.length; i++) {
    $(squares[i]).append(arr[i]);
  }
}

function getBoard() {
  let game = [];
  const board = $('td');
  for (const el of board) {
    game.push(el.innerHTML); 
  }
  return game;
}

function saveGame() {
  let board = getBoard();
  if (gameID === 0) {
    $.post("/games", { state: board }, function(response) {
      gameID = response.data.id;
    })
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameID}`,
      data: { state: board }
    });
  }   
}

function getGames() {
  $.get('/games').done(function (data) {
      let gameData = data.data;
      let gameBtns = toArr($('#games').children('button'));
      for (let game of gameData) {
        if (gameBtns.indexOf(`Game ${game.id}`) === -1) {
          appendGamesBtn(buildBtn(game.id));
        }
      }
  });
}

function getGame(id) {
  $.get('/games/' + id)
    .done(function(data) {
    let gameData = data.data;
    let gameState = gameData.attributes.state;
    turn = gameState.join('').length;
    gameID = gameData.id;
    setBoard(gameState);
  });
}

function gameButtons() {
  $('#games').on('click', 'button', function (e) {
    let id = $(e.target).attr('id');
    getGame(id);
  });
}

function toArr(collection) {
  let arr = Array.prototype.slice.call(collection);
  return arr.map(function (a) { return a.textContent; })
}

function appendGamesBtn(btn) {
  $('#games').append(btn);
}

function buildBtn(id) {
  return `<button id="${id}">Game ${id}</button>`;
}

function resetBoard() {
  $('td').text("");
  turn = 0;
  gameID = 0; 
}

// *** Listeners *** 

$(document).ready(function () {
  attachListeners();
});

function attachListeners() {

  $('#save').click(function () {
    saveGame();
  });

  $('#clear').click(function () {
    resetBoard();
  });

  $('#previous').click(function () {
    getGames();
  });

  gameButtons();

  tableListener();
}

function tableListener() {
  $('td').click(function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
}





