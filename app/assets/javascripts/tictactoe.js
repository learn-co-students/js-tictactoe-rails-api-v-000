// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
var board = {};
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function player() {
  if(turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  };
}

function updateState(position) {
  $(position).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  $('td').text((index, position) => board[index] = position);

  winningCombos.some ((combo) => {
    if(board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      winner = true;
      setMessage(`Player ${board[combo[0]]} Won!`);
    };
  });
  return winner;
}

function doTurn(position) {
  updateState(position);
  turn++;

  if(checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    saveGame();
    setMessage('Tie game.');
    clearGame();
  }
}


function clearGame() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

$(document).ready(function() {
attachListeners()
})

function attachListeners() {
  $('td').on('click', function() {
    if(!checkWinner() && !$.text(this)) {
      doTurn(this);
    };
  });

  $('#clear').on('click', function(){
    clearGame();
  });

  $('#save').on('click', function(){
    saveGame();
  });

  $('#previous').on('click', function(){
    previousGames();
  });
}


function saveGame () {
  var state = [];
  var gameData = {state: state};

  $('td').text((index, position) => {
    state.push(position);
  });

  if (currentGame !== 0) {
    $.ajax ({
      url: `/games/${currentGame}`,
      data: {
        state: state,
        id: currentGame
      },
      type: 'PATCH'
    });
  } else {
    $.post('/games', gameData, function(game) {
      //debugger
      currentGame = game.data.id;
      $('#games').append(`<button id="game-id-${currentGame}" data-id="${currentGame}">Game ${currentGame}</button>`);
      $(`#game-id-${currentGame}`).on('click', loadGame);
    });
  }
}

function previousGames() {
  $('#games').empty();
  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      //debugger
      $('#games').append(`<button id="game-id-${game.id}" data-id="${game.id}">Game ${game.id}</button>`);
      $(`#game-id-${game.id}`).on('click', loadGame);
    });
  });
}

function loadGame(event) {
  var id = $(event.target).data('id')
  //debugger
  $.get(`/games/${id}`, (game) => {
    currentGame = game["data"]["id"];
    var $td = $('td');
    game["data"]["attributes"]["state"].forEach((data, i) => {
      if (data) {
        $td[i].innerHTML = data
        turn++
      } else {
        $td[i].innerHTML = ''
      }
    });
  });
}
