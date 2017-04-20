$(document).ready(function() {
  attachListeners()
})

var turn = 0
var gameSaved = false
var gameID = 0

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]


var attachListeners = () => {
  $("td").on("click", function(e) {
    doTurn(e)
  })
  getAllGames()
  saveGameListener()
}

var getAllGames = () => {
  $("#previous").on("click", function() {
    $.get("/games", function(data) {
      $("#games").text("")
      $.each(data, function(index, value) {
        var line = `<div data-game-id=${value["id"]}">Game | #${index+1}</div>`
        $("#games").append(line)
      })
    })
  })
}

var saveGame = () => {  //savegame function is only responsible for posting game data, listener is bound seperately
  var boardState = getBoardArray()
  var game = {}
  game.state = boardState
  game.turn = turn
  gameSaved = true
  $.post("/games", game).done(function(data) {
    gameID = data['id'] //set current gameID to the saved object's ID
  })
}

var updateGame = () => { //updategame function is only responsible for patching game data, listener is bound seperately
  var boardState = getBoardArray()
  var game = {}
  game.state = boardState
  game.turn = turn
  gameSaved = true
  $.ajax({
    url: `/games/${gameID}`,
    type: `PATCH`,
    data: game
  })
}

var saveGameListener = () => { //listener function for hijacking save button
  $("#save").on("click", function(e) {
    saveGame()
  })
}

var doTurn = e => {
  if (checkWinner()) {}
  if (e.currentTarget.innerText == '') {
    updateState(e)
    if (!checkWinner()) { turn += 1 }
    if (turn === 9) {
      message('Tie game')
      saveGame()
      resetGame()
    }
  } else {
    alert('Spot is taken, please try another.')
  }
}

var player = () => { // player by turn count
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

var updateState = (e) => { // uses player() to write X or O to selected boxes
  e.currentTarget.innerText = player()
}

var checkWinner = () => {
  var currentPlayer = player() // save current player value X or O
  var outcome = false // determine if game is won or lost

  $.each(winningCombinations, (index, value) => { // iterate over each winning combination
    var boardState = getBoardArray() // get board state for this turn
    if (boardState[value[0]] == currentPlayer && boardState[value[1]] == currentPlayer && boardState[value[2]] == currentPlayer) {
      message('Player ' + `${boardState[value[0]]}`+ ' Won!')
      outcome = true
      saveGame()
      resetGame()
    }
  })
  return outcome //return TRUE/FALSE depending on board state
}

var getBoardArray = () => { // function to arrayify-board state
  var array = []
  $('td').each(function(index, value) {
    array.push(value.innerText)
  })
  return array
}

var resetGame = () => { // resets game state to blank
    turn = 0
    gameID = 0
    gameSaved = false
    $('td').each(function(index, value) {
      value.innerText = ""
    })
}

var message = (string) => {
  $("#message").text(string)
}
