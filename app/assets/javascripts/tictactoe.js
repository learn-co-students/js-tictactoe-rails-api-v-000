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
]

function message(string) {
  //add string to #message div
  $('#message').append(string)
}

function checkWinner() {
  //check board to see if anyone won
  //if someone has won, return "Player _ Won!" and pass the string to message()
  //return true if game has been won, false if not
  $.each(winCombos, function(index, combo) {
    //check combo against board variable
    var one = combo[0]
    var two = combo[1]
    var three = combo[2]

    if (board[one] === "X" && board[two] === "X" && board[three] === "X") {
      message("Player X Won!")
      return true
    } else if (board[one] === "O" && board[two] === "O" && board[three] === "O") {
      message("Player O Won!")
      return true
    } else {
      return false
    }
  })
}

function games() {
  $('#games').on('click', function(event) {
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
  })
}

function previous() {
  $('#previous').on('click', function(event) {
    //previous games are hidden until #previous is clicked - then show them like an index
    event.preventDefault();
    $.get("/games", function(data) {
      var games = data.games
      var html = "<ul>"
      $.each(games, function(index, game) {
        html += "<li>" + game.id + "</li>"
      })
      html += "</ul>"
      $('#games').append(html);
    });
  })
}

function save() {
  $('#save').on('click', function(event) {
    event.preventDefault();

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
        //if game has been completed, set currentGame to undefined
        if (checkWinner()) {
          currentGame = undefined;
        } else { //if game has not been completed, set currentGame to game's id
          currentGame = data.game.id;
        }
      }
    })
  })
}

function cell() {
  $('td').on('click', function(event) {
    event.preventDefault();
    //passes doTurn a param of the event
    //grabs cell that was clicked
    doTurn(event.toElement);
  })
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
  cell();

  save();

  previous();

  games();
}

$(document).ready(function() {
  attachListeners();
})
