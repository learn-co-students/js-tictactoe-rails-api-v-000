var currentGame;
var turn = 0;
var winCombinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
  ]

function attachListeners() {
  $('td').on('click', function(event) {
    if ($(this).text() == "") { doTurn(event); }
  });

  $('#save').on('click', function() {
    save();
  });

  $('#previous').on('click', function() {
    showPrevious();
  });

  $('#games').on('click', function(event) {
    getGame(event);
  })
}

function getGame(event) {
  var state = $(event.target).data('state').split(',');
  turn = $.grep(state,function(e){ return e != "" }).length + 1;
  $('td').each(function(index) {
    $(this).text(state[index]);
  });
  currentGame = $(event.target).data('gameid');
  console.log(`${currentGame} : ${turn}`);
}

function showPrevious() {
  $.get('/games', function(data) {
    $('#games').empty();
    data.forEach(function(game){
      gameItem = $('<li>', {
        'data-state': game.state,
        'data-gameid': game.id,
        text: 'Game: ' + game.id
      });
      $('#games').append(gameItem)
    })
  })
}

function save() {
  gameRunning = ($('#message').text() == "")
  if (currentGame) {
    var url = "/games/" + currentGame;
    var method = "PATCH";
  } else {
    var url = "/games";
    var method = "POST";
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getBoard()
      }
    },
    success: function(data) {
      if (gameRunning) currentGame = data.id;
    }
  });
}

function getBoard() {
  var board = []
  $('td').each(function() {
    board.push($(this).text());
  });
  return board
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  checkTie();
  turn += 1;
  console.log(`${currentGame} : ${turn}`);
}

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(event) {
  $(event.target).text(player());
}

function checkWinner() {
  var winner = false;
  $.each(winCombinations, function(index, combo) {
    a = $('td[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').text();
    b = $('td[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').text();
    c = $('td[data-x="' + combo[2][0] + '"][data-y="' + combo[2][1] + '"]').text();
    if (player() == a && player() == b && player() == c) {
      return winner = true;
    }
  });
  if (winner) {
    message(`Player ${player()} Won!`);
    save();
    resetGame();
  } else {
    message("");
    return false;
  }
}

function checkTie() {
  if (turn == 9) {
    message("Tie Game")
    save()
    resetGame()
  }
}

function resetGame() {
  $('td').text("");
  turn = -1;
  currentGame = 0;
  console.log(`${currentGame} : ${turn}`)
}

function message(string) {
  $('#message').text(string);
}

$(document).ready(function() {
  attachListeners();
});
