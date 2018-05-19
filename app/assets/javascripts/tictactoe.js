// On document ready, add the click and button listeners
$(function () {
  turn = 0;
  attachListeners();
});

//---- ATTACH LISTENERS ------
function attachListeners() {
  $('tbody').on('click', 'td', function () {
    doTurn(this); // pass the clicked on 'td' to doTurn
  })

  $('#save').on('click', saveGame)
  $('#previous').on('click', previousGames)
  $('#clear').on('click', clearGame)
}

//---- SAVE GAME ------
// Send requests to either save a new or update a previously saved game
function saveGame() {
  let game_state = board_to_array()

  if (parseInt($('table').data('game_id')) > -1) {
    // game has been saved before
    $.ajax({
      method: 'PATCH',
      url: '/games/' + $('table').data('game_id'),
      data: { state: game_state }
    })
  }
  else {
    // game has not yet been saved
    $.ajax({
      method: 'POST',
      url: '/games',
      data: { state: game_state }
    })
    .done(function(game) { // game is the newly saved game object
      // add a game_id attribute to the table to identify it
      $('table').data('game_id', game['data']['id']);
    });
  }
}

//---- CLEAR GAME ------
function clearGame() {
  turn = 0;  // reset turn count
  $('td').empty(); // empty all of the squares
  $('table').data('game_id', ''); // reset game_id attribute of the board
}

//---- PLAYER ------
function player() {
  return (turn % 2 === 0) ? 'X' : 'O'
}

//---- UPDATE STATE ------
// Try to place a player token in the provided space on the board
function updateState(space) {
  if ($(space).text() === '') {
    $(space).html(player())
    return true;
  }
  else {
    setMessage("That space is already taken. Try again.")
    return false;
  }
}

//---- SET MESSAGE ------
function setMessage(message) {
  $('#message').html(message);
}

//---- CHECK WINNER ------
// True if someone has won, false if not
function checkWinner() {
  let winner = '';

  if (winner = winningCombination()) {
    setMessage(`Player ${winner} Won!`)
    return true;
  }
  else {
    return false;
  }
}

//---- WINNING COMBINATION ------
// Check the board to see if anyone has won
function winningCombination() {
  const WIN_COMBINATIONS = [
   [0,1,2],  // Top row
   [3,4,5],  // Middle row
   [6,7,8],  // Bottom row
   [0,3,6],  // First column
   [1,4,7],  // Middle column
   [2,5,8],  // Last column
   [0,4,8],  // Diagonal from top left to bottom right
   [6,4,2]   // Diagonal from bottom left to top right
  ]
  
  let squares = board_to_array()

  for (const combination of WIN_COMBINATIONS) {
  // combination: e.g. [0,1,2]

    let combination_moves = [squares[combination[0]],
                             squares[combination[1]],
                             squares[combination[2]]]

    if ((combination_moves.every(token => token === 'X')) ||
        (combination_moves.every(token => token === 'O'))) {
      return combination_moves[0]; // contains the winner's token
    }
  }

  return false;
}

//---- DO TURN ------
// Play a turn
function doTurn(space) {

  if (updateState(space)) { // try to place a token on the given space
    turn += 1;

    if (checkWinner()) { // someone won
      saveGame();
      clearGame();
    } else if (turn === 9) { // tie game
      setMessage("Tie game.")
      saveGame();
      clearGame();
    }
  }
}

//---- BOARD TO ARRAY ------
// Return the curent state of the board as an Array
function board_to_array() {
  return $.map($('td'), function(space, i) { return space.innerHTML;});
}

//---- PREVIOUS GAMES ------
// Load the previous games and create buttons for each
function previousGames() {
  $('#games').empty();
  let button, gameNumber;

  $.get('/games', function(response) {
    for (let game of response['data']) {
      gameNumber = 'Game #' + game['id']

      button = $('<button></button>').text('Load Game')
      button.data('game_id', game['id'])
      button.addClass('load_game')

      $('#games').append(gameNumber, button, '<br>')
    }
  }).done(attachPreviousButtonListeners);
}

//---- ATTACH PREVIOUS BUTTON LISTENERS  ------
// Set actions for the "load game" buttons for prior games
function attachPreviousButtonListeners() {
  $('.load_game').on('click', function() {

    $.get('/games/' + $(this).data('game_id')).done(function(response) {
      updateGameState(response['data'])
    });
  });
}

//---- UPDATE GAME STATE ------
// Loads in the game from a previous game
function updateGameState(game) {
  turn = 0;
  let board = game['attributes']['state'];
  let squares = $('td');

  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = board[i]
    if (board[i] !== '') { turn++ };   // figure out which turn we left off on
  }

  $('table').data('game_id', game['id']); // set the game_id of the board
}
