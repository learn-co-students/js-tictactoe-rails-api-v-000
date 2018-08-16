const winCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var turn = 0
var currentGame = 0

$(document).ready(function() {
  attachListeners();
});


var player = function () {
  if ( this.turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}


var updateState = function (square) {
  // 2. accepts argument of the position
  // 3. find the current token using player
  // 4. updates that element in the table with current token
  var token = player();

  $(square).text(token);

}

var setMessage = function(message) {
    $("#message").text(message)
}


// for development purposes


function populateBoard(arr) {
  var squares = window.document.querySelectorAll('td');
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = arr[i];
  }
}

var checkWinner = function() {
  // Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
  var board = {}
  var winner = false
  // populateBoard(['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O']);
  $('td').text((index, square) => board[index] = square);
  // If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
  winCombinations.some(function(combo){
    if(board[combo[0]] !== "" && board[combo[0]] == board[combo[1]] && board[combo[1]] ==  board[combo[2]]){
      // Player (winning token) Won!
       var winningToken = board[combo[0]]
       setMessage(`Player ${winningToken} Won!`)
       return winner = true
    }
  })
  return winner
}


var doTurn = function(square) {

  var boardValues = []
  // Increments the turn variable by 1.

  // Invokes the updateState() function, passing it the element that was clicked.

  updateState(square)
  turn++ ;
  // Invokes checkWinner() to determine whether the move results in a winning play.

  // invokes the setMessage() function with the argument "Tie game." when the game is tied
  // check if the board is not won and the board if full => check the there are no blank spaces

  $('td').text((index, square) => boardValues[index] = square);

  if(checkWinner()){
    saveGame();
    clearGame();
  } else if( boardValues.every(value => value !== "")){
    setMessage('Tie game.');
    saveGame();
    clearGame();
  }
}

var saveGame = function() {
  // get the current board
  var boardValues = []
  $('td').text((index, square) => boardValues[index] = square);
  var gameData = {state: boardValues}
  // update if already existing game
  if(currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    // pass that board to create route as params
    $.post('/games', gameData, function(game){
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`)
      // attach listener
      $(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id))
    })
  }
}

var showGames = function() {
  // uses get request to render all games
  $.get('/games', function(games){
    $('#games').empty();
    games.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button>`);
      // attach listener
      $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
    })
  })
}

var clearGame = function() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

var reloadGame = function(gameID) {
  $('#games').empty();
  // send get request to show route
  $.get(`/games/${gameID}`, function(game){
    // show the previous board
    board = game.data.attributes.state
    populateBoard(board)
    // set the correct turn
    turn = board.filter(square => !!square).length
    // set the correct currentGame
    currentGame = game.data.id
  })
}

var attachListeners = function() {
  $("td").on("click", function() {
    if(!this.innerHTML && !checkWinner()){
      doTurn(this);
    }
  })

  // implement AJAX get and post reqs here
  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showGames())
  $('#clear').on('click', () => clearGame())
};
