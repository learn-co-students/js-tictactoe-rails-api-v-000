//Setup board
var win_combos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

var turn = 0;
var currentGame = 0;

//Board functionality
function player(){
  return turn % 2 === 1 ? 'O' : 'X'
}

function updateState(square){
  square.innerHTML = player();
}

function setMessage(string) {
  $('div#message').append(string);
}

function checkWinner() {
  let winner = false;
  let board = Array.from($("td")).map(x => x.innerHTML)
  win_combos.forEach(function(combo) {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
      winner = board[combo[0]];
      setMessage(`Player ${winner} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function doTurn(square){
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    saveGame();
    setMessage("Tie game.");
    clearGame();
  }
}

// Initialize listeners
$(document).ready(function(){
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function() {
    if (!this.innerHTML && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', function() {
    saveGame();
  });
  $('#previous').on('click', function() {
    previousGames();
  });
  $('#clear').on('click', function() {
    clearGame();
  });
}


//Listener functions
function saveGame(){
  let board = Array.from($("td")).map(x => x.innerHTML);
  data = {state: board};

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
    });
  }
}

function previousGames(){
  $('#games').empty();
  $.get('/games', function(savedGames){
    savedGames.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}"># ${game.id} : ${game.attributes["updated-at"]}</button><br>`);
      $(`#gameid-${game.id}`).on('click', function() {
        loadGame(game.id);
      })
    });
  });
}

function loadGame(gameId){
  $.get(`/games/${gameId}`, function(game) {
    let state = game.data.attributes.state;
    let board = $('td');
    turn = 0;
    state.forEach(function(square, i) {
      board[i].innerHTML = square;
      if (square !== "") {
        ++turn;
      }
    });
    currentGame = gameId;
  });
}

function clearGame(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}
