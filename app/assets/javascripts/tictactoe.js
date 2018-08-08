// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;

$(document).ready(function() {
  attachListeners()
})

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  var board = {};

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] == board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    $('td').empty()
    turn = 0;
  } else if (turn === 9) {
    setMesasge('Tie game.');
    stopGame();
    saveGame();
  }
}

function attachListeners() {
  $('td').on("click", function() {
    if(!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })
  $("#previous").on("click", () => previousGame())
  $("#save").on("click", () => saveGame())
  $("#delete").on("click", () => deleteGame())
}

function saveGame() {
  let state = $('td').toArray().map(e => e.innerText);
  if (currentlyPlaying) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentlyPlaying}`,
      dataType: 'json',
      data: {state : state}
    });
  } else {
    $.post('/games', {state: state}, function(game) {
      currentlyPlaying = game.data.id
    });
  };
}

function previousGame(){
  $("#games").empty()
  $.get('/games').done(function(games){
    games.data.forEach(function(game){
      $("#games").append(`<button id="gameid-${game.id}">Game Number: ${game.id}</button></br>`)
      $('#gameid-' + game.id).click(() => resumeGame(game.id));
    })
  })
}

function resumeGame(gameId){
  $("#message").text("")
  let id = gameId;
  $.get(`/games/${gameId}`, function(game){
    let state = game.data.attributes.state
    $('td').text((index, square) => state[index])
    currentlyPlaying = id
    turn = state.join('').length

    checkWinner()
  })
}

function deleteGame(){
  $('td').empty()
  turn = 0
  currentlyPlaying = 0
}
