// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

var player = () => turn % 2 == 0 ? "X" : "O";
var isNewGame = () => currentGame === 0;
var getState = () => $('td').toArray().map(c => c.innerText);

function attachListeners() {
  $("td").on("click", function(e) {
    if (e.target.innerText != "O" && e.target.innerText != "X" && !checkWinner()) {
      doTurn(e.target)
    }
  });
  $("#save").on("click", () => saveGame() )
  $("#previous").on("click", () => previousGames() )
  $("#clear").on("click", () => clear() )
}

function doTurn(target) {

    updateState(target);
    turn += 1;

// if there is a winner save and clear the game board
    if (checkWinner()) {
      saveGame();
      clear();

// if the game is a tie save and clear the game board
    } else if (turn > 8) {
      setMessage("Tie game.");
      saveGame();
      clear();
    };

}

function saveGame() {
  const values = { "state": getState() }

  if (isNewGame()) {  //Saves new game
    $.post('/games', values, (json) => {currentGame = json.data.id});
  } else {  //Updates game in database
    $.ajax({
      url: `/games/${currentGame}`,
      method: 'PATCH',
      data: values
    });
  };
}

// Uses AJAX to pull all previous games from the database through the controller and displays them. Attaches listeners to the buttons through the ending function
function previousGames() {
  $.get('/games', function(json) {
    var jData = json.data
    if (jData.length > 0) {
      $("#games").empty();
      jData.forEach(game => $("#games").append(`<button data-id=${game.id}>` + game.id + "</button>"));
      attachPrevGameListeners();
    };

  });
}

// Attaches event listeners to the game buttons for click and sets the event to display and reset the game board to the saved game.
function attachPrevGameListeners() {
  $("#games button").on('click', function(e) {  //sets listener

    $.get('/games/' + e.target.dataset.id, function(json) {
      var jData = json.data

      currentGame = jData.id; //sets currentGame variable to previous game id
      turn = 0;                   //resets turn counter
      state = jData.attributes.state  //Array

      // sets board to the saved game board and increments the turn variable based on what the board looks like
      $("td").toArray().forEach(function(cell, index) {
        cell.innerText = state[index];
        if (state[index] != "") turn++;
      });

    });
  });
}

// empties the game board and sets the currentGame and turn variables to 0 thereby resetting the game
function clear() {
  $("td").toArray().forEach(c => c.innerText = "");
  currentGame = 0;
  turn = 0;
}

function setMessage(str) {
  $("#message").append("<p>" + str + "</p>");
}

// checks if there is a winning combo on the board
function checkWinner() {
  const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

// passes state into the loop so getState() is only called once
  const state = getState();
  return winningCombos.some(combo => spotsMatch(combo, state));
}

// compares the passed in winning combo to the current game state to determine if they match and are not empty
function spotsMatch(combo, state) {
  var refCell = state[combo[0]];

  // if there is a winning combo then notify the user who one
  if ((refCell != "") && (refCell == state[combo[1]]) && (refCell == state[combo[2]])) {

    refCell == "X" ? setMessage("Player X Won!") : setMessage("Player O Won!");
    return true;
  } else {
    return false;
  }

}

function updateState(square) {
  square.innerText = player();
}

$(function () {
  attachListeners();
});
