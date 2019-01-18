// Code your JavaScript / jQuery solution here

const WIN_COMBINATIONS = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var turn = 0
// if turn modulus 2 = 0, that means it will be falsey, and therefore returns the right side (X), 
// and any odd number % 2 = 1, so it would be truthy, and then return the left side (O)
var player = () => turn % 2 == 0 ? "X" : "O" 

var currentGame = 0

$(document).ready(function () {
  attachListeners()
})

var updateState = (square) => {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  let td = []
  let winner = false
  $("td").text(function (index, text) { td.push(text) })

  WIN_COMBINATIONS.forEach(function (combo) {
    if( td[combo[0]] == td[combo[1]] &&
      td[combo[1]] == td[combo[2]] &&
      td[combo[0]] != ""){
      var winnerToken = td[combo[0]]
      winner = true;
      setMessage(`Player ${winnerToken} Won!`)
    }
  });
  return winner;
}

var doTurn = (square) => {
  updateState(square)
  turn++
  if (checkWinner() == true) {
    saveGame()
    resetBoard()
  } else if (turn == 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

var tdClicked = () => {
  $("td").on("click", function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}

var attachListeners = () => {
  tdClicked()
  $('#previous').on('click', () => previousGames());
  $('#save').on('click', () => saveGame());
  $('#clear').on('click', () => resetBoard());
}

let resetBoard = () => {
  $("td").empty()
  turn = 0
  currentGame = 0
}

var previousGames = () => {
  $("#games").empty()
  $.get("/games", function (data) {
    if (data.data.length) {
      data.data.forEach(function (game) {
        gameState(game)
      })
    }
  })
}

var gameState = (game) => {
  console.log(game)
  // if (!`<button id="game-${game.id}">${game.id}</button>`) {
  $("#games").append(`<button id="game-${game.id}">${game.id}</button>`)
  $(`#game-${game.id}`).on('click',() => reloadGame(game.id))
 
} 

function reloadGame(id) {
  $.get(`/games/${id}`, function (game) {
    let state = game.data.attributes.state
    var n = 0
    state.map(function (i) {
      if (i == "X" || i == "O") {
        n++
      }
    })
    currentGame = game.data.id
    turn = n
    populateGame(id, state, turn )
    
  })
}
var saveGame = () => { 
  var gameData;
  let td = []

  $("td").text(function (index, text) { td.push(text) })
  gameData = { state: td };
  if (currentGame != 0) { // if currentGame has already been set with save button
    
    $.ajax({
      type: 'PATCH',  //patch over already saved game
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {  // if currentGame is still 0 (Note: 0 is *not* truthy in JavaScript)
    $.post('/games', gameData, function (game) {  // save game first time
      // debugger
      currentGame = game.data.id; // save game first time
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

var populateGame = (id, state, t ) => {
  turn = t 
  let index = 0
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
      index++
    }
  }
}
