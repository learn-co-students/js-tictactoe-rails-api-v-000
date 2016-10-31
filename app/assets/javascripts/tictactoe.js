var turn = 0;
var winCombinations = [["00","10","20"], ["01","11","21"], ["02","12","22"],
    ["00","01","02"], ["10","11","12"], ["20","21","22"],
    ["00","11","22"], ["02","11","20"]
   ];

var attachListeners = function() {
// call to attach the click handlers to the page after the DOM has been loaded
//When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event

  $('td').on('click', function(event) {
    doTurn(event.target);
  });
  $('#reset').on('click', function(event) {
    resetGame();
  });
}

var taken = function(turnEvent) {
  return !!$(turnEvent).html();
}

var doTurn = function(turnEvent) {
  // Increment the variable turn by one
  // Should call on the function updateState() and pass it the event
  // Should call on checkWinner()
    if(taken(turnEvent)){
      message("That square is taken. Please select another.");
    } else if (!over()) {
    updateState(turnEvent);
    checkWinner();
    turn++;
    }
}

var updateState = function(turnEvent) {
//This method should call on player()
//and add the return value of this function to the clicked cell on the table

  var currentPlayer = player();
  $(turnEvent).html(currentPlayer);
}

var player = function() {
//If the turn number is even,
//this function should return the string "X", else it should return the string "O"
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

var full = function() {
  // @board.count("X") + @board.count("O") == 9 ?
  // true : false
  return $('td').text().length > 8;
}

var cat = function() {
  if (won()) {
    return false;
  } else if (!full()) {
    return false;
  } else {
    return true;
  }

}

var won = function() {

}

var over = function() {
  if (cat() || won()){
    return true;
  }
  else {
    return false;
  }
}




var checkWinner = function() {
  //This function should evaluate the board to see if anyone has won
  //If there is a winner, this function should make one of two strings:
  //"Player X Won!" or "Player O Won!". It should then pass this string to message().
  if (over()) {
    if (won()) {
      message("Player " + player() + " Won!");
      resetGame();
    } else {
      message("Tie game");
    }
  } else {
    return false;
  }
}


var message = function(string) {
  //This function should accept a string and add the string to the div with an id of "message"
  $('#message').text(string);
}

var resetGame = function() {
  turn = 0;
  $("td").html("");
  $('#message').text(" ");
}

$(function() {
  attachListeners();
});
