//pseudo code

var turn = 0;
var gameCount = 0; //could just display game id + 1 instead of keeping track of this
var board = [];
var currentGame = undefined;

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
  //var x = event.getAttribute("data-x");
  //var y = event.getAttribute("data-y");
  //var xCell = $('td').find("[data-x= '" + x + "']")
  //var cell = xCell.find("[data-y]= '" + y + "']");
  $(cell).text(currentPlayer);
  gameBoard();
}

function doTurn(cell) {
  turn += 1;
  updateState(cell);
}

//split these into separate functions once working
function attachListeners() {
  $('td').on('click', function(event) {
    event.preventDefault();
    //passes doTurn a param of the event
    //grabs cell that was clicked
    doTurn(event.toElement);
  })

  $('#save').on('click', function(event) {
    event.preventDefault();

    //save game to database if it's new, update game if not
    //how do I check if it is a new game?
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
        //and clear board variable -- checkWinner() can return true if game has been won, it can also be
        //responsible for clearing the board
        if (checkWinner()) {
          currentGame = undefined;
        } else { //if game has not been completed, set currentGame to game's id
          currentGame = data.game.id;
        }
      }
    })
  })

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

  $('#games').on('click', function(event) {
    //when the user clicks on a previous game, it loads that game - like a show view
    event.preventDefault();

    var id = event.target.innerText
    $.get("/games/" + id, function(data) {
      //display state as current board
      var array = data.state
      $.each($("td"), function(index, cell) {
        //does this add nil values for blank cells? ... because I need it to...
        $(cell).text(array[index]);
      })
    })
  })
}

$(document).ready(function() {
  attachListeners();
})
