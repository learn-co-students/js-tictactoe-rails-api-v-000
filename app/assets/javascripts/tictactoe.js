// Code your JavaScript / jQuery solution here
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
    clearBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    clearBoard()
  }
}

function clearBoard() {
  $('td').each((index, box) => {
      box.innerHTML = ""
  })
  savedGame = 0
  turn = 0
}

function previousGame() {
    $.get('/games', (games) => {
        games.data.forEach((game) => {
            $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
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
        debugger
        $.patch(`/games/${savedGame}`, sendData)
    } else {
        $.post('/games', sendData, (game) => {
            savedGame = game.data.id
            $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`)
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
}