var turn = 0;
var currentGame = 0;

//when doc is ready this sets up listeners
$(document).ready(function() {
  attachListeners();
});

//event listeners for buttons
function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', function(){
    saveGame()
  });

  $('#previous').on('click', function(){
    showPreviousGames()
  });

  $('#clear').on('click', function() {
    resetBoard()
  });
}

//keeps track of whick play to insert on move based off turn which is updated under doTurn()
function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

//is invoked on doTurn, puts correct player in space they clicked. 
function updateState(square) {
  $(square).text(player());
}

//invoked on doTurn() when there is a winner or tie
function setMessage(msg) {
  $('#message').text(msg);
}

//invoked by event listener when td is clicked. updates space/turn/checks for winner or tied game
function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    resetBoard();
  }
}

//is invoked on doTurn() after updateSate to see if any winningCombos are found on board, if they are it sets winning msg and returns True in doTurn. 
function checkWinner() {
  var winner = false;
  var board = {};

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]

  $('td').text((index, square) => board[index] = square);

  winningCombos.find(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

//is invoked on doTurn() after updateSate if checkWinner() or turn=9. also invoked on event listener #clear
function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

//is invoked on doTurn() after updateSate if checkWinner() or turn=9. also invoked on event listener #save
function saveGame() {
  var state = [];
  
  $('td').text((index, square) => {
    state.push(square);
  });

  //if current game is anything other than 0 that means it's already saved and has an id in DB
  if (currentGame===0) {
    $.post('/games', { state: state }, function(response) {
      currentGame = response.data.id;
      $('#games').append(`<button id="gameid-${response.data.id}">${response.data.id}</button><br>`);
      $("#gameid-" + response.data.id).on('click', function(){
        reloadGame(response.data.id)
      });
    });
    //if it is already in the db, now it just updates on save
  } else {
      $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { state: state }
    });
  }
}

//whick invoked, it empties the list on buttons in DOM so it dosn't repeat the list, then get request to get all games and uses the response data to invoke creatPrevGameButton() for each saved game
function showPreviousGames() {
  $('#games').empty();
  $.get('/games').done(function(savedGames) {
    savedGames.data.forEach(createPrevGameButton);
  });
}

//is invoked through showPreviousGames button to create the button for each saved game that when clicked will invoke reloadGame(). 
function createPrevGameButton(prevGame) {
  $('#games').append(`<button id="gameid-${prevGame.id}">${prevGame.id}</button><br>`);
  $(`#gameid-${prevGame.id}`).on('click', function(){
    reloadGame(prevGame.id)
  });
}

//takes in the gameId and makes a get request to that id. then sets up the game be setting it's currentGame,state,turn, and all spaces on board.
function reloadGame(gameId){
  $.get(`/games/${gameId}`).done(function(game){
    currentGame = game.data.id
    const state = game.data.attributes.state
    turn  = 0
    var space = $('td')

    for (var i = 0; i < 9; i++) {
      space[i].innerHTML = state[i]
      if (state[i] !== "") { turn++ }
    }
  })
}
