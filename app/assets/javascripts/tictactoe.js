$(document).ready(function() {
  attachListeners()
})

var turn = 0
var gameSaved = false
var gameId = 0

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


///LISTENERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var attachListeners = function() {
  $("td").on("click", function(e) {
    doTurn(e)
  })
  getAllGamesListener()
  saveGameListener()
}

var getAllGamesListener = function() { //binds previous button to show all old games
  $("#previous").on("click", function() {
    $.get("/games", function(data) {
      $("#games").text("")
      $.each(data, function(index, value) {
        var line = `<div class="gameLink" data-game-id=${value["id"]}">Game | #${index+1}</div>`
        $("#games").append(line)
      })
    }).done(function(data){setGameLinkListeners()}) //set gameLink listeners after you finish this
    })
  }

var saveGameListener = function() { //listener function for hijacking save button
  $("#save").on("click", function(e) {
    if (gameId === 0) {
      saveGame()
    } else {
      updateGame()
    }
  })
}

var setGameLinkListeners = function() {
	$('.gameLink').click(function(e){
		var game_id = $(this).data("game-id")
		var loading = $.get(`games/${game_id}`)
		loading.done(function(data){
			gameId = data['id']
			$.each($('td'), function(index, value){
				value.innerHTML = data["state"][index]
			})
			var getTurn = data["state"].filter(function(n) { return n != ""})
			turn = getTurn.length
		})
	})
}



///GAME FUNCTIONALITY AND CALLBACKS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var doTurn = function(e) { //primary turn taking engine. check if winner, otherwise make moves on board or report tie game
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

var player = function() { // player by turn count
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

var updateState = function(e) { // uses player() to write X or O to selected boxes
  e.currentTarget.innerText = player()
}

var checkWinner = function() {
  var currentPlayer = player() // save current player value X or O
  var outcome = false // determine if game is won or lost

  $.each(winningCombinations, function(index, value) { // iterate over each winning combination
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

var getBoardArray = function() { // function to arrayify-board state
  var array = []
  $('td').each(function(index, value) {
    array.push(value.innerText)
  })
  return array
}

var resetGame = function() { // resets game state to blank
    turn = 0
    gameID = 0
    gameSaved = false
    $('td').each(function(index, value) {
      value.innerText = ""
    })
}

var message = function(string) {
  $("#message").text(string)
}

///DATA STORAGE AND MANIPULATION FUNCTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var saveGame = function() {  //savegame function is only responsible for posting game data, listener is bound seperately
  var boardState = getBoardArray()
  var game = {}
  game.state = boardState
  game.turn = turn
  gameSaved = true
  var posting = $.post("/games", game)
  posting.done(function(data) {
    gameId = data['id']
  })
}

var updateGame = function() { //updategame function is only responsible for patching game data, listener is bound seperately
  var boardState = getBoardArray()
  var game = {}
  game.state = boardState
  game.turn = turn
  gameSaved = true
  $.ajax({
    url: `/games/${gameId}`,
    type: `PATCH`,
    data: game
  })
}
