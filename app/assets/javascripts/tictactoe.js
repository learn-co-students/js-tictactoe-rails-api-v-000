// Short-hand for .ready, keeps js from running till DOM is ready
$(function() {
  attachListeners()
})

// Global Variables
var turn = 0;

var winningCombos = 
  [
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,0],[0,1],[0,2]],
    [[2,0],[2,1],[2,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[1,1],[0,2]]
  ]

var currentGame;

// Getting listeners (on click, all functions will be described below): 
// first is for the game board clicks,
// second is for the list of games when they are displayed
// third is for the save button
// last is for the previous games button
var attachListeners = function() {
  $("tbody").click(function(e) {
    doTurn(e)
  });
  $("#games").click(function(e) {
    swapGame(parseState(e), getGameId(e))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
}

// When you click on the game board, this function takes that click event and first updates the state by inserting an X or O depending on turn variable, then it checks for a winning combo or a tie, if true then it will save and then reset the game board, if its neither a win or tie it increments the turn variable.
var doTurn = function(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
}

// the function takes in the click event from choosing a game board square and puts an X or O in the target area depending on the player function which returns the X or O
var updateState = function(event) {
  $(event.target).html(player());
}

// Very basic function that returns an "X" or "O" depending if the turn variable is odd or even
var player = function() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

// Iterates through the winningCombos array variable, if a match is found it will return true and send the message that "Player (X or O) Won!" else it will return false
var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

// Takes a single winningCombo variable array (ex. [[0,0],[1,0],[2,0]]) and iterates over it, it then takes that smaller array (ex. [0,0]) and sets each number to a variable. We then create a variable that uses the newly created varibales and uses them to locate the cell in the array. The function then checks to see if the letter in the cell matches the players letter. If the noCellMatch function returns true (which means the letter DO NOT match) then we will return false on this function, else returns true.
var checkCells = function(array) {
  for(var i = 0; i < array.length; i++) {
    var x = array[i][0];
    var y = array[i][1];
    var cell = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(cell)) {
      return false;
    }
  }
  return true;
}

// If the cell letter AND the player letter match this function actually returns false since this function looks for !=.
var noCellMatch = function(cell) {
  return (cell.html() != player())
}

// This function checks for a tie game by first setting a tie variable to true, then it iterates over each cell and checks if the cell html length is 0 or less (which means there is no text in that cell) or 1 which means there is a letter there, if there are ANY 0 or less then the tie variable is changed to false and the game is NOT over. After the iteration, if the tie variable returns true it sends the message "Tie Game" and returns the result of the tie variable.
var tie = function() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

// Takes a message as an arguement grabs the message ID area of our HTML and makes the html reflect the attached message.
var message = function(message) {
  $("#message").html(message);
}

// Pulls all the cell items and replaces all html data to be blank, resets the turn meter to 0, and sets currentGame to 0 (since currentGame is the game ID setting it to zero will not overwrite any previous games)
var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

// takes an event, gets the jquery search for event target (which returns an li tag that includes data-state and data-gameid) we then return the data-state info which is in the form of a string of X's and O's. Then do a split that splits the string by ',' and return it in an array.
var parseState = function(event) {
  return $(event.target).data("state").split(",")
}

// This returns the game id that is being taken from data provided from the event target data called gameid
var getGameId = function(event) {
  return $(event.target).data("gameid")
}

// run JQuery .get on /games to get list of games, which then gets put through a function with an arguement of response. Response.games (which returns an array of games is passed to the function showGames)
var getAllGames = function() {
  $.get("/games").done(function(response) {
    showGames(response.games)
  })
}

// First takes an argument of all the games, next we set the DOM to the variable dom, we then take the games array and interate through them. We take the dom variable and add each game to the dom in the form of li data. We then grab the games id in my HTML and add the dom variable through html prototype.
var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

// This function is used to return li tags with data containing the game state and the game id. The text of this is just the game id
var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

// Takes arguments of state(an array of X's and O's) and id(game id). This function will use those two items to recreate where the previous played game left off. Using the state it places the X and O where they belong and sets the currentGame global variable to the given game id. It then sets the turn global variable by using findTurn function and passing that function the game board.
var swapGame = function(gameBoard, id) {
  placeMarks(gameBoard);
  currentGame = id;
  turn = findTurn(gameBoard);
}

// This function places the X's and O's on the game board from a given game board argument. First we iterate over each cell of a game board where we pass it another function that we have an argument of index with it. Using the index we insert each item from the game board into its corresponding cell.
var placeMarks = function(gameBoard) {
  $("td").each(function(i) {
    $(this).text(gameBoard[i]);
  })
}

// Takes an argument of a game board (which again is an array of X's and O's), we set the turn variable to 0 (just to make sure we don't have unexpected data), then iterate over the game board array and as long as each array item is not blank it will increment the turn by 1. When its done we return the turn variable.
var findTurn = function(gameBoard) {
  var turn = 0;
  gameBoard.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

// If you click on the save button POST method happens, if you win then the PATCH method happens
var save = function(resetCurrentGame) {
  // var gameBoard = [];
  var url, method;

  // $("td").each(function(i) {
  //   gameBoard.push($(this).text())
  // })

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
        state: getGameBoard()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

// This function takes the current game board and saves its marks (X's and O's). Sets a variable of marks to an empty array. Iterates over each cell on the game board, pushes each X or O to the marks array, then returns the marks array.
var getGameBoard = function() {
  var gameBoard = []
  $("td").each(function(i) {
    gameBoard.push($(this).text())
  })
  return gameBoard;
}