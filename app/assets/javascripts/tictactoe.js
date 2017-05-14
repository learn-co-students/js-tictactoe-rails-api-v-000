$(document).ready(function() {
  attachListeners();
});

var turn = 0;
var currentGame;

var WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
]

function getBoard() {
  var board = [];
  $('td').each(function() {
    td = $(this).text();
    board.push(td);
  })
  return board;
};

function resetBoard() {
  $('td').each(function() {
    td = $(this).text("");
  })
  turn = 0;
  currentGame = undefined;
}

function attachListeners() {
  $("td").on('click', function(data) {
    x = $(this)[0].attributes[0];
    y = $(this)[0].attributes[1];
    doTurn(this);
  });

  $('#previous').on('click', function() {
    getAllGames();
  });

  $('#save').on('click', function() {
    saveGame();
  })

  $('#games').on('click', function(event) {
    var state = getState(event)
    changeGame(state, getId(event))
  })
}

function getState(event) {
  return $(event.target).data("state").split(",")
}

function changeGame(state, id) {
  placeToken(state);
  currentGame = id;
}

 function placeToken(state) {
  $("td").each(function(i) {
    $(this).text(state[i]);
  })
}

function getId(event) {
  return $(event.target).data("gameid")
}

function doTurn(data) {
  updateState(data);
  if (checkWinner(data) === true) {
    turn = 0;
    saveGame(true);
    resetBoard();
  } else {
    turn++;
  }
}

function checkWinner(board) {
  var board = getBoard();
  if (won(board) === true) {
    message('Player ' + player() + ' Won!');
    return true;
  } else if (draw(board) === true) {
    message('Tie game');
    resetBoard();
    return true;
  } else {
    return false;
  }
}

function over(board) {
  if (draw(board) === true || won(board) === true) {
    return true;
  } else {
    return false;
  }
}

function taken(element, i, array) {
  if (element === "X" || element === "O") {
    return true;
  } else {
    return false;
  }
}

function draw(board) {
  return board.every(taken);
}

function won(board) {
  var won = false;
  $(WINNING_COMBOS).each(function(i, row) {
    // board;
    if (board[row[0]] === board[row[1]] && board[row[1]] === board[row[2]] && board[row[0]] === board[row[2]] && board[row[0]] !== "") {
      won = true;
    };
  })
  return won;
}

function updateState(data) {
  $(data).html(player());
}

var player = function() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function message(string) {
  $('#message').html(string);
}

function getAllGames() {
  $.ajax({
    url: '/games',
  }).done(function(response) {
    var dom = $()
    response.games.forEach(function(game) {
      dom = dom.add(showGame(game));
    })
    $("#games").html(dom);
  });
}

function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function saveGame(reset) {
  var url, method;
  if (currentGame) {
    url = "/games/" + currentGame;
    method = 'PATCH';
  } else {
    url = '/games';
    method = 'POST';
  }
  $.ajax({
    url: url,
    type: method,
    dataType: 'json',
    data: {
      game: {
        state: getBoard()
      }
    },
    success: function(data) {
      if (reset) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}
