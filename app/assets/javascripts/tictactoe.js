// Code your JavaScript / jQuery solution here
const winning_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];
var turn = 0;
var game_id = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  return (turn % 2 === 0) ? "X" : "O";
}

function updateState(square) {
  // need to update game board with current player's game token using jQuery
  $(square).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  // get board
  var board = {};
  $('td').text((index, square) => board[index] = square);

  // checking for winning board against winning_combos
  winning_combos.forEach( position => {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] &&
      board[position[0]] !== "") {
        winner = true;
        setMessage(`Player ${board[position[0]]} Won!`);
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn ++;

  if (checkWinner()) {
    saveGame();
    clearGame();
  }
  else if (turn === 9){
    setMessage('Tie game.')
    saveGame();
    clearGame();
  }
}

function attachListeners() {
  $('td').on("click", function() {
    // if you click on a square, checks if the square is blank and there is no winner. If so, completes doTurn
    if(checkWinner() === false && this.innerHTML === "") {
      doTurn(this);
    };
  });

  //  AJAX for button clicks
  $('#save').on('click', function() { saveGame()} );
  $('#previous').on('click', function() { showGames()} );
  $('#clear').on('click', function() { clearGame()} );
}

function saveGame() {
  // get current board state in array
  var board = []
  $('td').text((index, square) => board[index] = square);

  var game_board = {state: board}

  if (game_id === 0){

    $.ajax({
      url: '/games',
      method: 'post',
      data: game_board
    }).done(function(resp){
      game = resp["data"];
      // added line below to get to work!
      game_id = game.id;
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
      // attach listener
      $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id))
    });
  } else {
    $.ajax({
      url: '/games/' + game_id,
      method: "PATCH",
      data: game_board
    });
  };
}

function reloadGame(gameId) {

  $.get('/games/' + gameId, function(g){
    game_id = g.data.id;
    turn = 0;
    $('#games').empty();
    $('td').each(function(i){
      $(this).text(g.data.attributes.state[i]);
      $(this).text() != "" ? turn++ : console.log("Empty");
    });
  });
}

function showGames() {
  //  get request to render games
  $.get('/games', function(games){
    // added line below to get to work!
    $('#games').empty();
    games.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button>`);
      // attach listener
      $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
    });
  });
}

function clearGame() {
  turn = 0;
  game_id = 0;
  $('td').empty();
}
