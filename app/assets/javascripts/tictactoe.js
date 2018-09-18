// Code your JavaScript / jQuery solution here
$(document).ready(attachListeners)

function attachListeners() {
  let tds = document.querySelectorAll('td')

  for (let i = 0; i < tds.length; i++) {
    tds[i].addEventListener('click', function () {
      if (checkWinner() == false && tieGame() == false) {
        doTurn(tds[i])
      }
    })
  }

  $('#previous').click(function(event) {
    getPreviousGames();
  });

  $('#save').click(function(event) {
    saveGame();
  });

}

//BOARD + GAMEPLAY
const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var board = Array.from($('td')).map(s => s.innerHTML)
var turn = 0
var currentGame = 0

var currentBoard = function() {
  var board = []
  $("td").each(function (i) {
    board.push($(this).text())
  })
  return board
}

function positionTaken(index) {
  if (currentBoard()[index] !== "") { return true }
  else { return false }
}

function doTurn(cell) {
  if (cell.innerHTML == "") {
    updateState(cell)
    if (checkWinner() == true) {
      checkWinner()
      saveGame(true)
      resetBoard()
    } else if (tieGame() == true) {
        setMessage('Tie game.')
        saveGame(true)
        resetBoard()
      } else {
        this.turn += 1
      }
    }
  }

//PREVIOUS BUTTON

function previousGame(gameId, previousState) {
  resetBoard()
  //let currentGame = gameId
  var currentState = $.getJSON("/games/" + gameId, function(data) {
    var currentState = Array.from(data["data"]["attributes"].state)
    var i = 0
    $("td").each(function () {
      this.innerHTML = currentState[i]
      if (this.innerHTML == "X" || this.innerHTML == "O") {
        turn += 1
      }
      i++
    })
    debugger
    currentGame = gameId
  })
}

var showGame = function(game) {
  //buttons = buttons.add(`<button data-gameid='${id}' data-state='${state}' onclick='previousGame(this.getAttribute(${id}), this.getAttribute("${state}"))'>Game: ${id}</button><br>`)
  var newGame = $(`<BUTTON data-state='${game.attributes.state}' data-gameid='${game.id}'>Game: ${game.id}</BUTTON><br>`)
  newGame.click(function () {
    previousGame(this.getAttribute("data-gameid"), this.getAttribute("data-state"))

  })
  return newGame
}

var getPreviousGames = function() {
  $.getJSON("/games", function(data) {
    showPreviousGames(data["data"])
  })
}

var showPreviousGames = function(games) {
  var gameList = $()
  games.forEach(function(game) {
    gameList = gameList.add(showGame(game))
  })
  $("#games").html(gameList)
}

//SAVE BUTTON

var saveGame = function(winOrDraw) {
  var url
  var method

  if (currentGame != 0) {
    url = '/games/' + currentGame
    method = 'PATCH'
  } else {
    url = '/games'
    method = 'POST'
  }
  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: currentBoard()
      }
    },
    success: function(data) {
      if(winOrDraw) {
        resetBoard();
      } else {

        currentGame = data["data"].id;
      }
    }
  })
}

//CLEAR BUTTON

$(function () {
  $("#clear").on("click", function (e) {
    e.preventDefault();
    resetBoard();
  })
})

//Begin helper functions

function updateState(cell) {
  let token = player()
  cell.innerHTML = token
}

function won(array) {
  if (positionTaken(array[0]) == true) {
    if (currentBoard()[array[0]] == currentBoard()[array[1]] && currentBoard()[array[0]] == currentBoard()[array[2]] &&
    currentBoard()[array[1]] == currentBoard()[array[2]]) { return true }
      else { return false }
  } else { return false }
}

function resetBoard() {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function fullBoard() {
  let notFull = function(e) {
    return e == ""
  }
  return !currentBoard().some(notFull)
}

function tieGame() {
  if (fullBoard() == true && checkWinner() == false) {
    return true
  } else {
    return false
  }
}

function player() {
  if (this.turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function setMessage(string) {
  $("#message").html(string)
}


function checkWinner() {
  for (var i = 0; i < winCombinations.length; i++) {
    if (won(winCombinations[i]) == false) {
      continue
    } else {
      if (currentBoard()[winCombinations[i][0]] == 'X') {
        setMessage('Player X Won!')
      } else if (currentBoard()[winCombinations[i][0]] == 'O') {
        setMessage('Player O Won!')
      }
      return true
      break
    }
  }
  return false
}
