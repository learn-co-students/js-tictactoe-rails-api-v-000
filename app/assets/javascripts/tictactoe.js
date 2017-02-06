$(document).ready(function() {
  attachListeners();
})


var turn = 0;
var currentGame = undefined;
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


function attachListeners() {

  $("td").click(function(event) {
    doTurn(event.target)
  });

  $('#previous').click(function(event) {
    previous();
  });

  $('#save').click(function(event) {
    save();
  });
};


function doTurn(cell) {
  updateState(cell);
  if(checkWinner()) {
    save(true)
    resetBoard();
  } else if(fullBoard(turn)) {
    save(true)
    resetBoard();
    message('Tie game')
  } else {
    turn += 1;
  }
};


var updateState = function(cell) {
  $(cell).html(player());
};


function player() {
  if (turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  };
};


function gameBoard() {
  var board = []
   $("td").each(function(i) {
     board.push($(this).text())
   })
  return board;
};


function fullBoard(turn) {
  var full = true
  $('td').each(function() {
    if (this.innerHTML === "") {
      full = false
    }
  })
  return full
}


function checkCombo(combo, board){
  if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
    return true
  }
};


function checkWinner() {
  for(i = 0; i < combos.length; i++){
    if (checkCombo(combos[i], gameBoard())){
      message('Player ' + player() + ' Won!')
      return true;
    }
  }
  return false;
};


var resetBoard = function() {
  turn = 0;
  currentGame = 0;
  $('td').empty();
}


function gameBoard() {
  //creates an array of the current board, which you can use when showing a game to
  //iterate over to add each element as text to that cell...?
  //can also iterate through the array to check if someone has won
  var board = []
   $("td").each(function(i) {
     board.push($(this).text())
   })
  return board;
};


function previous() {
  //previous games are hidden until #previous is clicked - then show them like an index
  $.getJSON("/games", function(data) {
    indexGames(data.games)
  })
}


function indexGames(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}


function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}


function save(reset) {
  //save game to database if it's new, update game if not
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
        state: gameBoard()
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


var message = function(string) {
  //add string to #message div
  $('#message').html(string);
}
