var turn = 0
var board = ["", "", "", "", "", "", "", "", ""]

// Returns the token of the player whose turn it is, 'X' when even, '0' when odd
function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  };
}

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board
function updateState(td) {
  var token = ""
  if (player() === 'X') {
    token = 'X';
  } else {
    token = 'O';
  }
  $(td).append(token);
}

// Accepts a string and adds it to the div#message element in the DOM
function setMessage(msg) {
  $('#message').append(msg);
}

// Returns true if current board contains any winning combinations
// If there is a winner, should invoke setMessage(), passing in who won
function checkWinner() {
  var winner = false;

  const winCombo = [[0,1,2], [3,4,5], [6,7,8],
                    [0,3,6], [1,4,7], [2,5,8],
                    [0,4,8], [2,4,6]];

  $('td').text((index, td) => board[index] = td)

  winCombo.some(function(combo) {
    if (board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[0]] != "") {
      winner = true;
      setMessage("Player " + board[combo[0]] + " Won!");
    };
  });

  return winner;
}

// Increments the turn variable by 1
// Invokes the updateState() function, passing it the element that was clicked
// Invokes the checkWinner() function, determining whether the move results in a winning play
function doTurn(td) {
  updateState(td);

  turn += 1;

  if (checkWinner()) {
    //reset board and counter
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.")
    clearGame();
  }
}

// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements
// When a user clicks on a square on the game board, the event listener should invoke doTurn() function and pass it in the element that was clicked
// Must be invoked inside either a $(document).ready() for jQuery, or a window.onload = () => {} for vanilla JavaScript
$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  const squares = $('td')

  for (var i = 0; i < squares.length; i++) {
    $(squares[i]).on('click', function(event) {

      //var token = player();
      //var index = 0

      //  board[0] | board[1] | board[2]
      // --------------------------------
      //  board[3] | board[4] | board[5]
      // --------------------------------
      //  board[6] | board[7] | board[8]

      //if (this.dataset['y'] === "1") {
      //  index = parseInt(this.dataset['x']) + 3;
      //} else if (this.dataset['y'] === "2") {
      //  index = parseInt(this.dataset['x']) + 6;
      //} else {
      //  index = parseInt(this.dataset['x'])
      //}
      if ($.text(this) == "" && !checkWinner()) {
        doTurn(this);
      }
    })
  }

	//$('td').on('click', function() {
		//var col = $(this).data("x");
		//var row = $(this).data("y");
		//})
  //})
}

function saveGame() {

}

function clearGame() {
  $('td').empty();
  turn = 0;
}
