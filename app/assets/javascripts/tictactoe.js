//pseudo code

var turn = 0;
var board = [];
var currentGame = undefined;
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

function message(string) {
  //add string to #message div
  $('#message').html(string)
}

function checkCombo(combo){
  if ((board[combo[0]] === "X") && (board[combo[1]] === "X") && (board[combo[2]] === "X") || (board[combo[0]] === "O") && (board[combo[1]] === "O") && (board[combo[2]] === "O")) {
    return true;
  }
};

function checkWinner() {
  for(i = 0; i < winCombos.length; i++){
    if (checkCombo(winCombos[i])){
      message('Player ' + player() + ' Won!')
      return true;
    }
  }
  return false;
};

function games() {
  //when the user clicks on a previous game, it loads that game - like a show view
  event.preventDefault();

  var id = event.target.innerText
  $.get("/games/" + id, function(data) {
    //display state as current board
    var array = data.state
    $.each($("td"), function(index, cell) {
      $(cell).text(array[index]);
    })
  })
}

function previous() {
  //previous games are hidden until #previous is clicked - then show them like an index
  $.get("/games", function(data) {
    var games = data.games
    var html = "<ul>"
    $.each(games, function(index, game) {
      html += "<li>" + game.id + "</li>"
    })
    html += "</ul>"
    $('#games').append(html);
  });
}

function save() {
  //save game to database if it's new, update game if not
  //set a current game id as a variable, if it is a new game, this will be undefined
  if (currentGame === undefined) {
    var url = "/games"
    var method = "POST"
  } else {
    var url = "/games" + currentGame
    var method = "PATCH"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: board
      }
    },
    success: function(data) {
      currentGame = data.game.id;
    }
  })
}

function cell() {
  //passes doTurn a param of the event
  //grabs cell that was clicked
  doTurn(event.toElement);
}

function gameBoard() {
  //returns an array of the current board, which you can use when showing a game to
  //iterate over to add each element as text to that cell...?
  //can also iterate through the array to check if someone has won
  $.each($("td"), function(index, cell) {
    //does this add nil values for blank cells? ... because I need it to...
    board.push($(cell).text());
  })
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(cell) {
  var currentPlayer = player();

  $(cell).text(currentPlayer);
  gameBoard();
  checkWinner();
}

function doTurn(cell) {
  //check for full board but no win, means a tie display "Cat's Game!" as message
  updateState(cell);
  if (checkWinner()) {
    save();
    board = [];
    turn = 0;
    currentGame = undefined
    $('td').empty();
  } else {
    turn += 1;
  }
}

function attachListeners() {
  $('td').on('click', function(event) {
    cell();
  })

  $('#save').on('click', function(event) {
    save();
  })

  $('#previous').on('click', function(event) {
    previous();
  })

  $('#games').on('click', function(event) {
    games();
  })
}

$(document).ready(function() {
  attachListeners();
})
