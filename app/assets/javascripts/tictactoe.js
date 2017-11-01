// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId;
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

$(document).ready(function() {
  attachListeners();
})

var player = () => {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  };
};

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $('#message').text(string);
}

//The some() method tests whether at least one element in the array passes
// the test implemented by the provided function.
function checkWinner() {
  var winner = false
  var board = {}

  //.text => can receive function that takes 2 arg (index # & string)
  $('td').text(function(index, square) {
    board[index] = square
  })

  winningCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    clearGame();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    };
  })

  $('#clear').on('click', function() {
    clearGame();
  })

  $('#save').on('click', function() {
    saveGame();
  })

  $('#previous').on('click', function() {
    previousGames();
  })
}

function clearGame() {
  $('td').empty();
  turn = 0;
  gameId = undefined;
}

function saveGame() {
  var state = []

  $('td').text(function(index, square){
    state.push(square)
  })

  var gameState = { state: state }

  if (gameId === undefined) {
    $.post("/games", gameState, function(game) {
      gameId = game.data.id
      $('#games').append(`<button id="game-id-${gameId}" data-id="${gameId}>Game ${gameId}</button><br>`);
      $(`#game-id-${gameId}`).on('click', loadGame);
    })
  } else {
    $.ajax({
      url: `/games/${gameId}`,
      type: 'PATCH',
      data: gameState
    })
  }
}

function previousGames() {
  $('#games').empty();
  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="game-id-${game.id}" data-id="${game.id}">Game ${game.id}</button><br>`)
      $(`#game-id-${game.id}`).on('click', loadGame)
    })
  })
}

function loadGame(event) {
  var id = event.target.dataset.id

  $.get(`/games/${id}`, function(game) {
    var gameState = game.data.attributes.state

    let index = 0;

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameState[index];
        index++;
      }
    }

    //turn counter && gameId

    turn = 0;
    for(let i = 0; i < gameState.length; i++){
      if(gameState[i] === "O" || gameState[i] === "X")
          turn++;
    }

    gameId = id
  })
}
