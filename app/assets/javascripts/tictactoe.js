var turn = 0;

// Use this for refactor of checkWinner()
var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function attachListeners() { // COMPLETE
// You must have a function called attachListeners() which the tests call to attach the click handlers to the page after the DOM has been loaded
// When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event
  $('td').click(function(move) {
    doTurn(move);
  });
}

function board() { // COMPLETE
  return $('td').map(function(index, square) {
    return square.innerHTML;
  });
}

function doTurn(move) { // COMPLETE
    // Increment the variable turn by one
  // Should call on the function updateState() and pass it the event
  // Should call on checkWinner()
  //move.taget == <td data-x="2" data-y="2"></td>
  updateState(move.target);
  checkWinner();
  turn++;
}

function player() {  // COMPLETE
  // If the turn number is even, this function should return the string "X", else it should return the string "O"
  return (turn % 2 === 0) ? "X" : "O";
  // if (turn % 2 === 0) {
  //   return "X";
  // } else {
  //   return "O";
  // }
}

function updateState(move) { // COMPLETE
  // This method should call on player() and add the return value of this function to the clicked cell on the table
  $(move).text(player());
}

function checkWinner() { // COMPLETE
  // This function should evaluate the board to see if anyone has won
  // If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to message().
  // 3 Horizontal Wins
  // 2 Diagonal Wins
  // 3 Vertical Wins
  if (board()[0] === board()[1] && board()[1] === board()[2] && board()[2] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[3] === board()[4] && board()[4] === board()[5] && board()[5] !== "") {
    return message("Player " + board()[3] + " Won!");
  } else if (board()[6] === board()[7] && board()[7] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[6] + " Won!");
  } else if (board()[0] === board()[4] && board()[4] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[2] === board()[4] && board()[4] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if (board()[0] === board()[3] && board()[3] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[1] === board()[4] && board()[4] === board()[7] && board()[7] !== "") {
    return message("Player " + board()[1] + " Won!");
  } else if (board()[2] === board()[5] && board()[5] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if ($.inArray("", board()) === -1) {
    return message("Tie game");
  } else {
    return false;
  }
}

function message(string) { // COMPLETE
  // This function should accept a string and add the string to the div with an id of "message"
  $('#message').html(string);

  //Saves the board/game state in a variable.
  //Creates an ajax request where data is sent to the backend to be stored for later use.
  saveGameState();

  $('td').empty();
  turn = 0;
}

$(function() {
  attachListeners();
});




// NOTE: may need to convert gameState value from board() if not array
//TODO: Needs to be called on the conclusion of every game AND on a "Save Game" click event

function saveGameState() {
  var gameState = ["O", "", "", "X", "O", "X", "", "X", "O"];
  // TODO: replace above after board() return value is reformatted
  // var gameState = board();

  $.ajax({
    // TODO: add "PATCH" when games are saved
    type: "POST",
    url: "/games",
    dataType: "json",
    data: {
            game: {
              state: gameState
            }
          }
    // TODO: add callback function
    // success: function() { callback function; }
  });
}

//Retrieves game state from backend
function getGameState() {
  let gameState = board();
}
