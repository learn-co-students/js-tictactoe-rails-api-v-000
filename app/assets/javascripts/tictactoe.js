// Code your JavaScript / jQuery solution here

var turn = 0
var currentGame = 0



var WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function player () {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState (square) {
  var token = player()
  $(square).text(token)
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  var winner = WIN_COMBINATIONS.some(function(combo){
    var checkCombo = combo.map(function(i){
      return $('td')[i].textContent
    })
    return (checkCombo[0] === checkCombo[1] &&
            checkCombo[0] === checkCombo[2] &&
            checkCombo[0] !== "") 
  })
  if (winner) {
    setMessage(`Player ${player()} Won!`)
  }
  return winner
}

function doTurn(move) {
  if (checkWinner() !== true) {
    updateState(move)
    move.removeEventListener('click', placeToken, false)
    if (checkWinner() === true) {
      saveGame()
      boardReset()
    } else if (turn === 8){
      setMessage("Tie game.")
      saveGame()
      boardReset()
    } else {
      turn += 1
    }
  }
}

function boardReset() {
  for (var i = 0; i < 9; i++) {
    $('td')[i].innerHTML = ''
  }
  turn = 0 
  currentGame = 0
  attachListeners()
  // $("#message").empty()
  // xgamesDiv.innerHTML = ''
}

var placeToken = () => { doTurn(event.target) }

// function placeToken() {
//   doTurn(event.target)
// }

function attachListeners() {

  for (var i=0; i < 9; i++) {
    $('td')[i].addEventListener('click', placeToken, false)
  }
  // $('td').on("click", placeToken)
}

function createButton(game) {
  var element = $("<button/>", {
    text: "Game " + game.id,
    id: 'btn_' + game.id,
    click: function(){
      getSavedGame(game.id)
    }
  })
  $("#games").append(element)
}

function getSavedGame(gameId) {
  $.get('/games/' + gameId, function (game){
    boardReset()
    var state = game.data.attributes.state
    populateBoard(state)
    setTurn(state)
    currentGame = game.data.id
  })
}

function populateBoard(arr) {
  for (var i = 0; i < 9; i++) {
    $('td')[i].innerHTML = arr[i]
  }
}

function setTurn(arr) {
  turn = arr.reduce((p, c) => {
    if(c === "X" || c === "O")
      p++
    return p
  })

}

function getPrevious() {
  $.get('/games', function (data) {
    var gameData = data["data"]
    if (gameData.length > 0) {
      gameData.forEach(function (game) {
        //search #games div for already existing game ids, return ids in an array for testing
        var existingIds = $("#games *").map(function (index, element) {
          return this["id"].replace("btn_", "")
        }).get()
        //this code creates a new button if the game.id is not in the existingIds array
        if (!existingIds.includes(game.id)) {
          createButton(game)
        }
      }, this);
    }
  })
}

function saveGame() {
  var state = []

  $('td').text((index, square) => state.push(square))

  populateBoard(state)

  var gameData = { state: state }

  if (currentGame) {
    $.ajax({
      type: "patch",
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {

    $.post('/games', gameData, function (game) {
      currentGame = game.data.id
      // createButton(game)

    })
  }
}

$(document).ready(function() {
  attachListeners()

  $("#previous").click(getPrevious)

  $("#save").click(saveGame)

  $("#clear").click(boardReset)
})