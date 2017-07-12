$(document).ready(function() {
  attachListeners();
});

var turn = 0;  // Turn counter - first turn == 0, last possible turn == 8.

var WIN_COMBINATIONS = [  // [x,y]
//rows
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
//columns
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
//diagonals
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
];

// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
// When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
function attachListeners() {
  $("#clear").click(function() {
  });

  $("#previous").click(function() {
    $.get("/games", function(data) {
      var games_list = '';
      data.data.forEach(function(game) {
        games_list += `<button class="game" data-id="${game.id}">${game.id}</button><br>`
      });
      $('#games').html(games_list);
      // $(".productName").text(data["name"]);
      // $(".productBody").text(data["description"]);
      // re-set the id to current on the link
      // $(".js-next").attr("data-id", data["id"]);
      // $( ".result" ).html( data );
      // alert( "Load was performed." );
    });
  });

  $("#save").click(function() {
  });

  $("tbody").click(function(e) {
    if ( !checkWinner() && !checkTie() ) {
      doTurn(e.target);
    }
  });
}

// Returns true if the current board is full.
function checkTie() {
  if (turn == 8) {
    message("Tie game.");
    return true;
  }
  return false;
}

// Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke message(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function checkWinner() {
  for (let i = 0; i < WIN_COMBINATIONS.length; ++i) {
    var combo = WIN_COMBINATIONS[i];
    if ((is_position_taken(combo[0]) == true) && (position_value(combo[0])==position_value(combo[1])) && (position_value(combo[1])==position_value(combo[2]))) {
      message(`Player ${position_value(combo[0])} Won!`);
      return true;
    }
  }
  return false;
}

// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.
function doTurn(elem) {
  if (elem.innerHTML == '') {
    updateState(elem);
    if ( checkWinner() || checkTie() ) {
      resetBoard();
    } else {
      turn += 1;
    }
  }
}

// Accepts a string and adds it to the div#message element in the DOM.
var message = function(msg) {
  $('#message').text(msg);
};

// Returns whether or not a box has been used.
function is_position_taken(index) {
  return !(position_value(index) === "");
}

// Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
function player() {
    return (turn % 2) ? 'O' : 'X';
}

// Return the value at index.
function position_value(index) {
  return $('[data-x=' + index[0] + '][data-y=' + index[1] + ']').text();
}

// Set all boxes to be blank.
function resetBoard() {
  $('td').html('');
  turn = 0;
}

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
var updateState = function(elem) {
  $(elem).text(player());
}
