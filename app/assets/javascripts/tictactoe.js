//starting conditions
var turn = 0;
var currentGame = undefined;

//collection of winning indices
var combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

$(document).ready(function() {
  attachListeners();
})

function attachListeners() {
  $("td").click(function(event) {
    cell = event.target
    doTurn(cell)
  });
  $('#previous').click(function(event) {
    previous();
  });
  $('#save').click(function(event) {
    save();
  });
};

function player() {
  if (turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  };
};

var message = function(input) {
  $('#message').html(input);
}

function state() {
  var board = []
   $("td").each(function(i) {
     board.push($(this).text())
   })
  return board;
};

var updateState = function(cell) {
  if ($(cell).html() === "") {
    $(cell).html(player());
  } else {
    message("That space is taken. Please choose another.")
  }
};

function doTurn(cell) {
  updateState(cell);
  if(checkWinner()) {
    save(true)
    resetBoard();
  } else if(fullBoard()) {
    save(true)
    resetBoard();
    message('Tie game')
  } else {
    turn += 1;
  }
};

//functions related to checking if the game is over or has been won////
function fullBoard() {
  var full = true
  $('td').each(function() {
    if (this.innerHTML === "") {
      return full = false;
    }
  })
  return full
}

function checkState(combo, board){
  if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    return true;
  }
};

function checkWinner() {
  for(i = 0; i < combos.length; i++){
    if (checkState(combos[i], state())){
      message('Player ' + player() + ' Won!')
      return true;
    }
  }
  return false;
};

/////++++++++++++++++++++++++++++++++//////////
//methods related to making the AJAX calls

var resetBoard = function() {
  turn = 0;
  currentGame = undefined;
  $('td').empty();
}

function previous() {
  $.getJSON("/games", function(data) {
    index(data.games)
  })
}

function index(games) {
  var doc = $()
  games.forEach(function(game) {
    doc = doc.add(show(game));
  })
  $("#games").html(doc);
}

function show(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

function save(reset) {
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: state()
      }
    },
    success: function(data) {
      if(reset) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
};