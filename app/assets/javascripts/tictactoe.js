var current = 0
var turn = 0;

$(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function(elem) {
    if (!$(this).text() && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#clear').on('click', function() {
    emptyBoard();
  });

  $('#save').on('click', function() {
    saveGame();
  });

  $('#previous').on('click', function() {
    prevGames();
  });
}

function player() {
  if (turn % 2 !== 0) {
    return 'O';
  }
  return 'X';
}

function updateState(td) {
  var token = player();
  $(td).text(token);
}

var message = (string) => {
  $("#message").text(string);
}

function checkWinner() {
  const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  var isWinner = false;
  var board = {};

  $('td').text((index, td) => {
    board[index] = td;
  });

  winCombos.some(function(comboArr) {
    if (board[comboArr[0]] !== '' && board[comboArr[0]] === board[comboArr[1]] && board[comboArr[1]] === board[comboArr[2]]) {
      saveGame();
      isWinner = true;
      message(`Player ${board[comboArr[0]]} Won!`);
    }
  });

  return isWinner;
}

function doTurn(td) {
  updateState(td);
  turn++;
  checkWinner();
  if (turn == 9) {
    saveGame();
    message('Tie game.');
    emptyBoard();
  }
}

function emptyBoard() {
  $('td').empty();
  turn = 0;
  current = 0;
}

function saveGame() {
  var state = [];

  $('td').text((index, td) => {
    state.push(td);
  });

  if (current) {
    $.ajax({
       url: `/games/${current}`,
       data: {
         state: state,
         id: current
       },
       type: 'PATCH'
     });
  } else {
    $.post('/games', { state: state })
    .done(function(data) {
      current = data["data"]["id"];
    });
  }
}

function prevGames() {
  $.get('/games', function(data) {
    var gamesArray = data["data"];
    if (gamesArray.length > 0) {
      var gamesHtmlArray = "";

      $(gamesArray).each((index, game) => {
        gamesHtmlArray += '<button data-id="' + game["id"] + '" class="game-button">Game ' + game.id + '</button><br>';
      });

      $('#games').html(gamesHtmlArray);

      $('.game-button').on('click', function(event) {
        loadGame(event);
      });
    }
  });
}

function loadGame(event) {
  var id = $(event.target).data('id');
  $.get(`/games/${id}`, function(game) {
    current = game["data"]["id"];
    var $td = $('td');
    game["data"]["attributes"]["state"].forEach(function(data, i) {
      if (data) {
        $td[i].innerHTML = data;
        turn++;
      } else {
        $td[i].innerHTML = '';
      }
    });
  });
}
