$(document).ready(function () {
  attachListeners();
});
var currentGame = 0
var turn = 0;

var winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];

function gameClicks() {
  $('td').on('click', function () {
    td = $(this);
    doTurn(event);
  })
}


function attachListeners() {
  gameClicks();

  $('#previous').on('click', function () {
    getGames();
  })

  $('#save').on('click', function () {
    saveOrUpdate();
  })

  $('#games').on('click', function (event) {
    var gameBoard = $(event.target).data()['state'].split(",")
    var gameId = $(event.target).data()['id']
    loadGame(gameBoard, gameId);
  })
}

function saveOrUpdate(gameReset=false) {
  if (currentGame) {
    updateGame(currentGame, gameReset);
  } else {
    saveGame(gameReset);
  }
}

function updateGame(id, gameReset=false) {
  var state = boardStatus();
  $.ajax({
    method: "PATCH",
    url: '/games/' + id,
    dataType: "json",
    data: {
      game: {
        state: state
      }
    },
  });
}

function saveGame(gameReset=false) {
  var state = boardStatus();
  $.ajax({
    url: '/games',
    method: "POST",
    dataType: "json",
    data: {
      game: {
        state: state
      }
    },
    success: function (data) {
      if (gameReset) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id
      }
    }
  })
}


function getGames() {
  $.getJSON('/games', function (data) {
    var games = data.games;
    var i = 0;
    var gameText = '';
    while (i < games.length) {
      gameText +=  '<button data-gameid="'+ games[i].id +'" class="load_game" data-id="' + games[i].id + '" data-state="' + games[i].state + '">'
      gameText += 'Game #' + games[i].id + '</button>'
      $('#games').html(gameText);
      i++;
    }
  })
}

function loadGame(gameBoard, gameId) {
  currentGame = gameId;
    $.each(gameBoard, function (index, cell) {
      $($('td')[index]).text(cell);
    })
    boardStatus();
    turn = board.join('').split('').length;
    gameClicks();
}

function doTurn(event) {
  $('#message').html('');
  updateState(event);
  turn += 1;
  checkWinner();
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  var token = player();
  if (td.html() === '') {
    $(td).text(token);
  };
}

function checkWinner() {
  boardStatus();
  $.each(winCombos, function (index, combo) {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== '') {
      message("Player " + board[combo[0]] + " Won!");
    } else if (board.join('').split('').length === 9) {
      message('Tie game');
    };
  });
  return false;
}

function boardStatus() {
  board = [];
  $('td').each(function () {
    board.push($(this).html());
  });
  return board;
}

function message(string) {
  $('#message').html(string);
  resetGame();
}

function resetGame() {
  $('td').each(function (index, td) {
    $(this).html('');
  });
  saveOrUpdate(true);
  turn = 0;
  currentGame = 0;
}
