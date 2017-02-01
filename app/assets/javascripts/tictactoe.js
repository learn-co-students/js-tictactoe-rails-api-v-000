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

function attachListeners() {
  $('td').on('click', function(event) {
    event.preventDefault();
    //passes doTurn a param of the event
    //grabs cell that was clicked
    doTurn(event.toElement);
  })

  $('#save').on('click', function(event) {
    event.preventDefault(); //working up to here

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
      //how do I know if the game has been completed --check for winner-- and the board and currentGame
      //variables need to be reset? --board needs to be reset upon completion or if the user clicks on a previous game
      //Since the game has been saved I do not need to append it to the #games div here...
      //I can do that in the #previous function later
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
}

$(document).ready(function() {
  attachListeners();
})
