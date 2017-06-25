'use strict'

let turn = 0;
let currentGame = null;
let url = null;
let method = null;

const  winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

$(document).ready(function() {
  attachListeners();
})

$(document).ready(function() {
  $('.game').click(function() {
    loadGame($(this).data('id'));
  });
});

function attachListeners() {
  $('td').click(function() {
    var pos = this; 
    doTurn(pos);
  });

  $('#save').click(() => {
    saveGame();
  });

  $('#previous').click(() => {
    getGames();
  });
}

function doTurn(pos) {
  updateState(pos);
  checkWinner();
  turn += 1;
}

function updateState (pos) {
  var x = $(pos).data('x');
  var y = $(pos).data('y');
  $(`[data-x=${x}][data-y=${y}]`).html(player());
}

function checkWinner() {
  let winner;
  let board = getBoard();
  	winningCombos.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== ""){
      winner = true;
    }
  }); 

  if (winner === true) {
    message(`Player ${player()} Won!`);
    turn = -1;
    resetBoard();

  } else if (turn === 8) {
    message('Tie game');
    turn = -1;
    resetBoard();
  } else {
    return false;
  }
}

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function getBoard() {
  var board = $('td').map(function() {
    return this.innerHTML;
  }).toArray();

  return board;
}

function resetBoard() {
  saveGame(true);
  $('td').text("");
}

function message(msg) {
  $('#message').html(msg);
}

function getGames() {
  let games = $();
  $.get('/games').done((object) => {
      if (object.games.length > 0) {
        object.games.forEach(function(game) {
          games = games.add(`<li class="game" id="${game.id}">${game.id}</li>`);
        })
        $('#games').html(games);
      }
    });
}

function loadGame(id) {
  $.get("/games/"+ id, function(object) {
    var state = object.game.state;
    $('td').each(function(index){
      this.innerHTML = state[index];
    });
  });
 }

function saveGame(game) {
  if (currentGame) {
    url = `/games/${currentGame}`;
    method = 'PATCH';
  } else {
    url = '/games';
    method = 'POST';
  };
  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: getBoard()
      }
    },
    success: (data) => {
      if (game) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  });
}