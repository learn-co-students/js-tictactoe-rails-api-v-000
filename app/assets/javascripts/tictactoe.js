



/*//// THIS IS MY CODE AND IT FUNCTIONS PROPERLY, TEST ENVIRONEMNT ISNT WORKING RIGHT
$(document).ready(function() {
  attachListeners();
});

class Game {
  constructor(attr) {
    this.state = attr['state']
    this.id = attr['id'] 
  }
}

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0
var savedGame = 0



function doTurn(box) {
  updateState(box);
  turn++;
  if (checkWinner()) {
    saveGame()
    setTimeout(clearBoard, 1000)
    clearBoard()
  } else if (turn === 9) {
    saveGame()
    setTimeout(clearBoard, 1000)
    setMessage("Tie game.")
  }
}

function clearBoard() {
  $('td').each((index, box) => {
      box.innerHTML = ""
  });
  savedGame = 0;
  turn = 0;
}

function previousGame() {
    $.get('/games', (games) => {
        games.data.forEach((game) => {
            $('#games').append(`<button id="gameid-${game.id}">Load game with id: ${game.id}</button><br>`)
            $("#gameid-" + game.id).on('click', () => reloadGame(game.id))
        })
    })
}

function saveGame() {
    var state = []
    $('td').text((index, data) => {
      state.push(data);
    });
    var sendData = { state: state }
    if (savedGame) {
        $.patch(`/games/${savedGame}`, sendData)
    } else {
        $.post('/games', sendData, (game) => {
            savedGame = game.data.id
            $('#games').append(`<button id="gameid-${game.data.id}">Load game with id: ${game.data.id}</button><br>`)
            $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id))
        })
    }
}

function reloadGame(id) {
    var a = $('td')
    $.get(`/games/${id}`, (data) => {
        data.data.attributes['state'].forEach((x, i) => {
            a[i].innerHTML = x
        })
    })
}
function player() {
    if (turn%2 === 0) {
        return "X"        
    } else {
        return "O"
    }
}

function updateState(box) {
    let marker = player()
    box.innerHTML = marker
}

function setMessage(msg) {
    $('#message').text(msg)
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

$.patch = function(url, data, callback, type){
 
  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }
 
  return $.ajax({
    url: url,
    type: 'patch',
    success: callback,
    data: data,
    contentType: type
  });
}


function attachListeners() {
    $(() => {
    $('td').each((index, box) => {
        box.addEventListener('click', () => {
            if (!checkWinner() && !$.text(box)) {
                doTurn(box)
            }
        })
    })
    $('#save').on('click', () => saveGame())
    $('#previous').on('click', () => previousGame())
    $('#clear').on('click', () => clearBoard())
})
}*/


// Code your JavaScript / jQuery solution here

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

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

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
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

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

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