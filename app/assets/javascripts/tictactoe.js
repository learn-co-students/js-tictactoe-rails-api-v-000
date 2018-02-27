var turn = 0;
var gameId = 0;
var board = $('td')
const winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                   [0, 3, 6], [1, 4, 7], [2, 5, 8],
                   [0, 4, 8], [2, 4, 6]]

function player() {
//Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square){
//Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
  square.innerHTML += player()
}

function setMessage(str) {
//Accepts a string and adds it to the div#message element in the DOM.
  $('#message').append(str)
}

function checkWinner() {
// Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
  const winner = winCombos.find(combo => {
    return combo.every(idx => board[idx].innerHTML === 'X' || combo.every(idx => board[idx].innerHTML === 'O'))
  });

  if (winner) {
    setMessage(`Player ${board[winner[0]].innerHTML} Won!`);
    return true;
  }
  else {
    return false;
  }
}

function newGame() {
  board.empty()
  turn = 0;
  gameId = 0;
}

function saveGame() {
  var state = [];
  var gameData;

  board.text((square) => {
    state.push(square)
  });

  gameData = {state: state};

  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameData
    })
  }
  else {
    $.post('/games', gameData, function(game) {
      gameId = game.data.id
    })
  }

}

function tieGame() {
  if (turn === 9 ) {
    saveGame();
    return true;
  }
  else {
    return false
  }
}

function doTurn(square) {
// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.
  if ($(square).html() != 'X' && $(square).html() != 'O') {
    updateState(square);
    turn++;
  }


}

function attachListeners() {
// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
// When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
// NOTE: attachListeners() must be invoked inside either a $(document).ready() (jQuery) or a window.onload = () => {} (vanilla JavaScript). Otherwise, a number of the tests will fail (not to mention that your game probably won't function in the browser).
}
